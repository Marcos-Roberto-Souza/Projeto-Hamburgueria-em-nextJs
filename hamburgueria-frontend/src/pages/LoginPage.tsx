import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '../services/api';

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        '/auth/login',
        {
          email,
          password,
        },
      );

      localStorage.setItem(
        'token',
        response.data.access_token,
      );

      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user),
      );

      const role = response.data.user.role;

      switch (role) {
        case 'ADMIN':
          navigate('/admin/products');
          break;

        case 'KITCHEN':
          navigate('/dashboard');
          break;

        case 'ATTENDANT':
          navigate('/cashier');
          break;

        case 'CUSTOMER':
          navigate('/order');
          break;

        default:
          navigate('/');
      }
    } catch (error) {
      alert('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f8fafc',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          background: '#fff',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 10px 25px rgba(0,0,0,.08)',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            marginBottom: '10px',
          }}
        >
          🔐 Login
        </h1>

        <p
          style={{
            marginTop: '20px',
            textAlign: 'center',
            color: '#6b7280',
            marginBottom: '30px',
          }}
        >
          Entre para acessar sua área de trabalho.
        </p>

        <form
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '6px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label>Senha</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '6px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              marginTop: '10px',
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {loading
              ? 'Entrando...'
              : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}