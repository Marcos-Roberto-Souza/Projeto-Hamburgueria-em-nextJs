import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '../services/api';

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    event: React.FormEvent,
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
          navigate('/customer-order');
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
        maxWidth: '400px',
        margin: '50px auto',
      }}
    >
      <h1>🔐 Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>

        <div
          style={{
            marginTop: '12px',
          }}
        >
          <label>Senha</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '20px',
          }}
        >
          {loading
            ? 'Entrando...'
            : 'Entrar'}
        