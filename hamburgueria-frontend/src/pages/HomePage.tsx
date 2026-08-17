import { Link, useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  function handleContinue() {
    if (!user) {
      navigate('/login');
      return;
    }

    switch (user.role) {
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
          maxWidth: '500px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 10px 25px rgba(0,0,0,.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '2rem',
            color: '#111827',
            textAlign: 'center',
          }}
        >
          🍔 Hamburgueria Digital
        </h1>

        <p
          style={{
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Faça seu pedido online ou acesse sua área de trabalho.
        </p>

        <Link
          to="/order"
          style={{
            width: '100%',
            textDecoration: 'none',
          }}
        >
          <button
            style={{
              width: '100%',
              padding: '14px',
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🍔 Fazer Pedido
          </button>
        </Link>

        <Link
          to="/customer-order"
          style={{
            width: '100%',
            textDecoration: 'none',
          }}
        >
          <button
            style={{
              width: '100%',
              padding: '14px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🔐 Entrar
          </button>
        </Link>

        {user && (
          <button
            onClick={handleContinue}
            style={{
              width: '100%',
              padding: '14px',
              background: '#16a34a',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🚀 Continuar como {user.name}
          </button>
        )}
      </div>
    </div>
  );
}