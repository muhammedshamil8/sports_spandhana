import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/layout';
import ParticipantManagement from './pages/Admin/ParticipantManagement';
import ProgramManagement from './pages/Admin/ProgramManagement';
import ProgramResultsAdmin from './pages/Admin/ProgramResultsAdmin';
import ProgramResultsList from './pages/Admin/ProgramResultsList';
import Home from './App';
import Results from './pages/Result';
import PageTransition from './PageTransition';
import Launch from './pages/Launch';
import Login from './pages/Admin/login';
import { AuthProvider } from '@/context/AuthContext';
import TeamManagement from './pages/Admin/TeamManagement';

function Router() {
  return (
    <BrowserRouter>
      <PageTransition>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/launch" element={<Launch />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<ParticipantManagement />} />
              <Route path="participants" element={<ParticipantManagement />} />
              <Route path="programs" element={<ProgramManagement />} />
              <Route path="results" element={<ProgramResultsAdmin />} />
              <Route path="results/list" element={<ProgramResultsList />} />
              <Route path='teams' element={<TeamManagement />} />
            </Route>
            
            <Route path="*" element={<Home />} />
          </Routes>
        </AuthProvider>
      </PageTransition>
    </BrowserRouter>
  );
}

export default Router;