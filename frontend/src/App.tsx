import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { PrivateLayout } from './components/PrivateLayout';
import { Login } from './pages/Login';
import { Companies } from './pages/Companies';
import { CompanyDashboard } from './pages/CompanyDashboard';
import { Profile } from './pages/Profile';
import { Plans } from './pages/Plans';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<PrivateRoute><PrivateLayout><CompanyDashboard /></PrivateLayout></PrivateRoute>} />
          <Route path="/companies" element={<PrivateRoute><PrivateLayout><Companies /></PrivateLayout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><PrivateLayout><Profile /></PrivateLayout></PrivateRoute>} />
          <Route path="/plans" element={<PrivateRoute><PrivateLayout><Plans /></PrivateLayout></PrivateRoute>} />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
