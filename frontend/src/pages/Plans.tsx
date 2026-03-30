import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Check, Star, Zap, Building2, Crown } from 'lucide-react';
import { CheckoutModal } from '../components/CheckoutModal';

export const Plans = () => {
  const { user, login } = useContext(AuthContext);

  const plans = [
    { 
      name: 'FREE', 
      price: 'R$ 0', 
      period: '/mês',
      description: 'Ideal para quem está primeiramente organizando as filiais.',
      icon: <Building2 className="plan-icon" size={28} />,
      features: ['Até 3 filiais da holding', 'Gestão básica de cadastro', 'Suporte da comunidade'],
      color: '#64748b',
      highlight: false
    },
    { 
      name: 'PRATA', 
      price: 'R$ 49',
      period: '/mês',
      description: 'O equilíbrio perfeito para pequenos grupos empresariais.',
      icon: <Star className="plan-icon" size={28} />,
      features: ['Até 10 filiais da holding', 'Relatórios financeiros mensais', 'Suporte por e-mail em 24h', 'Acesso multi-usuário (3 contas)'],
      color: '#3b82f6',
      highlight: false
    },
    { 
      name: 'OURO', 
      price: 'R$ 149',
      period: '/mês',
      description: 'Ferramentas avançadas para redes em expansão global (Recomendado).',
      icon: <Zap className="plan-icon" size={28} />,
      features: ['Até 50 filiais da holding', 'Gestão de rendimentos avançada', 'Suporte prioritário via WhatsApp', 'Acesso multi-usuário ilimitado', 'API de integrações (Simulada)'],
      color: '#8b5cf6',
      highlight: true
    },
    { 
      name: 'DIAMANTE', 
      price: 'R$ 499',
      period: '/mês',
      description: 'Para holdings globais e grandes conglomerados corporativos.',
      icon: <Crown className="plan-icon" size={28} />,
      features: ['Filiais ilimitadas', 'Controle total de holding', 'Consultoria e SLA dedicado', 'Servidor dedicado invisível', 'Gerenciador de Múltiplos CNPJs'],
      color: '#10b981',
      highlight: false
    },
  ];

  const [checkoutPlan, setCheckoutPlan] = useState<{name: string, price: string} | null>(null);

  const handleSuccess = (newPlan: string) => {
    const currentToken = localStorage.getItem('@SaaS:token');
    if (user && currentToken) {
      login(currentToken, { ...user, plan: newPlan });
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Escolha o Plano Ideal para sua Holding
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Experimente as opções do nosso sistema mockado de assinaturas. Projetado arquiteturalmente para escalar e agregar valor ao seu portfólio.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
        {plans.map(p => (
          <div 
            key={p.name} 
            className="card glass" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '2.5rem 2rem',
              border: p.highlight ? `2px solid ${p.color}` : '1px solid var(--border-color)', 
              transform: p.highlight ? 'scale(1.03)' : 'scale(1)', 
              boxShadow: p.highlight ? `0 20px 40px -15px ${p.color}40` : 'var(--shadow-md)',
              position: 'relative',
              borderRadius: '1.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            {p.highlight && (
              <span style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: p.color, color: 'white', padding: '0.4rem 1.25rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', boxShadow: `0 4px 12px ${p.color}40` }}>
                MAIS POPULAR
              </span>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: p.color }}>
              <div style={{ padding: '0.5rem', backgroundColor: `${p.color}15`, borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 {p.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{p.name}</h3>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>{p.price}</span>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{p.period}</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '2rem', minHeight: '40px' }}>
              {p.description}
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {p.features.map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  <Check size={18} color={p.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ lineHeight: 1.4 }}>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => setCheckoutPlan({ name: p.name, price: p.price })}
              className="btn"
              style={{ 
                width: '100%', 
                backgroundColor: user?.plan === p.name ? 'transparent' : (p.highlight ? p.color : 'var(--bg-color)'), 
                color: user?.plan === p.name ? 'var(--text-secondary)' : (p.highlight ? 'white' : 'var(--text-primary)'),
                border: user?.plan === p.name ? '2px solid var(--border-color)' : `1px solid ${p.highlight ? 'transparent' : 'var(--border-color)'}`,
                fontWeight: 600,
                padding: '1rem',
                borderRadius: '0.75rem',
                cursor: user?.plan === p.name ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }} 
              disabled={user?.plan === p.name}
            >
              {user?.plan === p.name ? 'Seu Plano Atual' : 'Simular Assinatura'}
            </button>
          </div>
        ))}
      </div>

      {checkoutPlan && (
        <CheckoutModal 
          isOpen={true} 
          onClose={() => setCheckoutPlan(null)} 
          planName={checkoutPlan.name} 
          planPrice={checkoutPlan.price} 
          onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
};
