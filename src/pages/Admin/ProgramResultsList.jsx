import { useState } from 'react';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/fbase';

const AddProgramResultForm = ({ onResultAdded }) => {
  const [formData, setFormData] = useState({
    participantName: '',
    department: '',
    year: '',
    team: '',
    programId: '',
    points: '',
    stage: 'on stage',
    isGroupItem: false,
  });

  const [loading, setLoading] = useState(false); // loading state

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // start loading
    try {
      const { participantName, department, year, team, programId, points, stage, isGroupItem } = formData;

      if (!team || !programId || !points) {
        alert('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      // Prepare result data
      let resultData = {
        team,
        programId,
        points: Number(points),
        stage,
        timestamp: new Date(),
        isGroupItem,
      };

      if (isGroupItem) {
        // Save only captain and team info
        resultData.participantName = participantName || 'Captain';
        resultData.department = department || '';
        resultData.year = year || '';
      } else {
        // Normal participant result
        resultData.participantName = participantName;
        resultData.department = department;
        resultData.year = year;
      }

      // Add result to Firestore
      await addDoc(collection(db, 'programResults'), resultData);

      // Update team's total points
      const teamQuery = doc(db, 'teams', team);
      const teamSnap = await getDoc(teamQuery);

      if (teamSnap.exists()) {
        const currentPoints = teamSnap.data().points || 0;
        await updateDoc(teamQuery, {
          points: currentPoints + Number(points),
        });
      }

      alert('Result added successfully!');
      onResultAdded?.(); // trigger parent refresh
      setFormData({
        participantName: '',
        department: '',
        year: '',
        team: '',
        programId: '',
        points: '',
        stage: 'on stage',
        isGroupItem: false,
      });
    } catch (error) {
      console.error('Error adding result:', error);
      alert('Something went wrong.');
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Add Program Result</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Program ID</label>
          <input
            name="programId"
            value={formData.programId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter Program ID"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Team</label>
          <input
            name="team"
            value={formData.team}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter Team Name"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Points</label>
          <input
            name="points"
            type="number"
            value={formData.points}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter Points"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Stage</label>
          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="on stage">On Stage</option>
            <option value="off stage">Off Stage</option>
          </select>
        </div>

        <div className="col-span-2 flex items-center">
          <input
            type="checkbox"
            name="isGroupItem"
            checked={formData.isGroupItem}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Group Item</label>
        </div>

        {/* Only show individual fields if NOT group */}
        {!formData.isGroupItem && (
          <>
            <div>
              <label className="block font-medium mb-1">Participant Name</label>
              <input
                name="participantName"
                value={formData.participantName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter Name"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Department</label>
              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter Department"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Year</label>
              <input
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter Year"
              />
            </div>
          </>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-4 px-4 py-2 rounded-md text-white ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Adding...' : 'Add Result'}
      </button>
    </form>
  );
};

export default AddProgramResultForm;
