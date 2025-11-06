import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  getDoc
} from 'firebase/firestore';
import { db } from '@/config/fbase';

const ProgramManagement = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('create'); // 👈 'view' or 'create'
  const [formData, setFormData] = useState({
    title: '',
    stage: 'on stage',
    isGroupItem: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [currentProgramId, setCurrentProgramId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch programs only once when mounted
  useEffect(() => {
    if (viewMode === 'view') {
    fetchPrograms();
    }
  }, [viewMode]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'programs'));
      const programsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setPrograms(programsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setErrorMessage('Failed to load programs.');
      setLoading(false);
    }
  };

  // 🔹 Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // 🔹 Handle program save / update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.title.trim()) {
      setErrorMessage('Program title is required');
      return;
    }

    try {
      if (editMode) {
        await updateDoc(doc(db, 'programs', currentProgramId), {
          title: formData.title,
          stage: formData.stage,
          isGroupItem: formData.isGroupItem,
          updatedAt: serverTimestamp(),
        });
        setSuccessMessage('Program updated successfully!');
      } else {
        await addDoc(collection(db, 'programs'), {
          title: formData.title,
          stage: formData.stage,
          isGroupItem: formData.isGroupItem,
          createdAt: serverTimestamp(),
          isPublished: false, // default unpublished
        });
        setSuccessMessage('Program created successfully!');
      }

      resetForm();
      fetchPrograms(); // refresh list once
      // setViewMode('view');
    } catch (error) {
      console.error('Error saving program:', error);
      setErrorMessage('Failed to save program.');
    }
  };

  // 🔹 Handle Edit — prevent editing if results exist
  const handleEdit = async (program) => {
    try {
      // Check if there are any results for this program
      const resultsRef = collection(db, 'programResults');
      const q = query(resultsRef, where('programId', '==', program.id));
      const resultsSnapshot = await getDocs(q);

      if (!resultsSnapshot.empty) {
        alert('This program already has results published and cannot be edited.');
        return;
      }

      // Allow editing if no results
      setFormData({
        title: program.title,
        stage: program.stage,
        isGroupItem: program.isGroupItem,
      });
      setCurrentProgramId(program.id);
      setEditMode(true);
      setViewMode('create');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error checking program results:', error);
    }
  };

  // 🔹 Handle Delete — remove program + related results + adjust team points
  const handleDelete = async (programId) => {
    if (window.confirm('Are you sure you want to delete this program? All related results and points will be adjusted.')) {
      try {
        // Get all related results
        const resultsRef = collection(db, 'programResults');
        const q = query(resultsRef, where('programId', '==', programId));
        const resultsSnapshot = await getDocs(q);

        for (const resultDoc of resultsSnapshot.docs) {
          const resultData = resultDoc.data();
          const teamName = resultData.team;
          const points = resultData.points || 0;

          // Find team by name
          const teamsSnapshot = await getDocs(collection(db, 'teams'));
          const teamDoc = teamsSnapshot.docs.find(t => t.data().name === teamName);

          if (teamDoc) {
            const teamRef = doc(db, 'teams', teamDoc.id);
            const teamSnap = await getDoc(teamRef);
            if (teamSnap.exists()) {
              const currentPoints = teamSnap.data().points || 0;
              const newPoints = Math.max(0, currentPoints - points);
              await updateDoc(teamRef, { points: newPoints });
            }
          }

          // Delete each result
          await deleteDoc(doc(db, 'programResults', resultDoc.id));
        }

        // Finally, delete the program
        await deleteDoc(doc(db, 'programs', programId));

        setSuccessMessage('Program and its results deleted successfully!');
        fetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
        setErrorMessage('Failed to delete program.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      stage: 'on stage',
      isGroupItem: false,
    });
    setEditMode(false);
    setCurrentProgramId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold">Program Management</h2>
        <button
          onClick={() => setViewMode(viewMode === 'view' ? 'create' : 'view')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {viewMode === 'view' ? 'Create Program' : 'View Programs'}
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 m-4 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
          {errorMessage}
        </div>
      )}

      {viewMode === 'create' ? (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editMode ? 'Edit Program' : 'Create New Program'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Program Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-[#FFDAE1] text-[#280B0C] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1072E]"
                placeholder="Enter program title"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Stage
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleInputChange}
                className="w-full bg-[#FFDAE1] text-[#280B0C] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1072E]"
              >
                <option value="on stage">On Stage</option>
                <option value="off stage">Off Stage</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isGroupItem"
                name="isGroupItem"
                checked={formData.isGroupItem}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isGroupItem" className="ml-2 text-gray-700 font-semibold">
                Group Item
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-[#E1072E] hover:bg-[#83041B] text-white font-bold py-2 px-4 rounded-md"
              >
                {editMode ? 'Update Program' : 'Create Program'}
              </button>

              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Programs List</h3>

          {loading ? (
            <p className="text-gray-600">Loading programs...</p>
          ) : programs.length === 0 ? (
            <p className="text-gray-600">No programs found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Title</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Stage</th>
                    <th className="py-3 px-4 text-left">Created</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => (
                    <tr key={program.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{program.title}</td>
                      <td className="py-3 px-4">{program.isGroupItem ? 'Group' : 'Individual'}</td>
                      <td className="py-3 px-4">{program.stage}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {program.createdAt.toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(program)}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(program.id)}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgramManagement;
