import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Product = {
  id: number;
  name: string;
  description?: string;
  base_price: string;
  image_url?: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

export function CustomerOrder() {
  const [products, setProducts] = useState<Product[]>([]);
  const [, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const API_URL =
    'https://projeto-hamburgueria-em-nextjs-production.up.railway.app';

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const response = await api.get('/products');
    setProducts(response.data);
  }

  function addToCart(product: Product) {
    setCart((prev) => {
      const exists = prev.find(
        (item) => item.product.id === product.id,
      );

      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          product,
          quantity: 1,
        },
      ];
    });
  }

  function increaseQuantity(productId: number) {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  }

  function decreaseQuantity(productId: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.product.base_price) *
        item.quantity,
    0,
  );

  async function finalizarPedido() {
    if (cart.length === 0) return;

    try {
      setLoading(true);

      await api.post('/orders', {
        userId: 1,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      alert('Pedido realizado com sucesso!');

      setCart([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        minHeight: '100vh',
        background: '#f8fafc',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '30px',
        }}
      >
        🍔 Faça seu Pedido
      </h1>

      <h2>Produtos</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              background: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow:
                '0 4px 12px rgba(0,0,0,.08)',
            }}
          >
            {product.image_url && (
              {`${API_URL}${product.image_url}`}
            )}

            <div
              style={{
                padding: '16px',
              }}
            >
              <h3
                style={{
                  marginBottom: '10px',
                }}
              >
                {product.name}
              </h3>

              <p
                style={{
                  color: '#6b7280',
                  minHeight: '50px',
                }}
              >
                {product.description}
              </p>

              <strong
                style={{
                  display: 'block',
                  color: '#dc2626',
                  fontSize: '22px',
                  marginBottom: '16px',
                }}
              >
                R${' '}
                {Number(
                  product.base_price,
                ).toFixed(2)}
              </strong>

              <button
                onClick={() =>
                  addToCart(product)
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ➕ Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '16px',
          boxShadow:
            '0 4px 12px rgba(0,0,0,.08)',
        }}
      >
        <h2>🛒 Carrinho</h2>

        {cart.length === 0 && (
          <p>Seu carrinho está vazio.</p>
        )}

        {cart.map((item) => (
          <div
            key={item.product.id}
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom:
                '1px solid #e5e7eb',
            }}
          >
            <div>
              <strong>
                {item.product.name}
              </strong>

              <div>
                Subtotal: R${' '}
                {(
                  Number(
                    item.product.base_price,
                  ) * item.quantity
                ).toFixed(2)}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <button
                onClick={() =>
                  decreaseQuantity(
                    item.product.id,
                  )
                }
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#ef4444',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                -
              </button>

              <span>
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  increaseQuantity(
                    item.product.id,
                  )
                }
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#22c55e',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: '24px',
            fontSize: '22px',
            fontWeight: 'bold',
          }}
        >
          Total: R$ {total.toFixed(2)}
        </div>

        <button
          disabled={cart.length === 0}
          onClick={finalizarPedido}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '16px',
            border: 'none',
            borderRadius: '10px',
            background:
              cart.length === 0
                ? '#9ca3af'
                : '#16a34a',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          🛒 Finalizar Pedido
        </button>
      </div>
    </div>
  );
}