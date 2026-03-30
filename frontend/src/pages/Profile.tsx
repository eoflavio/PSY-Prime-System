import { useState, useContext } from 'react';
import type { FormEvent } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import { maskPhone } from '../utils/masks';

export const Profile = () => {
  const { user, login } = useContext(AuthContext);

  const [cpf, setCpf] = useState(user?.cpf || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [cep, setCep] = useState(user?.cep || '');
  const [rua, setRua] = useState(user?.rua || '');
  const [numero, setNumero] = useState(user?.numero || '');
  const [bairro, setBairro] = useState(user?.bairro || '');
  const [cidade, setCidade] = useState(user?.cidade || '');
  const [estado, setEstado] = useState(user?.estado || '');
  const [name, setName] = useState(user?.name || '');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
    setLoading(true);
    setMessage('');
    
    try {
      const data = {
        name,
        cpf: cpf ? cpf.replace(/\D/g, '') : '',
        phone: phone ? phone.replace(/\D/g, '') : '',
        cep: cep ? cep.replace(/\D/g, '') : '', 
        rua: rua || '', 
        numero: numero || '', 
        bairro: bairro || '', 
        cidade: cidade || '', 
        estado: estado || ''
      };
      const response = await api.put('/users/profile', data);
      
      const currentToken = localStorage.getItem('@SaaS:token');
      if (user && currentToken) {
        login(currentToken, { ...user, ...response.data });
      }
      setMessage('Seus dados foram atualizados com sucesso!');
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Erro ao sincronizar dados na Nuvem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)', fontSize: '1.5rem' }}>Painel Central do Diretor</h2>

      <div className="card glass">
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Modificar Dados Cadastrais</h3>
        
        {message && <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: message.includes('Erro') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: message.includes('Erro') ? 'var(--danger-color)' : 'var(--success-color)', borderRadius: '0.5rem' }}>{message}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>E-mail de Login (Imutável)</label>
            <input className="input" value={user?.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Nome do Diretor / CEO</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>CPF de Validação</label>
            <input className="input" value={cpf} onChange={handleCpfChange} placeholder="000.000.000-00" />
          </div>
          
          <div className="input-group">
            <label>WhatsApp / Contato</label>
            <input className="input" value={phone} onChange={e => setPhone(maskPhone(e.target.value))} placeholder="(XX) 9XXXX-XXXX" />
          </div>
          
          <div style={{ gridColumn: 'span 2', height: '1px', backgroundColor: 'var(--border-color)', margin: '0.5rem 0' }} />

          <div className="input-group">
            <label>CEP Residencial</label>
            <input className="input" value={cep} onChange={e => handleCepChange(e.target.value)} maxLength={9} />
          </div>

          <div className="input-group">
            <label>Estado (UF)</label>
            <input className="input" value={estado} onChange={e => setEstado(e.target.value)} maxLength={2} />
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Avenida / Rua</label>
            <input className="input" value={rua} onChange={e => setRua(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Número do Imóvel</label>
            <input className="input" value={numero} onChange={e => setNumero(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Bairro</label>
            <input className="input" value={bairro} onChange={e => setBairro(e.target.value)} />
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Cidade</label>
            <input className="input" value={cidade} onChange={e => setCidade(e.target.value)} />
          </div>

          <button type="submit" className="btn" style={{ gridColumn: 'span 2', marginTop: '1rem', width: 'fit-content', padding: '0.75rem 2rem' }} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  );
};
