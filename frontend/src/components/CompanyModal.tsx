import { useState } from 'react';
import type { FormEvent } from 'react';
import { maskCNPJ, maskPhone } from '../utils/masks';
import { isValidCNPJ, isValidEmail } from '../utils/validators';
import { X } from 'lucide-react';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const CompanyModal = ({ isOpen, onClose, onSubmit }: CompanyModalProps) => {
  const [cnpj, setCnpj] = useState('');
  const [name, setName] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingCnpj, setFetchingCnpj] = useState(false);

  if (!isOpen) return null;

  const handleCnpjChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = maskCNPJ(e.target.value);
    setCnpj(val);
    
    const numericStr = val.replace(/\D/g, '');
    if (numericStr.length === 14) {
      if (!isValidCNPJ(numericStr)) {
        setError('CNPJ inválido (Dígito verificador incorreto).');
        return;
      }
      setError('');
      setFetchingCnpj(true);
      try {
        const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${numericStr}`);
        if (!res.ok) throw new Error('Erro ao consultar CNPJ');
        const data = await res.json();
        
        setRazaoSocial(data.razao_social || '');
        if (data.nome_fantasia) {
          setNomeFantasia(data.nome_fantasia);
          if (!name) setName(data.nome_fantasia);
        }
        
        setCep(data.cep || '');
        setRua(data.logradouro || '');
        setNumero(data.numero || '');
        setBairro(data.bairro || '');
        setCidade(data.municipio || '');
        setEstado(data.uf || '');
        
        if (data.ddd_telefone_1) {
          setPhone(maskPhone(data.ddd_telefone_1));
        }
        if (data.email) {
          setEmail(data.email);
        }

      } catch (err) {
        setError('Não foi possível buscar dados automáticos do CNPJ.');
      } finally {
        setFetchingCnpj(false);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(maskPhone(e.target.value));
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidCNPJ(cnpj)) {
      setError('O CNPJ informado não é matematicamente válido.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Formato de e-mail inválido.');
      return;
    }
    const numericPhone = phone.replace(/\D/g, '');
    if (numericPhone.length < 10) {
      setError('Telefone deve conter DDD + dígitos.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSubmit({
        name,
        razaoSocial,
        nomeFantasia,
        cnpj: cnpj.replace(/\D/g, ''),
        email,
        phone: numericPhone,
        cep: cep.replace(/\D/g, ''),
        rua, numero, bairro, cidade, estado
      });
      setCnpj(''); setName(''); setRazaoSocial(''); setNomeFantasia(''); 
      setEmail(''); setPhone(''); setCep(''); setRua(''); setNumero(''); 
      setBairro(''); setCidade(''); setEstado('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar empresa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '2rem' }}>
      <div className="card glass" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <X size={24} />
        </button>
        
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.5rem', paddingRight: '2rem' }}>Nova Filial / Unidade</h3>
        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem' }}>
          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>CNPJ {fetchingCnpj && <span style={{color: 'var(--primary-color)'}}>(Buscando na Receita...)</span>}</label>
            <input className="input" value={cnpj} onChange={handleCnpjChange} placeholder="XX.XXX.XXX/XXXX-XX" maxLength={18} required />
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Razão Social (Auto-preenchido)</label>
            <input className="input" value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Nome Fantasia</label>
            <input className="input" value={nomeFantasia} onChange={e => setNomeFantasia(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Apelido Interno no SaaS</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>E-mail Corporativo</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Telefone / SAC</label>
            <input className="input" value={phone} onChange={handlePhoneChange} placeholder="(XX) 9XXXX-XXXX" maxLength={15} required />
          </div>

          <div style={{ gridColumn: 'span 2', height: '1px', backgroundColor: 'var(--border-color)', margin: '1rem 0' }} />

          <div className="input-group">
            <label>CEP</label>
            <input className="input" value={cep} onChange={e => handleCepChange(e.target.value)} maxLength={9} required />
          </div>

          <div className="input-group">
            <label>Estado (UF)</label>
            <input className="input" value={estado} onChange={e => setEstado(e.target.value)} maxLength={2} required />
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Avenida / Logradouro</label>
            <input className="input" value={rua} onChange={e => setRua(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Número</label>
            <input className="input" value={numero} onChange={e => setNumero(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Bairro</label>
            <input className="input" value={bairro} onChange={e => setBairro(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Cidade</label>
            <input className="input" value={cidade} onChange={e => setCidade(e.target.value)} required />
          </div>

          <button type="submit" className="btn" style={{ gridColumn: 'span 2', marginTop: '1.5rem', padding: '1.25rem', fontSize: '1.1rem' }} disabled={loading || fetchingCnpj}>
            {loading ? 'Instanciando Entidade...' : 'Cadastrar Corporação'}
          </button>
        </form>
      </div>
    </div>
  );
};
