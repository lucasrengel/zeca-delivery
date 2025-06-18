import React from "react";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard({ dashboardStats, pedidos: initialPedidos, taxaEntregaData, pedidosDiaData, faturamentoDiaData, darkMode }) {
  const [localPedidos, setLocalPedidos] = React.useState(initialPedidos);
  
  // Update local state when prop changes
  React.useEffect(() => {
    setLocalPedidos(initialPedidos);
  }, [initialPedidos]);
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-blue-500">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Pedidos Hoje" value={dashboardStats.pedidosHoje} color="from-blue-400 to-blue-600" icon="📦" darkMode={darkMode} />
        <Card title="Faturamento" value={dashboardStats.faturamento} color="from-blue-400 to-blue-600" icon="💰" darkMode={darkMode} />
        <Card title="Entregadores" value={dashboardStats.entregadores} color="from-blue-400 to-blue-600" icon="🛵" darkMode={darkMode} />
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Pedidos Recentes</h3>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                <th className="text-left pb-2">ID</th>
                <th className="text-left pb-2">Cliente</th>
                <th className="text-left pb-2">Status</th>
                <th className="text-left pb-2">Valor</th>
                <th className="text-left pb-2">Data</th>
                <th className="text-left pb-2">Ação</th>
              </tr>
            </thead>
            <tbody className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
              {localPedidos && localPedidos.length > 0 ? (
                localPedidos.filter(pedido => pedido.status === 'Em andamento').length > 0 ? (
                  localPedidos.filter(pedido => pedido.status === 'Em andamento')
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 3)
                    .map(pedido => (
                      <tr key={pedido.id} className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="py-2">{pedido.id}</td>
                        <td>{pedido.cliente}</td>
                        <td>
                          <span className={
                            pedido.status === 'Entregue' ? 'text-green-500' :
                            pedido.status === 'Em andamento' ? 'text-yellow-500' :
                            'text-red-500'
                          }>
                            {pedido.status}
                          </span>
                        </td>
                        <td>{pedido.valor}</td>
                        <td>{new Date(pedido.created_at).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <button
                            onClick={async () => {
                              try {
                                const response = await fetch(`http://localhost:3001/api/pedidos/${pedido.id}`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    cliente: pedido.cliente,
                                    status: 'Entregue',
                                    valor: pedido.valor,
                                    detalhes: pedido.detalhes
                                  }),
                                });
                              if (response.ok) {
                                // Update local state to reflect the change
                                console.log('Pedido atualizado para Entregue:', pedido.id);
                                setLocalPedidos(prevPedidos => 
                                  prevPedidos.map(p => 
                                    p.id === pedido.id ? { ...p, status: 'Entregue' } : p
                                  )
                                );
                                // Also refresh dashboard stats
                                try {
                                  const statsResponse = await fetch('http://localhost:3001/api/dashboard/stats');
                                  if (statsResponse.ok) {
                                    const statsData = await statsResponse.json();
                                    console.log('Dashboard stats updated after order completion');
                                  }
                                } catch (error) {
                                  console.error('Error refreshing dashboard stats:', error);
                                }
                              } else {
                                console.error('Erro ao atualizar pedido:', response.status);
                              }
                            } catch (error) {
                              console.error('Error updating pedido:', error);
                              // No alert, silently handle error
                            }
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Concluir
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-2 text-center">Nenhum pedido em andamento</td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="5" className="py-2 text-center">Nenhum pedido disponível</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
          <h3 className="text-xl font-semibold mb-4">Taxa de Entrega (%)</h3>
          <div className="h-64">
            <Bar
              data={{
                labels: taxaEntregaData.labels,
                datasets: [
                  {
                    label: 'Taxa de Sucesso',
                    data: taxaEntregaData.values,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    minBarLength: 2, // Ensures even 0% values are visible as a small bar
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: darkMode ? '#fff' : '#000',
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: darkMode ? '#fff' : '#000',
                    },
                    grid: {
                      color: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      color: darkMode ? '#fff' : '#000',
                    },
                    grid: {
                      color: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
          <h3 className="text-xl font-semibold mb-4">Pedidos por Dia</h3>
          <div className="h-64">
            <Bar
              data={{
                labels: pedidosDiaData.labels,
                datasets: [
                  {
                    label: 'Pedidos Totais',
                    data: pedidosDiaData.values,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: darkMode ? '#fff' : '#000',
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: darkMode ? '#fff' : '#000',
                    },
                    grid: {
                      color: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: darkMode ? '#fff' : '#000',
                    },
                    grid: {
                      color: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
          <h3 className="text-xl font-semibold mb-4">Faturamento por Dia (R$)</h3>
          <div className="h-64">
            <Line
              data={{
                labels: faturamentoDiaData.labels,
                datasets: [
                  {
                    label: 'Faturamento',
                    data: faturamentoDiaData.values,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: darkMode ? '#fff' : '#000',
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: darkMode ? '#fff' : '#000',
                    },
                    grid: {
                      color: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: darkMode ? '#fff' : '#000',
                    },
                    grid: {
                      color: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, color, icon, darkMode }) {
  return (
    <div className={`p-6 rounded-2xl shadow-xl bg-gradient-to-tr ${color} text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase font-medium opacity-75">{title}</p>
          <h2 className="text-3xl font-bold mt-1">{value}</h2>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

export default Dashboard;
