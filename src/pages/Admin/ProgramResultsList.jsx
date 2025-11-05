import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
// import { db } from '@/config/fbase';
import {db} from '@/config/fbase';

// eslint-disable-next-line react/prop-types
const ProgramResultsList = ({ refreshTrigger }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    team: '',
    programId: '',
  });
  const [programs, setPrograms] = useState([]);
  const [totalPoints, setTotalPoints] = useState({});
  const [teams, setTeams] = useState([]);
  
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsCollection = collection(db, 'teams');
        const teamsSnapshot = await getDocs(teamsCollection);
        const teamsList = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeams(teamsList);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    const fetchPrograms = async () => {
      try {
        const programsSnapshot = await getDocs(
          query(collection(db, 'programs'), where('isPublished', '==', true))
        );
        
        const programsList = programsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPrograms(programsList);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };
    fetchTeams();

    fetchPrograms();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        
        let resultsQuery = query(
          collection(db, 'programResults'),
          orderBy('timestamp', 'desc'),
          limit(50)
        );
        
        if (filter.team) {
          resultsQuery = query(
            collection(db, 'programResults'),
            where('team', '==', filter.team),
            orderBy('timestamp', 'desc'),
            limit(50)
          );
        }
        
        if (filter.programId) {
          resultsQuery = query(
            collection(db, 'programResults'),
            where('programId', '==', filter.programId),
            orderBy('timestamp', 'desc'),
            limit(50)
          );
        }
        
        if (filter.team && filter.programId) {
          resultsQuery = query(
            collection(db, 'programResults'),
            where('team', '==', filter.team),
            where('programId', '==', filter.programId),
            orderBy('timestamp', 'desc'),
            limit(50)
          );
        }
        
        const resultsSnapshot = await getDocs(resultsQuery);
        const resultsList = resultsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date()
        }));
        
        setResults(resultsList);
        
        // Calculate total points per team
        const allResultsSnapshot = await getDocs(collection(db, 'programResults'));
        const allResults = allResultsSnapshot.docs.map(doc => doc.data());
        
        const points = {
          A: 0,
          B: 0,
          C: 0,
          D: 0
        };
        
        allResults.forEach(result => {
          if (result.team && result.points) {
            points[result.team] += result.points;
          }
        });
        
        setTotalPoints(points);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error);
        setLoading(false);
      }
    };

    fetchResults();
  }, [filter, refreshTrigger]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilter({
      team: '',
      programId: '',
    });
  };


  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Program Results</h2>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Team Standings</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(totalPoints).map(([team, points]) => (
            <div key={team} className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-lg font-bold">Team {team}</div>
              <div className="text-2xl font-bold text-blue-600">{points} pts</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Filter Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Team
            </label>
            <select
              name="team"
              value={filter.team}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Teams</option>
          {teams.map(team => (
            <option key={team.id} value={team.name}>{team.name}</option>
          ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Program
            </label>
            <select
              name="programId"
              value={filter.programId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Programs</option>
              {programs.map(program => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <p className="text-gray-600">Loading results...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-600">No results found. Add some results using the form above.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Participant</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-left">Year</th>
                <th className="py-3 px-4 text-left">Team</th>
                <th className="py-3 px-4 text-left">Points</th>
                <th className="py-3 px-4 text-left">Stage</th>
                <th className="py-3 px-4 text-left">Group</th>
                <th className="py-3 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{result.participantName}</td>
                  <td className="py-3 px-4">{result.department}</td>
                  <td className="py-3 px-4">{result.year}</td>
                  <td className="py-3 px-4">Team {result.team}</td>
                  <td className="py-3 px-4 font-bold">{result.points}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.stage === 'on stage' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {result.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {result.isGroupItem ? (
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">
                        Group
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs">
                        Individual
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {result.timestamp.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProgramResultsList;