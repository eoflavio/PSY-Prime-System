import { useState } from 'react';
import type { FormEvent } from 'react';
import { maskCNPJ, maskPhone } from '../utils/masks';
import { isValidCNPJ, isValidEmail } from '../utils/validators';

interface CompanyFormProps {
  onSubmit: (data: any) => Promise<void>;
  disabled: boolean;
}

export const CompanyForm = ({ onSubmit, disabled }: CompanyFormProps) => {
  const [cnpj, setCnpj] = useState('');
  const [name, setName] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingCnpj, setFetchingCnpj] = useState(false);

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
        setNomeFantasia(data.nome_fantasia || data.razao_social || '');
        setEndereco(`${data.logradouro}, ${data.numero || 'S/N'} - ${data.bairro}, ${data.municipio} - ${data.uf}`);
        if (!name) setName(data.nome_fantasia || data.razao_social || '');
      } catch (err) {
        setError('Não foi possível buscar os dados do CNPJ automaticamente na Receita Federal.');
      } finally {
        setFetchingCnpj(false);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(maskPhone(e.target.value));
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
      setError('Telefone deve conter DDD + 8 ou 9 dígitos.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSubmit({
        name,
        razaoSocial,
        nomeFantasia,
        endereco,
        cnpj: cnpj.replace(/\D/g, ''),
        email,
        phone: numericPhone
      });
      setCnpj(''); setName(''); setRazaoSocial(''); setNomeFantasia(''); setEndereco(''); setEmail(''); setPhone('');
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar empresa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card glass">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Cadastrar Nova Empresa</h3>
      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label>CNPJ {fetchingCnpj && <span style={{color: 'var(--primary-color)'}}>(Buscando na Receita...)</span>}</label>
          <input className="input" value={cnpj} onChange={handleCnpjChange} placeholder="XX.XXX.XXX/XXXX-XX" maxLength={18} required disabled={disabled} />
        </div>

        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label>Razão Social (Auto-preenchido)</label>
          <input className="input" value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} required disabled={disabled} />
        </div>

        <div className="input-group">
          <label>Nome Fantasia</label>
          <input className="input" value={nomeFantasia} onChange={e => setNomeFantasia(e.target.value)} required disabled={disabled} />
        </div>

        <div className="input-group">
          <label>Apelido / Nome Interno</label>
          <input className="input" value={name} onChange={e => setName(e.target.value)} required disabled={disabled} />
        </div>

        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label>Endereço Completo</label>
          <input className="input" value={endereco} onChange={e => setEndereco(e.target.value)} required disabled={disabled} />
        </div>

        <div className="input-group">
          <label>E-mail Corporativo</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={disabled} />
        </div>

        <div className="input-group">
          <label>Telefone (DDD + Número)</label>
          <input className="input" value={phone} onChange={handlePhoneChange} placeholder="(XX) 9XXXX-XXXX" maxLength={15} required disabled={disabled} />
        </div>

        <button type="submit" className="btn" style={{ gridColumn: 'span 2', marginTop: '1rem' }} disabled={disabled || loading || fetchingCnpj}>
          {loading ? 'Cadastrando...' : 'Confirmar Cadastro'}
        </button>
      </form>
    </div>
  );
};
