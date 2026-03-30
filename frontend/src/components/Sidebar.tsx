import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Building2, UserCircle, CreditCard, LogOut } from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  
  const width = isHovered ? '250px' : '80px';

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        width,
        backgroundColor: 'var(--surface-color)', 
        borderRight: '1px solid var(--border-color)', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        position: 'fixed', 
        left: 0, 
        top: 0,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 50,
        overflow: 'hidden',
        boxShadow: isHovered ? 'var(--shadow-md)' : 'none'
      }}
    >
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', height: '80px', minWidth: '250px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--primary-color)', borderRadius: '8px', minWidth: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.5px' }}>PSY</div>
          <div style={{ marginLeft: '1rem', opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>PSY</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.25rem' }}>Prime System</p>
          </div>
        </div>
      </Link>

      <nav style={{ flex: 1, padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <SidebarLink to="/profile" active={isActive('/profile')} icon={<UserCircle size={24} />} text="Perfil" isHovered={isHovered} />
        <SidebarLink to="/companies" active={isActive('/companies')} icon={<Building2 size={24} />} text="Empresas" isHovered={isHovered} />
        <SidebarLink to="/plans" active={isActive('/plans')} icon={<CreditCard size={24} />} text="Assinaturas" isHovered={isHovered} />
      </nav>

      <div style={{ padding: '1.5rem 0', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ padding: '0 1.5rem', opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Operador: <strong style={{ color: 'var(--text-primary)' }}>{user?.name.split(' ')[0]}</strong></span>
        </div>
        <button 
          onClick={logout} 
          style={{ 
            width: '100%', display: 'flex', alignItems: 'center', padding: '0.75rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={24} style={{ minWidth: '24px' }} />
          <span style={{ marginLeft: '1rem', opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap', fontWeight: 500 }}>Sair da Conta</span>
        </button>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, active, icon, text, isHovered }: any) => {
  return (
    <Link 
      to={to} 
      style={{ 
        display: 'flex', alignItems: 'center', padding: '0.75rem 1.5rem', textDecoration: 'none',
        color: active ? 'var(--primary-color)' : 'var(--text-secondary)',
        backgroundColor: active ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
        borderRight: active ? '3px solid var(--primary-color)' : '3px solid transparent',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ minWidth: '24px' }}>{icon}</div>
      <span style={{ marginLeft: '1rem', opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap', fontWeight: 500 }}>{text}</span>
    </Link>
  );
};
