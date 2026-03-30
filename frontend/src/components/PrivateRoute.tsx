import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Carregando sessão...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
