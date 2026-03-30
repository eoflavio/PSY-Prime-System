import { useState } from 'react';
import { api } from '../services/api';
import { CheckCircle2, CreditCard } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
  onSuccess: (newPlan: string) => void;
}

export const CheckoutModal = ({ isOpen, onClose, planName, planPrice, onSuccess }: CheckoutModalProps) => {
  const [step, setStep] = useState(1);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Simulate bank delay
      await new Promise(r => setTimeout(r, 1500));
      await api.put('/users/plan', { plan: planName });
      setStep(3);
      setTimeout(() => {
        onSuccess(planName);
        onClose();
        setStep(1);
      }, 2500);
    } catch (error) {
      alert('Erro ao processar assinatura na nuvem.');
    } finally {
      setLoading(false);
    }
  };

  const numericPrice = parseInt(planPrice.replace(/\D/g, '')) || 0;
  const annualPrice = (numericPrice * 12 * 0.8).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const finalPrice = billing === 'annual' ? annualPrice : planPrice;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div className="card glass" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', borderRadius: '1.5rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>&times;</button>
        
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 700 }}>Confirmar Assinatura</h2>
            <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Plano Selecionado</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--primary-color)', textTransform: 'uppercase' }}>{planName}</strong>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <div onClick={() => setBilling('monthly')} style={{ flex: 1, padding: '1.25rem', border: billing === 'monthly' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', borderRadius: '0.75rem', cursor: 'pointer', textAlign: 'center', backgroundColor: billing === 'monthly' ? 'rgba(79, 70, 229, 0.05)' : 'transparent', transition: 'all 0.2s' }}>
                  <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Mensal</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{planPrice}</span>
                </div>
                {numericPrice > 0 && (
                  <div onClick={() => setBilling('annual')} style={{ flex: 1, padding: '1.25rem', border: billing === 'annual' ? '2px solid var(--success-color)' : '1px solid var(--border-color)', borderRadius: '0.75rem', cursor: 'pointer', textAlign: 'center', backgroundColor: billing === 'annual' ? 'rgba(16, 185, 129, 0.05)' : 'transparent', position: 'relative', transition: 'all 0.2s' }}>
                    <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--success-color)', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '1rem', fontWeight: 700, whiteSpace: 'nowrap' }}>-20% OFF Anual</span>
                    <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Anual</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{annualPrice} / ano</span>
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => setStep(2)} className="btn" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>Continuar para Pagamento</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 700 }}>Pagamento (Fictício)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="input-group">
                <label>Número do Cartão de Crédito</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input className="input" defaultValue="4111 1111 1111 1111" disabled style={{ paddingLeft: '3rem', letterSpacing: '2px', cursor: 'not-allowed', opacity: 0.8 }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Validade</label>
                  <input className="input" defaultValue="12/30" disabled style={{ cursor: 'not-allowed', opacity: 0.8 }} />
                </div>
                <div className="input-group">
                  <label>CVV de Seg.</label>
                  <input className="input" defaultValue="123" disabled type="password" style={{ cursor: 'not-allowed', opacity: 0.8 }} />
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Total a faturar:</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>{finalPrice}</strong>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>Voltar</button>
              <button onClick={handleConfirm} className="btn" style={{ flex: 2 }} disabled={loading}>
                {loading ? 'Processando Seguradora...' : 'Confirmar Pagamento'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ margin: '0 auto 1.5rem', width: '90px', height: '90px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 color="var(--success-color)" size={52} />
            </div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 700 }}>Assinatura Efetivada!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.5 }}>
              O upgrade para o plano <strong style={{color: 'var(--text-primary)'}}>{planName}</strong> foi validado com sucesso. Suas novas ferramentas já estão liberadas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
