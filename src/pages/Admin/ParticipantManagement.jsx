import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '@/config/fbase';
import { Trash2, AlertTriangle } from 'lucide-react';

const ParticipantManagement = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterYear, setFilterYear] = useState('');
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [viewMode, setViewMode] = useState('form'); // 'form' or 'list'

  const [years] = useState(['S1A', 'S1B', 'S2A', 'S2B']);
  const [teams] = useState(['Blue', 'Green', 'Red', 'Yellow']);

  const [name, setName] = useState('');
  const [year, setYear] = useState('S1A');
  const [team, setTeam] = useState('Blue');
  const [totalPoints, setTotalPoints] = useState(0);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Auto-hide messages
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Fetch participants
  const fetchParticipants = async (isLoadMore = false) => {
    try {
      setLoading(true);
      let baseQuery = collection(db, 'participants');
      const conditions = [];

      if (filterYear) conditions.push(where('year', '==', filterYear));

      let participantsQuery = query(baseQuery, ...conditions, orderBy('name'), limit(20));

      if (isLoadMore && lastVisible) {
        participantsQuery = query(participantsQuery, startAfter(lastVisible));
      }

      const snapshot = await getDocs(participantsQuery);

      const fetchedParticipants = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHasMore(snapshot.docs.length === 20);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setParticipants((prev) =>
        isLoadMore ? [...prev, ...fetchedParticipants] : fetchedParticipants
      );
    } catch (error) {
      console.error('Error fetching participants:', error);
      setErrorMessage('Failed to load participants.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateParticipant = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    if (!team) {
      setErrorMessage('Please select a team.');
      setLoading(false);
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Please enter a name.');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'participants'), {
        name: name.trim(),
        year,
        team,
        totalPoints,
        createdAt: new Date(),
      });

      setSuccessMessage(`✅ ${name} has been added successfully!`);
      setName('');
      setYear('S1A');
      setTeam('Blue');
      setTotalPoints(0);

      if (viewMode === 'list') fetchParticipants(false);
    } catch (error) {
      console.error('Error adding participant:', error);
      setErrorMessage('Failed to add participant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (participant) => {
    setDeleteConfirm(participant);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await deleteDoc(doc(db, 'participants', deleteConfirm.id));

      setSuccessMessage(`✅ ${deleteConfirm.name} has been removed successfully.`);
      setParticipants((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting participant:', error);
      setErrorMessage('Failed to delete participant. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md p-6">
      {/* Switch Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewMode('form')}
          className={`flex-1 px-4 py-2 rounded-md font-medium ${
            viewMode === 'form' ? 'bg-[#E1072E] text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          Create Participant
        </button>
        <button
          onClick={() => {
            setViewMode('list');
            fetchParticipants(false);
          }}
          className={`flex-1 px-4 py-2 rounded-md font-medium ${
            viewMode === 'list' ? 'bg-[#E1072E] text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          View Participants
        </button>
      </div>

      {/* Feedback Messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Create Form */}
      {viewMode === 'form' && (
        <div>
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full bg-[#FFDAE1] px-4 py-2 border border-[#280B0C] rounded-md text-[#280B0C] focus:outline-none focus:ring-2 focus:ring-[#E1072E]"
            />

            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full bg-[#FFDAE1] px-4 py-2 border border-[#280B0C] rounded-md text-[#280B0C] focus:outline-none focus:ring-2 focus:ring-[#E1072E]"
            >
              {teams.map((t, index) => (
                <option key={index} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-[#FFDAE1] px-4 py-2 border border-[#280B0C] rounded-md text-[#280B0C] focus:outline-none focus:ring-2 focus:ring-[#E1072E]"
            >
              {years.map((yr, index) => (
                <option key={index} value={yr}>
                  {yr}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreateParticipant}
              disabled={loading}
              className="w-full bg-[#E1072E] hover:bg-[#83041B] disabled:opacity-60 text-white px-4 py-2 rounded-md transition-all font-medium"
            >
              {loading ? 'Saving...' : 'Create Participant'}
            </button>
          </div>
        </div>
      )}

      {/* Participants List */}
      {viewMode === 'list' && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-[#280B0C]">Participants</h3>

          {loading && participants.length === 0 ? (
            <p className="text-gray-500">Loading...</p>
          ) : participants.length === 0 ? (
            <p className="text-gray-500">No participants found.</p>
          ) : (
            <div className="space-y-2">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center hover:bg-gray-50 p-3 rounded transition-colors border border-gray-100"
                >
                  <div className="flex-1">
                    <span className="font-medium text-[#280B0C] block">
                      {p.name} ({p.year})
                    </span>
                    <span className="text-sm text-gray-600">
                      {p.team} Team  • {p.totalPoints || 0} points
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(p)}
                    className="ml-4 text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors flex-shrink-0"
                    title="Delete participant"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {hasMore && !loading && participants.length > 0 && (
            <button
              onClick={() => fetchParticipants(true)}
              className="mt-4 w-full bg-[#E1072E] hover:bg-[#83041B] text-white px-4 py-2 rounded-md transition-all font-medium"
            >
              Load More
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
            <div className="flex items-center mb-4 text-amber-600">
              <AlertTriangle size={26} className="mr-2 flex-shrink-0" />
              <h3 id="delete-title" className="text-xl font-bold">
                Confirm Deletion
              </h3>
            </div>

            <p className="text-gray-700 mb-3 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-gray-900">{deleteConfirm.name}</strong>?
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-5 text-sm text-amber-800">
              <p className="font-semibold mb-1 flex items-center">
                ⚠️ This action cannot be undone!
              </p>
              <p>This will permanently remove:</p>
              <div className="list-disc ml-5 mt-1 space-y-0.5">
                <p>All participant data</p>
                <p>Points history ({deleteConfirm.totalPoints || 0} points)</p>
                <p>Team association ({deleteConfirm.team} Team)</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-800 px-4 py-2.5 rounded-md font-medium transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-md font-semibold transition-colors duration-150"
              >
                {deleting ? 'Deleting…' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantManagement;
