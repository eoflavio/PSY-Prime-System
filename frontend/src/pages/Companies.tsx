import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import { PLAN_LIMITS } from '../types';
import type { Company } from '../types';
import { CompanyModal } from '../components/CompanyModal';

import { useNavigate } from 'react-router-dom';

export const Companies = () => {
  const { user } = useContext(AuthContext);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (data: any) => {
    try {
      await api.post('/companies', data);
      fetchCompanies();
    } catch (err: any) {
      if (err.response?.status === 403) {
         throw new Error(err.response?.data?.message || 'Limite do plano atingido.');
      } else {
         throw new Error(err.response?.data?.error || 'Erro ao criar empresa');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Verificação de Segurança: Demosntre a exclusão permanente! Tem certeza?')) return;
    try {
        await api.delete(`/companies/${id}`);
        fetchCompanies();
    } catch (err) {
        console.error(err);
    }
  };

  const handleAccess = (id: string) => {
    localStorage.setItem('@SaaS:lastCompany', id);
    navigate('/dashboard');
  };

  const limit = user ? PLAN_LIMITS[user.plan] : 0;

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', backgroundColor: 'var(--surface-color)', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: 'var(--shadow-sm)' }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700 }}>Gestão de Empresas e Filiais</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Plano Vigente: <strong style={{color: 'var(--primary-color)'}}>{user?.plan}</strong></span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span>{companies.length} de {limit === 999999 ? 'Ilimitadas' : limit} empresas cadastradas.</span>
          </p>
        </div>
        <button 
          onClick={() => setModalOpen(true)} 
          className="btn" 
          disabled={companies.length >= limit}
          style={{ boxShadow: 'var(--shadow-md)', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
        >
          ➕ Nova Empresa
        </button>
      </header>

      <div className="card glass">
        {loading ? <p>Carregando diretório de entidades...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {companies.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem 0', fontSize: '1.1rem' }}>Sua holding ainda não possui unidades registradas.</p>}
            {companies.map(c => (
              <div key={c.id} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>{c.nomeFantasia || c.name}</strong>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{c.razaoSocial} | {c.name}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleDelete(c.id)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}>Remover</button>
                    <button onClick={() => handleAccess(c.id)} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Acessar Painel</button>
                  </div>
                </div>
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border-color)', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <div><strong style={{color: 'var(--text-primary)', display: 'block'}}>CNPJ:</strong> {c.cnpj ? c.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5") : 'Não Informado'}</div>
                  <div><strong style={{color: 'var(--text-primary)', display: 'block'}}>Contato Corporativo:</strong> {c.phone ? c.phone.replace(/^(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3") : 'Não Informado'}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong style={{color: 'var(--text-primary)', display: 'block'}}>E-mail Diretoria:</strong> {c.email}</div>
                  <div style={{ gridColumn: 'span 2', backgroundColor: 'var(--surface-color)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <strong style={{color: 'var(--text-primary)'}}>Localização Física (Sede):</strong>
                    <span>{c.rua}, Nº {c.numero} - {c.bairro}</span>
                    <span>{c.cidade} - {c.estado} (CEP: {c.cep ? c.cep.replace(/(\d{5})(\d{3})/, "$1-$2") : 'N/A'})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CompanyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreateCompany} />
    </div>
  );
};
