import { CompanyForm } from '../components/CompanyForm';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const NewCompany = () => {
  const navigate = useNavigate();

  const handleCreateCompany = async (data: any) => {
    try {
      await api.post('/companies', data);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 403) {
         throw new Error(err.response?.data?.message || 'Limite do plano atingido.');
      } else {
         throw new Error(err.response?.data?.error || 'Erro ao criar empresa');
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>&larr; Voltar</button>
        <h2 style={{ color: 'var(--text-primary)' }}>Nova Empresa</h2>
      </header>
      
      <CompanyForm onSubmit={handleCreateCompany} disabled={false} />
    </div>
  );
};
