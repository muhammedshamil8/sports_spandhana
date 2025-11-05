import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
// import { auth } from '@/config/fbase';
import {auth} from '@/config/fbase';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import { Menu, X, LogOut, BarChart, Award, Users, Layers } from 'lucide-react';
import AuthRoleRequire from '../router/AuthRequire';
const AdminLayout = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
        setIsMobile(true);
      } else {
        setSidebarOpen(true);
        setIsMobile(false);
      }
    };

    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setErrorMessage('Failed to log out. Please try again.');
    }
  };

  const navItems = [
    { id: 'results', path: '/admin/results', label: 'Results', icon: <Award size={20} /> },
    { id: 'programs', path: '/admin/programs', label: 'Programs', icon: <Layers size={20} /> },
    { id: 'participants', path: '/admin/participants', label: 'Participants', icon: <Users size={20} /> },
    { id: 'Teams', path: '/admin/teams', label: 'Team', icon: <BarChart size={20} /> },
  ];
  
  return (
    <AuthRoleRequire>
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar (if needed) */}
      
      {/* Error Message */}
      {errorMessage && (
        <div className="px-4 sm:px-6 lg:px-8 mt-4 fixed top-16 right-4 z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-md">
            {errorMessage}
            <button 
              className="absolute top-0 right-0 p-2" 
              onClick={() => setErrorMessage('')}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Mobile menu toggle button */}
      {isMobile && !sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-20 bg-white p-2 rounded-md shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`bg-white shadow-md z-20 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'w-64' : 'w-0'
          } ${isMobile ? 'fixed h-screen' : 'relative'}`}
        >
          <div className="flex flex-col justify-between h-screen fixed w-64">
            <div className="p-4 text-lg font-semibold text-[#E1072E] border-b flex justify-between items-center">
              KALART2025
              {isMobile && (
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <nav className="flex-1 pt-4 pb-4">
              <ul>
                {navItems.map((item) => (
                  <li key={item.id} className="px-2 py-1">
                    <NavLink
                      to={item.path}
                      onClick={() => {
                        if (isMobile) setSidebarOpen(false);
                      }}
                      className={({ isActive }) => `w-full flex items-center px-4 py-3 rounded-md text-left transition-colors ${
                        isActive
                          ? 'bg-[#FFDAE1] text-[#E1072E]'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t flex flex-col gap-2 items-center justify-center text-sm text-gray-500">
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm z-10"
              >
                <LogOut size={16} className="mr-1" />
                <span>Logout</span>
              </button>
              <p>© {new Date().getFullYear()} Arts Festival</p>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          isMobile && sidebarOpen ? 'ml-64' : ''
        }`}>
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                {/* This is where child routes will be rendered */}
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile overlay when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div></AuthRoleRequire>
  );
};

export default AdminLayout;