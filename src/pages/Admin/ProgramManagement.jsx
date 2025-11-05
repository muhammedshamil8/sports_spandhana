import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
// import { db } from '@/config/fbase';
import {db} from '@/config/fbase';
const ProgramManagement = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    stage: 'on stage',
    isGroupItem: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [currentProgramId, setCurrentProgramId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch programs on component mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const programsSnapshot = await getDocs(collection(db, 'programs'));
      const programsList = programsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setPrograms(programsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setErrorMessage('Failed to load programs. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Validate form
      if (!formData.title) {
        setErrorMessage('Program title is required');
        return;
      }

      if (editMode) {
        // Update existing program
        await updateDoc(doc(db, 'programs', currentProgramId), {
          title: formData.title,
          stage: formData.stage,
          isGroupItem: formData.isGroupItem,
          updatedAt: serverTimestamp()
        });
        setSuccessMessage('Program updated successfully!');
      } else {
        // Create new program
        await addDoc(collection(db, 'programs'), {
          title: formData.title,
          stage: formData.stage,
          isGroupItem: formData.isGroupItem,
          createdAt: serverTimestamp()
        });
        setSuccessMessage('Program created successfully!');
      }

      // Reset form and fetch updated programs
      resetForm();
      fetchPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
      setErrorMessage('Failed to save program. Please try again.');
    }
  };

  const handleEdit = (program) => {
    setFormData({
      title: program.title,
      stage: program.stage,
      isGroupItem: program.isGroupItem,
    });
    setCurrentProgramId(program.id);
    setEditMode(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (programId) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await deleteDoc(doc(db, 'programs', programId));
        setSuccessMessage('Program deleted successfully!');
        fetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
        setErrorMessage('Failed to delete program. Please try again.');
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
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          {editMode ? 'Edit Program' : 'Create New Program'}
        </h2>

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
              className="text-[#280B0C] w-full bg-[#FFDAE1] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1072E]"
              placeholder="Enter program title"
              required
            />
          </div>

          <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Stage
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="text-[#280B0C] w-full bg-[#FFDAE1] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1072E]"
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
                onChange={(e) => setFormData({ ...formData, isGroupItem: e.target.checked })}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isGroupItem" className="ml-2 block text-gray-700 font-semibold">
                Group Item
              </label>
            </div>
          



         

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-[#E1072E] hover:bg-[#83041B] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editMode ? 'Update Program' : 'Create Program'}
            </button>

            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="border-t border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Programs List</h2>

        {loading ? (
          <p className="text-gray-600">Loading programs...</p>
        ) : programs.length === 0 ? (
          <p className="text-gray-600">No programs found. Create one using the form above.</p>
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
                    <td className="py-3 px-4">{program.isGroupItem ? 'group':'individual'}</td>
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
    </div>
  );
};

export default ProgramManagement;