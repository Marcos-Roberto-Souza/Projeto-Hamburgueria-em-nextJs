import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Product = {
    id: number;
    name: string;
    base_price: number;
    description?: string;
    image_url?: string;
};

export function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editName, setEditName] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editImage, setEditImage] = useState<File | null>(null);
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newImage, setNewImage] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const API_URL = "https://projeto-hamburgueria-em-nextjs-production.up.railway.app";


    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        const response = await api.get('/products');
        setProducts(response.data);
    }

    async function createProduct(e: React.FormEvent) {
        e.preventDefault();

        if (!newName || !newPrice) {
            alert('Nome e preço são obrigatórios');
            return;
        }

        const formData = new FormData();
        formData.append('name', newName);
        formData.append('base_price', newPrice);
        formData.append('description', newDescription);

        if (newImage) {
            formData.append('image', newImage);
        }

        try {
            setSaving(true);
            await api.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            //limpa formulario
            setNewName('');
            setNewPrice('');
            setNewDescription('');
            setNewImage(null);

            //recarrega lista
            loadProducts();
        } catch {
            alert('Erro ao adicionar este produto');
        } finally {
            setSaving(false);
        }
    }

    async function submitEdit() {
        if (!editingProduct) return;

        const formData = new FormData();
        formData.append('name', editName);
        formData.append('base_price', editPrice);
        formData.append('description', editDescription);

        if (editImage) {
            formData.append('image', editImage);
        }

        await api.patch(`/products/${editingProduct.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        setEditingProduct(null);
        loadProducts();
    }

    async function deleteProduct(id: number) {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        await api.delete(`/products/${id}`);
        loadProducts();
    }

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h1>🧑‍💼 Administração</h1>

            <h2>Inserir Produto</h2>

            <form onSubmit={createProduct} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                marginBottom: 30,
            }}>
                <input
                    type="text"
                    placeholder="Nome do Produto"
                    value={newName}
                    onChange={e => setNewName(e.target.value)} />

                <input
                    type="number"
                    style={{ marginBottom: 30 }}
                    step="0.01"
                    placeholder="Preço"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)} />

                <textarea style={{ width: '50%', height: 100 }}
                    placeholder="Descrição"
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)} />

                <input style={{ marginBottom: 30 }}
                    type="file"
                    accept="image/*"
                    onChange={e => setNewImage(e.target.files?.[0] || null)} />

                <button style={{ marginBottom: 40 }} type="submit" disabled={saving}>
                    {saving ? 'Salvando... ' : '+Adicionar Novo Produto'}
                </button>

            </form>

            <h2 style={{ marginBottom: 20 }}>🔍 Buscar produto</h2>

            <input
                type="text"
                placeholder="Digite o nome do produto"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '40px',
                }}
            />

            <h2>LISTA DE PRODUTOS</h2>
            {products.length === 0 && <p>Nenhum produto cadastrado.</p>}

            {filteredProducts.map(product => (
                <div
                    key={product.id}
                    style={{
                        border: '1px solid #ddd',
                        padding: '10px',
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ display: 'flex', gap: 10 }}>
                        {product.image_url && (
                            <img
                                src={`${API_URL}${product.image_url}`}
                                alt={product.name}
                                width={80}
                            />
                        )}

                        <div>
                            <strong>{product.name}</strong>
                            <div>R$ {Number(product.base_price).toFixed(2)}</div>
                            <p>{product.description}</p>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={() => {
                                setEditingProduct(product);
                                setEditName(product.name);
                                setEditPrice(product.base_price.toString());
                                setEditDescription(product.description || '');
                                setEditImage(null);
                            }}
                        >
                            ✏️ Editar
                        </button>

                        <button
                            onClick={() => deleteProduct(product.id)}
                            style={{ marginLeft: 8, color: 'red' }}
                        >
                            ❌ Excluir
                        </button>
                    </div>
                </div>
            ))}

            {/* MODAL DE EDIÇÃO */}
            {editingProduct && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div style={{ background: '#fff', padding: 20, width: 400 }}>
                        <h2>Editar Produto</h2>

                        <input
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            placeholder="Nome"
                        />

                        <input
                            type="number"
                            value={editPrice}
                            onChange={e => setEditPrice(e.target.value)}
                            placeholder="Preço"
                        />

                        <textarea
                            value={editDescription}
                            onChange={e => setEditDescription(e.target.value)}
                            placeholder="Descrição"
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setEditImage(e.target.files?.[0] || null)}
                        />

                        <button onClick={submitEdit}>Salvar</button>
                        <button onClick={() => setEditingProduct(null)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}