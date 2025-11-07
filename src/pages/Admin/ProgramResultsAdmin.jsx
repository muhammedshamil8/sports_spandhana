import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/config/fbase';

const ProgramResultsAdmin = () => {
  const [participants, setParticipants] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('create'); // 'view' | 'create'
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    programId: '',
    stage: 'on stage',
    isGroupItem: false,
    teamName: '',
    captainId: '',
    winners: [{ participantId: '', place: '1st' }]
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const participantsSnap = await getDocs(collection(db, 'participants'));
        const programsSnap = await getDocs(collection(db, 'programs'));
        const resultsSnap = await getDocs(collection(db, 'programResults'));

        setParticipants(participantsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setPrograms(programsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setResults(resultsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        setLoading(false);
      } catch (error) {
        console.error(error);
        setErrorMessage('Failed to fetch data.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Handle program selection
  const handleProgramSelect = (value) => {
    const selectedProgram = programs.find(p => p.id === value);
    setFormData({
      ...formData,
      programId: value,
      stage: selectedProgram?.stage || 'on stage',
      isGroupItem: selectedProgram?.isGroupItem || false,
    });
  };

  // ✅ Handle input for winners
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedWinners = [...formData.winners];
    updatedWinners[index][name] = value;
    setFormData({ ...formData, winners: updatedWinners });
  };

  // ✅ Add or remove winner rows
  const handleAddWinner = () => {
    setFormData({
      ...formData,
      winners: [...formData.winners, { participantId: '', place: '1st' }]
    });
  };
  const handleRemoveWinner = (index) => {
    const updated = [...formData.winners];
    updated.splice(index, 1);
    setFormData({ ...formData, winners: updated });
  };

  // ✅ Submit logic (Group vs Individual)
const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccessMessage('');
  setErrorMessage('');
  setSubmitting(true);

  try {
    // Basic validation
    if (!formData.programId || formData.winners.some(w => !w.participantId)) {
      setErrorMessage('Please select a program and all participants.');
      setSubmitting(false);
      return;
    }

    const selectedProgram = programs.find(p => p.id === formData.programId);
    if (!selectedProgram) {
      setErrorMessage('Selected program not found.');
      setSubmitting(false);
      return;
    }

    const programName = selectedProgram.title;
    const isGroup = selectedProgram.isGroupItem;

    // Object to track points per team
    const teamPointsToAdd = {};

    // Process winners
    const winnersData = await Promise.all(formData.winners.map(async (winner) => {
      const participantDoc = await getDoc(doc(db, 'participants', winner.participantId));
      if (!participantDoc.exists()) {
        throw new Error(`Selected participant not found: ${winner.participantId}`);
      }

      const participantData = participantDoc.data();
      const points = winner.place === '1st' ? 10 :
                     winner.place === '2nd' ? 5 :
                     winner.place === '3rd' ? 3 : 1;

      const teamName = participantData.team || '';
      if (teamName) {
        teamPointsToAdd[teamName] = (teamPointsToAdd[teamName] || 0) + points;
      }

      const displayName = isGroup ? `${participantData.name} & Team` : participantData.name;

      return {
        id: winner.participantId,
        name: displayName,
        team: teamName,
        year: participantData.year || '',
        points,
        position: winner.place
      };
    }));

    // Add result document
    const resultData = {
      programId: formData.programId,
      programName,
      stage: selectedProgram.stage,
      isGroupItem: isGroup,
      winners: winnersData,
      timestamp: new Date(),
    };

    await addDoc(collection(db, 'programResults'), resultData);

    // Update team points
    for (const [teamName, addPoints] of Object.entries(teamPointsToAdd)) {
      if (!teamName) continue;

      const q = query(collection(db, 'teams'), where('name', '==', teamName));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const teamDoc = snapshot.docs[0];
        const currentPoints = teamDoc.data().totalPoints || 0;
        await updateDoc(doc(db, 'teams', teamDoc.id), {
          totalPoints: currentPoints + addPoints
        });
      } else {
        await addDoc(collection(db, 'teams'), {
          name: teamName,
          totalPoints: addPoints
        });
      }
    }

    // Reset form
    setFormData({
      programId: '',
      stage: 'on stage',
      isGroupItem: false,
      winners: [{ participantId: '', place: '1st' }]
    });

    setSuccessMessage('Results added successfully!');
  } catch (err) {
    console.error('Error adding result:', err);
    setErrorMessage(`Failed to add result: ${err.message}`);
  } finally {
    setSubmitting(false);
  }
};



  // ✅ Delete result (with rollback)
  const handleDeleteResult = async (resultId) => {
    if (!window.confirm('Delete this result? Points will be rolled back.')) return;
    try {
      const resultRef = doc(db, 'programResults', resultId);
      const resultSnap = await getDoc(resultRef);
      const resultData = resultSnap.data();

      if (resultData.isGroupItem) {
        const teamQuery = query(collection(db, 'teams'), where('name', '==', resultData.team));
        const teamSnap = await getDocs(teamQuery);
        if (!teamSnap.empty) {
          const teamRef = doc(db, 'teams', teamSnap.docs[0].id);
          const currentPoints = teamSnap.docs[0].data().totalPoints || 0;
          await updateDoc(teamRef, { totalPoints: Math.max(0, currentPoints - resultData.points) });
        }
      } else {
        // rollback individuals + teams
        const teamAdjust = {};
        for (const winner of resultData.winners) {
          const pRef = doc(db, 'participants', winner.id);
          const pSnap = await getDoc(pRef);
          if (pSnap.exists()) {
            const currentPts = pSnap.data().totalPoints || 0;
            await updateDoc(pRef, { totalPoints: Math.max(0, currentPts - winner.points) });
          }
          if (winner.team) {
            teamAdjust[winner.team] = (teamAdjust[winner.team] || 0) + winner.points;
          }
        }
        for (const [teamName, pts] of Object.entries(teamAdjust)) {
          const teamQuery = query(collection(db, 'teams'), where('name', '==', teamName));
          const teamSnap = await getDocs(teamQuery);
          if (!teamSnap.empty) {
            const tRef = doc(db, 'teams', teamSnap.docs[0].id);
            const current = teamSnap.docs[0].data().totalPoints || 0;
            await updateDoc(tRef, { totalPoints: Math.max(0, current - pts) });
          }
        }
      }

      await deleteDoc(resultRef);
      setResults(results.filter(r => r.id !== resultId));
      setSuccessMessage('Result deleted and points rolled back.');
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to delete result.');
    }
  };

  if (loading) return <p className="p-6 text-gray-700">Loading...</p>;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-bold">Program Results Admin</h2>
        <button
          onClick={() => setViewMode(viewMode === 'view' ? 'create' : 'view')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {viewMode === 'view' ? 'Add Results' : 'View Results'}
        </button>
      </div>

      {successMessage && <div className="m-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded">{successMessage}</div>}
      {errorMessage && <div className="m-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">{errorMessage}</div>}

      {viewMode === 'create' ? (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="font-semibold block mb-1">Program</label>
            <select
              value={formData.programId}
              onChange={(e) => handleProgramSelect(e.target.value)}
              className="w-full bg-[#FFDAE1] px-4 py-2 border rounded-md"
            >
              <option value="">Select Program</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>

              {formData.winners.map((winner, i) => (
                <div key={i} className="grid grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="font-semibold block mb-1">Participant</label>
                    <select
                      name="participantId"
                      value={winner.participantId}
                      onChange={(e) => handleInputChange(e, i)}
                      className="w-full bg-[#FFDAE1] px-4 py-2 border rounded-md"
                    >
                      <option value="">Select Participant</option>
                      {participants.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - {p.department}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Place</label>
                    <select
                      name="place"
                      value={winner.place}
                      onChange={(e) => handleInputChange(e, i)}
                      className="w-full bg-[#FFDAE1] px-4 py-2 border rounded-md"
                    >
                      <option value="1st">1st</option>
                      <option value="2nd">2nd</option>
                      <option value="3rd">3rd</option>
                    </select>
                  </div>
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveWinner(i)}
                      className="text-sm text-white bg-red-500 px-2 py-1 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddWinner}
                className="text-white bg-pink-500 hover:bg-pink-700 px-3 py-1 rounded"
              >
                + Add Winner
              </button>

          <button
            disabled={submitting}
            type="submit"
            className={`w-full py-3 rounded-md font-bold text-white ${submitting ? 'bg-gray-400' : 'bg-[#E1072E] hover:bg-[#83041B]'}`}
          >
            {submitting ? 'Saving...' : 'Save Result'}
          </button>
        </form>
      ) : (
        <div className="p-6">
          <h3 className="text-lg font-bold mb-3">Results List</h3>
          {results.length === 0 ? (
            <p className="text-gray-600">No results found.</p>
          ) : (
            <table className="min-w-full border bg-white rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Program</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Team/Captain</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{r.programName}</td>
                    <td className="px-4 py-2">{r.isGroupItem ? 'Group' : 'Individual'}</td>
                    <td className="px-4 py-2">
                      {r.isGroupItem ? `${r.team} (${r.captain})` : r.winners?.map(w => w.name).join(', ')}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteResult(r.id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgramResultsAdmin;
