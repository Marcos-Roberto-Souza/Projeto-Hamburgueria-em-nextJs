import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Item = {
    id: number;
    quantity: number;
    product: {
        name: string;
    };
};

type Order = {
    id: number;
    status: string;
    created_at: string;
    items: Item[];
};


const pulseStyle = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.03); }
        100% { transform: scale(1); }
    }
`;


export function KDS() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [highlightedOrders, setHighlightedOrders] = useState<number[]>([]);
    const [now,setNow] = useState(new Date());

    async function loadOrders() {
        const response = await api.get('/orders/kds');

        const newOrders = response.data.map((o: any) => o.id).filter((id: number) => !orders.some(order => order.id === id));
        if (newOrders.length > 0) {
            setHighlightedOrders(newOrders);
            setTimeout(() => { // Remove destaque após 10 segundos
                setHighlightedOrders([]);
            }, 10000);
        }
        setOrders(response.data);
    }

    async function startOrder(id: number) {
        await api.patch(`/orders/${id}/start`); // Atualiza a lista após mudar o status
        await loadOrders();
    }

    async function finishOrder(id: number) {
        await api.patch(`/orders/${id}/finish`); // Atualiza a lista após mudar o status
        loadOrders();
    }
    
    useEffect(() => {
        // Carrega imediatamente ao abrir a tela
        loadOrders();
        // Atualização automática a cada 1 minuto
        const interval = setInterval(loadOrders, 60000); // 60000 ms = 1 minuto
        // Cleanup: evita vazamento de memória
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const timer = setInterval(() => // Atualiza o estado "now" a cada minuto para recalcular os tempos
            setNow(new Date()), 60000);// 1 minuto
        return () => clearInterval(timer);// clear
    }, []);

    function getElapsedMinutes(dateString: string) {// Calcula o tempo decorrido em minutos desde a criação do pedido
        const created = new Date(dateString);
        const now = new Date();
        return Math.floor((now.getTime() - created.getTime()) / 60000);
    }

    function getTimeStyle(createdAt: string) {// Retorna estilos de acordo com o tempo decorrido para destacar pedidos críticos
        const minutes = getElapsedMinutes(createdAt);

        if (minutes > 25) {
            return {
                borderLeft: '10px solid #7f1d1d', // vermelho escuro
                background: '#fee2e2',
            };
        }

        if (minutes > 15) {
            return {
                borderLeft: '10px solid #dc2626', // vermelho
                background: '#fee2e2',
            };
        }

        if (minutes > 10) {
            return {
                borderLeft: '10px solid #f97316', // laranja
                background: '#fff7ed',
            };
        }

        return {
            borderLeft: '10px solid #facc15', // amarelo
            background: '#fefce8',
        };
    }

    function getCriticalityScore(order: Order) {// Calcula uma pontuação de criticidade para ordenar os pedidos, considerando tempo, status e antiguidade
        const minutes = getElapsedMinutes(order.created_at);
        const status = order.status.trim();

        let score = 0;

        // Peso principal: tempo
        if (minutes > 25) {
            score += 4000; // crítico
        } else if (minutes > 15) {
            score += 3000; // atrasado
        } else if (minutes > 10) {
            score += 2000; // atenção
        } else {
            score += 1000; // normal
        }

        // Peso secundário: status
        if (status === 'EM_PREPARO') {
            score += 500;
        }

        // Peso terciário: mais antigo ganha
        score += minutes;

        return score;
    }


    function countActiveOrders(orders: Order[]) {// Conta quantos pedidos estão ativos (CRIADO ou EM_PREPARO)
        return orders.length;
    }


    function countCriticalOrders(orders: Order[]) {// Conta quantos pedidos estão críticos (mais de 15 minutos)
        return orders.filter(
            order => getElapsedMinutes(order.created_at) >= 15
        ).length;
    }


    function calculateAverageTime(orders: Order[]) {// Calcula o tempo médio de preparo dos pedidos ativos
        if (orders.length === 0) return 0;

        const totalMinutes = orders.reduce(
            (sum, order) => sum + getElapsedMinutes(order.created_at),
            0
        );

        return Math.round(totalMinutes / orders.length);
    }

    function getOldestOrder(orders: Order[]) {
        if (orders.length === 0) return null;
        return orders.reduce((oldest, current) =>
            new Date(current.created_at) < new Date(oldest.created_at)
                ? current
                : oldest
        );
    }




    return (
        <div>
            <style> {pulseStyle}</style>

            <h1>🧑‍🍳 KDS - Cozinha </h1>
            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                flexWrap: 'wrap',
                justifyContent: 'Center'
            }}>
                <div>
                    <strong> 📦 Pedidos ativos </strong>
                    <div>{countActiveOrders(orders)}</div>
                </div>

                <div>
                    <strong> 🚨 Pedidos críticos </strong>
                    <div>{countCriticalOrders(orders)}</div>
                </div>

                <div>
                    <strong> ⏱️ Tempo médio </strong>
                    <div>{calculateAverageTime(orders)} min</div>
                </div>

                {getOldestOrder(orders) && (
                    <div>
                        <strong>🕰️ Pedido mais antigo</strong>
                        <div>
                            #{getOldestOrder(orders)?.id} –{" "}
                            {getElapsedMinutes(getOldestOrder(orders)!.created_at)} min
                        </div>
                    </div>
                )}
            </div>

            {orders.length === 0 && <p>Nenhum pedido na fila.</p>}
            {orders.slice().sort((a, b) => getCriticalityScore(b) - getCriticalityScore(a)).map(order => (
                <div key={order.id} style={{
                    border: '1px solid #e5e7eb', padding: '12px', marginBottom: '12px', borderRadius: '6px', ...getTimeStyle(order.status),
                    boxShadow: highlightedOrders.includes(order.id) ? '0 0 15px rgba(16,185, 129, 0.8)' : 'none', // destaque verde
                    animation: highlightedOrders.includes(order.id) ? 'pulse 1.2s ease-in-out infinite' : 'none',

                }}>
                    <strong style={{ fontSize: '18px' }}> Pedido #{order.id}</strong>

                    <p>Status: {order.status.trim()}</p>

                    <p>
                        ⏱️ {getElapsedMinutes(order.created_at)} min
                    </p>

                    {getElapsedMinutes(order.created_at) > 25 && (<p style={{ color: '#7f1d1d', fontWeight: 'bold', background: '#fee2e2', padding: '6px', borderRadius: '4px' }}> 🔥🟥 Pedido crítico! Atenção necessária!</p>)}

                    {
                        getElapsedMinutes(order.created_at) > 15 &&
                        getElapsedMinutes(order.created_at) <= 25 && (
                            <p style={{ color: '#dc2626', fontWeight: 'bold' }}>
                                ⚠️ Pedido em atraso
                            </p>
                        )
                    }

                    {order.status.trim() === 'CRIADO' && (<button onClick={() => startOrder(order.id)}>Iniciar o Preparo</button>)}
                    {order.status.trim() === 'EM_PREPARO' && (<button onClick={() => finishOrder(order.id)}>Finalizar o Pedido</button>)}
                    <ul>
                        {order.items.map(item => (
                            <li key={item.id}>
                                {item.quantity} x {item.product.name}
                            </li>
                        ))}
                    </ul>
                </div >
            ))}
            <p>Última atualização: {now.toLocaleTimeString()}</p>
        </div >
    );
}