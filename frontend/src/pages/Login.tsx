import { useState, useContext, useEffect } from 'react';
import type { FormEvent } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { User } from 'lucide-react';
import { maskPhone } from '../utils/masks';

interface SavedProfile {
  name: string;
  email: string;
}

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Extended registration fields
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem('@SaaS:profiles') || '[]');
    setSavedProfiles(profiles);
  }, []);

  const saveProfile = (userName: string, userEmail: string) => {
    const profiles = JSON.parse(localStorage.getItem('@SaaS:profiles') || '[]');
    if (!profiles.find((p: any) => p.email === userEmail)) {
      profiles.push({ name: userName, email: userEmail });
      localStorage.setItem('@SaaS:profiles', JSON.stringify(profiles));
    }
  };

  const handleSelectProfile = (profileEmail: string) => {
    setEmail(profileEmail);
    setIsRegistering(false);
  };

  const handleCepChange = async (val: string) => {
    const raw = val.replace(/\D/g, '');
    setCep(raw);
    if (raw.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setRua(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setEstado(data.uf);
        }
      } catch (e) {}
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    val = val.replace(/(\d{3})(\d)/, '$1.$2');
    val = val.replace(/(\d{3})(\d)/, '$1.$2');
    val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(val);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        const payload = { 
            name, email, password,
            cpf: cpf.replace(/\D/g, ''),
            phone: phone.replace(/\D/g, ''),
            cep: cep.replace(/\D/g, ''),
            rua, numero, bairro, cidade, estado
        };
        const response = await api.post('/auth/register', payload);
        saveProfile(response.data.user.name, response.data.user.email);
        login(response.data.token, response.data.user);
      } else {
        const response = await api.post('/auth/login', { identifier: email, password });
        saveProfile(response.data.user.name, response.data.user.email);
        login(response.data.token, response.data.user);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocorreu um erro ao conectar.');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: isRegistering ? '600px' : '480px', backgroundColor: 'var(--surface-color)', padding: '3rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)', transition: 'max-width 0.3s', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--primary-color)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.75rem', letterSpacing: '1px', marginBottom: '1rem', boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)' }}>PSY</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>PSY</h1>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '0.5rem' }}>Prime System</p>
        </div>
        
        {savedProfiles.length > 0 && !email && !isRegistering ? (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-primary)', fontWeight: 600, textAlign: 'center' }}>Selecionar Perfil</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {savedProfiles.map((p, i) => (
                <div key={i} onClick={() => handleSelectProfile(p.email)} className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem', transition: 'transform 0.2s', border: '1px solid var(--border-color)', borderRadius: '0.75rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{p.name}</strong>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{p.email}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { setEmail(''); setIsRegistering(true); }} className="btn btn-secondary" style={{ width: '100%', marginBottom: '1rem' }}>Cadastre-se</button>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: 'var(--text-primary)', fontWeight: 700 }}>
              {isRegistering ? 'Criar Conta Matriz' : 'Acessar o Painel'}
            </h2>
            
            {error && <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: isRegistering ? '1fr 1fr' : '1fr', gap: '1rem' }}>
              <div className="input-group" style={{ gridColumn: isRegistering ? 'span 2' : 'span 1' }}>
                <label>{isRegistering ? 'E-mail Profissional' : 'E-mail ou CPF'}</label>
                <input className="input" type={isRegistering ? 'email' : 'text'} value={email.trim()} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="input-group" style={{ gridColumn: isRegistering ? 'span 2' : 'span 1' }}>
                <label>Senha de Segurança</label>
                <input className="input" type="password" value={password} minLength={6} onChange={e => setPassword(e.target.value)} required />
              </div>

              {isRegistering && (
                <>
                  <div className="input-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>2. Dados Fiscais da Holding</h3>
                  </div>

                  <div className="input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Nome do Responsável / CEO</label>
                    <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} required />
                  </div>

                  <div className="input-group">
                    <label>CPF Representante</label>
                    <input className="input" value={cpf} onChange={handleCpfChange} placeholder="000.000.000-00" required />
                  </div>
                  
                  <div className="input-group">
                    <label>Celular / WhatsApp</label>
                    <input className="input" value={phone} onChange={e => setPhone(maskPhone(e.target.value))} placeholder="(XX) 9XXXX-XXXX" required />
                  </div>

                  <div className="input-group">
                    <label>CEP (Auto-completa ViaCEP)</label>
                    <input className="input" value={cep} onChange={e => handleCepChange(e.target.value)} maxLength={9} required />
                  </div>
                  
                  <div className="input-group">
                    <label>Estado (UF)</label>
                    <input className="input" value={estado} onChange={e => setEstado(e.target.value)} maxLength={2} required />
                  </div>

                  <div className="input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Rua / Logradouro Central</label>
                    <input className="input" value={rua} onChange={e => setRua(e.target.value)} required />
                  </div>

                  <div className="input-group">
                    <label>Número do Prédio</label>
                    <input className="input" value={numero} onChange={e => setNumero(e.target.value)} required />
                  </div>

                  <div className="input-group">
                    <label>Bairro</label>
                    <input className="input" value={bairro} onChange={e => setBairro(e.target.value)} required />
                  </div>

                  <div className="input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Município</label>
                    <input className="input" value={cidade} onChange={e => setCidade(e.target.value)} required />
                  </div>
                </>
              )}
              
              <button type="submit" className="btn" style={{ gridColumn: isRegistering ? 'span 2' : 'span 1', padding: '1.25rem', fontSize: '1.1rem', marginTop: '1rem', fontWeight: 600 }}>
                {isRegistering ? 'Cadastrar' : 'Entrar no Sistema'}
              </button>
            </form>

            <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              {isRegistering ? 'Já tem uma conta?' : 'Ainda não possui acesso?'}{' '}
              <button type="button" onClick={() => setIsRegistering(!isRegistering)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>
                {isRegistering ? 'Fazer Login' : 'Cadastre-se'}
              </button>
            </div>
            {savedProfiles.length > 0 && !isRegistering && (
              <button type="button" onClick={() => setEmail('')} style={{ display: 'block', margin: '1.5rem auto 0', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem' }}>
                &larr; Voltar à Memória de Perfis
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
