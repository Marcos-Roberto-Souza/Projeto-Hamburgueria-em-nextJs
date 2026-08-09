import { useEffect, useState } from "react";
import { api } from '../services/api';

type Metrics = {
    total_orders: number;
    late_orders: number;
    avg_minutes: number;
    max_minutes: number;
};

type MetricCardProps = {
    title: string;
    value: number | string;
    highlight?: boolean;
};



export function KitchenDashboard() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);

    function MetricCard({ title, value, highlight }: MetricCardProps) {
        return (
            <div
                style={{
                    padding: '20px',
                    borderRadius: '8px',
                    background: highlight ? '#fee2e2' : '#f9fafb',
                    border: '2px solid',
                    borderColor: highlight ? '#dc2626' : '#e5e7eb',
                }}
            >
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{title}</p>
                <strong style={{ fontSize: '28px' }}>{value}</strong>
            </div>
        );
    }

    useEffect(() => {
        api.get('/orders/history/metrics/today').then(response => setMetrics(response.data));
    }, []);

    if (!metrics) {
        return <p> Carregando métricas... </p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>📊 Dashboard da Cozinha – Hoje </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px', }}>
                <MetricCard title="Pedidos Finalizados" value={metrics.total_orders} />
                <MetricCard title="Pedidos Atrasados" value={metrics.late_orders} highlight={metrics.late_orders > 0} />
                <MetricCard title="Tempo Médio (min)" value={`${metrics.avg_minutes} min`} />
                <MetricCard title="Maior Tempo (min)" value={`${metrics.max_minutes}min`} highlight={metrics.max_minutes >= 15} />
            </div>
        </div>
    );
}