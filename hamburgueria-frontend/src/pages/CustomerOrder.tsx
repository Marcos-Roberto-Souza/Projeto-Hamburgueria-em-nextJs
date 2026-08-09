import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Product = {
    id: number;
    name: string;
    base_price: string;
};

type CartItem = {
    product: Product;
    quantity: number;
};

export function CustomerOrder() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);


    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        const response = await api.get('/products');
        setProducts(response.data);
    }

    function addToCart(product: Product) {
        setCart(prev => {
            const exists = prev.find(item => item.product.id === product.id);

            if (exists) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, { product, quantity: 1 }];
        });
    }

    function increaseQuantity(productId: number) {
        setCart(prev =>
            prev.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    }

    function decreaseQuantity(productId: number) {
        setCart(prev =>
            prev
                .map(item =>
                    item.product.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    }


    const total = cart.reduce(
        (sum, item) => sum + Number(item.product.base_price) * item.quantity,
        0
    );

    console.log('Total do carrinho:', total);

    async function finalizarPedido() {
        if (cart.length === 0) return;

        try {
            setLoading(true);
            await api.post('/orders', {
                items: cart.map(item => ({
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


    // ✅ SELEÇÃO
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1>🛒 Fazer Pedido</h1>

            <h2>🍔 Produtos</h2>

            {products.map(product => (
                <div key={product.id}>
                    <strong>{product.name}</strong>
                    <div>R$ {Number(product.base_price).toFixed(2)}</div>

                    <button onClick={() => addToCart(product)}>
                        ➕ Adicionar
                    </button>
                </div>
            ))}

            <h2>🛒 Carrinho</h2>

            {cart.length === 0 && <p>Carrinho vazio</p>}

            {cart.map(item => (
                <div key={item.product.id}>
                    <strong>{item.product.name}</strong>

                    <div>
                        <button onClick={() => decreaseQuantity(item.product.id)}>-</button>
                        <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item.product.id)}>+</button>
                    </div>

                    <div>
                        Subtotal: R$ {(Number(item.product.base_price) * item.quantity).toFixed(2)}
                    </div>
                </div>
            ))}

            <h2>🧾 Revisão do Pedido</h2>

            <div>
                <strong>Total:</strong> R$ {total.toFixed(2)}
            </div>

            <button
                disabled={cart.length === 0}
                onClick={finalizarPedido}
            >
                🛒 Finalizar pedido
            </button>
        </div>

    );
}