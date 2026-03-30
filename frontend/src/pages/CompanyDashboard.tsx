import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Building2, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import type { Company } from '../types';

export const CompanyDashboard = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      const lastId = localStorage.getItem('@SaaS:lastCompany');
      if (!lastId) {
        navigate('/companies');
        return;
      }
      try {
        const response = await api.get('/companies');
        const found = response.data.find((c: any) => c.id === lastId);
        if (found) {
          setCompany(found);
        } else {
          navigate('/companies');
        }
      } catch (err) {
        console.error(err);
        navigate('/companies');
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [navigate]);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Carregando Painel Operacional da Unidade...</div>;
  if (!company) return null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            {company.nomeFantasia || company.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} /> CNPJ: {company.cnpj ? company.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5") : 'Não Informado'}
          </p>
        </div>
        <button onClick={() => navigate('/companies')} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontWeight: 600 }}>
          Trocar de Unidade
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard title="Faturamento Mensal (Local)" value="R$ 142.050,00" icon={<DollarSign size={24} color="#10b981" />} trend="+12.5%" />
        <StatCard title="Despesas Operacionais" value="R$ 48.300,00" icon={<TrendingUp size={24} color="#ef4444" />} trend="-2.4%" />
        <StatCard title="Colaboradores Ativos" value="44" icon={<Users size={24} color="#3b82f6" />} trend="+3" />
        <StatCard title="Índice de Produtividade" value="94%" icon={<Activity size={24} color="#8b5cf6" />} trend="+1.2%" />
      </div>

      <div className="card glass" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '1.1rem', borderRadius: '1.5rem', border: '1px dashed var(--border-color)' }}>
        <Activity size={48} color="var(--border-color)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
        <p>Área central de gráficos e gerenciamento interno da unidade operacional <strong>{company.nomeFantasia || company.name}</strong>.</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', maxWidth: '500px', textAlign: 'center', lineHeight: 1.5 }}>
          [Ambiente de Demonstração] Esta filial agora é o foco da sua sessão atual. Todos os módulos adicionais seriam mapeados exclusivamente para os dados desta empresa.
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend }: any) => (
  <div className="card glass" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>{title}</span>
      <div style={{ padding: '0.6rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>{icon}</div>
    </div>
    <div>
      <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem', letterSpacing: '-0.03em' }}>{value}</h3>
      <span style={{ color: trend.startsWith('+') ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 600, fontSize: '0.85rem' }}>
        {trend} vs mês anterior
      </span>
    </div>
  </div>
);
