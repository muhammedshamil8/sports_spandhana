import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db } from '@/config/fbase';
import { db } from '@/config/fbase';


const ProgramResultsAdmin = () => {
  
  const [participants, setParticipants] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    programId: '',
    stage: 'on stage',
    isGroupItem: false,
    winners: [{ participantId: '', place: '1st' }]
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch participants and programs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch participants
        const participantsSnapshot = await getDocs(collection(db, 'participants'));
        const participantsList = participantsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setParticipants(participantsList);

        // Fetch published programs
        const publishedProgramsQuery =collection(db, 'programs');
        const programsSnapshot = await getDocs(publishedProgramsQuery);
        const programsList = programsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPrograms(programsList);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const winners = [...formData.winners];
    winners[index][name] = value;
    setFormData({
      ...formData,
      winners
    });
  };

  const handleAddWinner = () => {
    setFormData({
      ...formData,
      winners: [...formData.winners, { participantId: '', place: '1st' }]
    });
  };

  const handleRemoveWinner = (index) => {
    const winners = [...formData.winners];
    winners.splice(index, 1);
    setFormData({
      ...formData,
      winners
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
  
    try {
      // Validate inputs
      if (!formData.programId || formData.winners.some(winner => !winner.participantId)) {
        setErrorMessage('Please select a program and all participants');
        return;
      }
  
      // Get program name from the selected program
      const selectedProgram = programs.find(program => program.id === formData.programId);
      if (!selectedProgram) {
        setErrorMessage('Selected program not found');
        return;
      }
      const programName = selectedProgram.title;
  
      // Process winners data
      const winnersData = await Promise.all(formData.winners.map(async (winner) => {
        const participantDoc = await getDoc(doc(db, 'participants', winner.participantId));
        if (!participantDoc.exists()) {
          throw new Error(`Selected participant not found: ${winner.participantId}`);
        }
  
        const participantData = participantDoc.data();
        const points = winner.place === '1st' ? 10 : 
                        winner.place === '2nd' ? 7 : 
                        winner.place === '3rd' ? 5 : 1;
  
        // Add null checks for each property
        return {
          id: winner.participantId,
          name: participantData.name || '',
          team: participantData.team || formData.team || '',
          year: participantData.year || '',
          points: points,
          position: winner.place
        };
      }));
  
      // Create result document with null checks
      const resultData = {
        programId: formData.programId,
        programName: programName || '',
        winners: winnersData,
        // Use form data if selectedProgram properties are undefined
        stage: selectedProgram.stage || formData.stage || 'on stage',
        isGroupItem: selectedProgram.isGroupItem !== undefined ? selectedProgram.isGroupItem : formData.isGroupItem,
        timestamp: new Date()
      };
  
      // Log data before adding to Firestore for debugging
      console.log('About to add data to Firestore:', JSON.stringify(resultData));
  
      // Add to programResults collection
      await addDoc(collection(db, 'programResults'), resultData);
  
      // Track teams that need to be updated
      const teamPointsToAdd = {};
  
      // Update participant's total points
      for (const winner of formData.winners) {
        const participantRef = doc(db, 'participants', winner.participantId);
        const participantDoc = await getDoc(participantRef);
        const participantData = participantDoc.data();
        
        const points = winner.place === '1st' ? 10 : 
                       winner.place === '2nd' ? 7 : 
                       winner.place === '3rd' ? 5 : 1;
                       
        const totalPoints = (participantData.totalPoints || 0) + points;
        
        // Update participant's total points if not a group event
        if (!selectedProgram.isGroupItem) {
          await updateDoc(participantRef, {
            totalPoints: totalPoints
          });
        }
  
        // Track points to add to teams
        const team = participantData.team || formData.team || '';
        if (team) {
          if (!teamPointsToAdd[team]) {
            teamPointsToAdd[team] = 0;
          }
          teamPointsToAdd[team] += points;
        }
      }
  
      // Update teams' totalPoints
      for (const [teamName, pointsToAdd] of Object.entries(teamPointsToAdd)) {
        // Query to find the team document
        const teamQuery = query(
          collection(db, "teams"), 
          where("name", "==", teamName)
        );
        
        const teamSnapshot = await getDocs(teamQuery);
        
        if (!teamSnapshot.empty) {
          // Team exists, update their points
          const teamDoc = teamSnapshot.docs[0];
          const teamData = teamDoc.data();
          const updatedPoints = (teamData.totalPoints || 0) + pointsToAdd;
          
          await updateDoc(doc(db, 'teams', teamDoc.id), {
            totalPoints: updatedPoints
          });
          
          console.log(`Updated team ${teamName} points: ${teamData.totalPoints || 0} + ${pointsToAdd} = ${updatedPoints}`);
        } else {
          // Team doesn't exist, create it
          await addDoc(collection(db, 'teams'), {
            name: teamName,
            totalPoints: pointsToAdd
          });
          
          console.log(`Created new team ${teamName} with ${pointsToAdd} points`);
        }
      }
  
      // Reset form and show success message
      setFormData({
        programId: '',
        stage: 'on stage',
        isGroupItem: false,
        winners: [{ participantId: '', place: '1st' }]
      });
  
      setSuccessMessage('Results added successfully!');
    } catch (error) {
      console.error('Error adding results:', error);
      setErrorMessage(`Failed to add results: ${error.message}`);
    }
  };
  
  const selectprogram=(value)=>{
    const selectedProgram = programs.find(program => program.id === value);
  setFormData({...formData,programId:value,
    stage:selectedProgram.stage,
    isGroupItem:selectedProgram.isGroupItem})
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-4">Program Results Admin</h1>
          <p className="text-gray-600">Loading data, please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Program Results Admin</h1>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Program
              </label>
              <select
                name="programId"
                value={formData.programId}
                onChange={(e) =>selectprogram(e.target.value)}
                className="text-[#280B0C] w-full bg-[#FFDAE1] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1072E]"
              >
                <option value="">Select Program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.title}
                  </option>
                ))}
              </select>
            </div>

           

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Stage
              </label>
              <input
                disabled={true}
                name="stage"
                value={formData.stage}
                className="text-[#280B0C] w-full bg-[#FFDAE1] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1072E]"
              >
              </input>
            </div>

            <div className="flex items-center">
              <input
                disabled={true}
                type="checkbox"
                id="isGroupItem"
                name="isGroupItem"
                checked={formData.isGroupItem}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isGroupItem" className="ml-2 block text-gray-700 font-semibold">
                Group Item
              </label>
            </div>
          </div>

          {formData.winners.map((winner, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Participant
                </label>
                <select
                  name="participantId"
                  value={winner.participantId}
                  onChange={(e) => handleInputChange(e, index)}
                  className="text-[#280B0C] w-full bg-[#FFDAE1] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1072E]"
                >
                  <option value="">Select Participant</option>
                  {participants.map((participant) => (
                    <option key={participant.id} value={participant.id}>
                      {participant.name} - {participant.department} ({participant.year})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Place
                </label>
                <select
                  name="place"
                  value={winner.place}
                  onChange={(e) => handleInputChange(e, index)}
                  className="text-[#280B0C] w-full bg-[#FFDAE1] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1072E]"
                >
                  <option value="1st">1st Place</option>
                  <option value="2nd">2nd Place</option>
                  <option value="3rd">3rd Place</option>
                  
                </select>
              </div>

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveWinner(index)}
                  className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded"
                >
                  Remove Winner
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddWinner}
            className="text-white bg-[#FF23B2] hover:bg-[#D43054] font-bold py-2 px-4 rounded"
          >
            Add Another Winner
          </button>

          <button
            type="submit"
            className="text-white w-full bg-[#E1072E] hover:bg-[#83041B] text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1072E]"
          >
            Add Results
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recent Results</h2>
          {/* Here you would add a table to display recent results */}
          <p className="text-gray-600">Implementation of results listing would go here</p>
        </div>
      </div>
    </div>
  );
};

export default ProgramResultsAdmin;