import { Link, Outlet } from 'react-router-dom';

export function Layout() {
    return (
        <div>
            <nav
                style={{
                    display: 'flex',
                    gap: '20px',
                    padding: '16px',
                    background: '#111827',
                }}
            >
                <Link to="/customer-order" style={linkStyle}> 🔒 Login </Link>
                
                <Link to="/" style={linkStyle}> 🍳 KDS </Link>

                <Link to="/dashboard" style={linkStyle}> 📊 Dashboard </Link>


                <Link to="/order" style={linkStyle}> 🛒 Pedido </Link>

                <Link to="/admin/products" style={{ color: '#fff'}}> 🧑‍💼 Admin </Link>

            </nav>

            <main style={{ padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
}

const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
};