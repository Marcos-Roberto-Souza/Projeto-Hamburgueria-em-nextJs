import { Link, useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  function handleContinue() {
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
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <h1>🍔 Hamburgueria Digital</h1>

      <p>
        Faça seu pedido online ou acesse
        sua área de trabalho.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginTop: '30px',
        }}
      >
        <Link to="/order">
          <button>Fazer Pedido</button>
        </Link>

        <Link to="/login">
          <button>Entrar</button>
        </Link>

        {user && (
          <button onClick={handleContinue}>
            Continuar
          </button>
        )}
      </div>
    </div>
  );
}