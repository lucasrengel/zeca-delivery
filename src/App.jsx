import React, { useEffect, useState } from "react";
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

function App() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [selectedEntregador, setSelectedEntregador] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [entregadores, setEntregadores] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ pedidosHoje: 0, faturamento: 'R$ 0', tempoMedio: '0 min', entregadores: 0 });
  const [tempoMedioData, setTempoMedioData] = useState({ labels: [], values: [] });
  const [taxaEntregaData, setTaxaEntregaData] = useState({ labels: [], values: [] });
  const [pedidosDiaData, setPedidosDiaData] = useState({ labels: [], values: [] });
  const [faturamentoDiaData, setFaturamentoDiaData] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock data as fallback
        const mockPedidos = [
          { id: 1, order_id: '#001', cliente: 'Joao Silva', status: 'Entregue', valor: 'R$ 85,00', detalhes: 'Pedido entregue no prazo. Endereco: Rua das Flores, 123. Itens: 2 pizzas.' },
          { id: 2, order_id: '#002', cliente: 'Maria Oliveira', status: 'Em andamento', valor: 'R$ 120,00', detalhes: 'Pedido em rota de entrega. Endereco: Av. Paulista, 456. Itens: 3 hamburgueres.' },
          { id: 3, order_id: '#003', cliente: 'Pedro Santos', status: 'Cancelado', valor: 'R$ 65,00', detalhes: 'Pedido cancelado pelo cliente. Motivo: Mudanca de planos. Endereco: Rua do Comercio, 789.' },
          { id: 4, order_id: '#004', cliente: 'Ana Costa', status: 'Entregue', valor: 'R$ 95,00', detalhes: 'Pedido entregue com sucesso. Endereco: Rua das Palmeiras, 321. Itens: 1 sushi.' },
          { id: 5, order_id: '#005', cliente: 'Lucas Almeida', status: 'Em andamento', valor: 'R$ 110,00', detalhes: 'Pedido em preparacao. Endereco: Av. Brasil, 789. Itens: 4 sanduiches.' },
          { id: 6, order_id: '#006', cliente: 'Fernanda Lima', status: 'Cancelado', valor: 'R$ 50,00', detalhes: 'Pedido cancelado por falta de estoque. Endereco: Rua do Sol, 456. Itens: 2 saladas.' },
          { id: 7, order_id: '#007', cliente: 'Rafael Mendes', status: 'Entregue', valor: 'R$ 130,00', detalhes: 'Pedido entregue no prazo. Endereco: Av. Central, 123. Itens: 3 pizzas.' },
          { id: 8, order_id: '#008', cliente: 'Beatriz Souza', status: 'Em andamento', valor: 'R$ 75,00', detalhes: 'Pedido em rota. Endereco: Rua da Paz, 987. Itens: 1 bolo.' },
          { id: 9, order_id: '#009', cliente: 'Gabriel Rocha', status: 'Entregue', valor: 'R$ 88,00', detalhes: 'Pedido entregue com sucesso. Endereco: Av. das Nacoes, 654. Itens: 2 hamburgueres.' },
          { id: 10, order_id: '#010', cliente: 'Camila Pereira', status: 'Cancelado', valor: 'R$ 45,00', detalhes: 'Pedido cancelado pelo cliente. Endereco: Rua da Esperanca, 321. Itens: 1 sobremesa.' }
        ];
        
        const mockEntregadores = [
          { id: 1, nome: 'Carlos Almeida', status: 'Disponivel', contato: 'carlos.almeida@email.com', info: 'Entregador desde janeiro de 2022. Disponivel para entregas na regiao central.' },
          { id: 2, nome: 'Ana Ribeiro', status: 'Em entrega', contato: 'ana.ribeiro@email.com', info: 'Atualmente em entrega na zona sul. Previsao de retorno em 30 minutos.' },
          { id: 3, nome: 'Rafael Lima', status: 'Indisponivel', contato: 'rafael.lima@email.com', info: 'Em licenca ate o proximo mes.' },
          { id: 4, nome: 'Beatriz Silva', status: 'Disponivel', contato: 'beatriz.silva@email.com', info: 'Disponivel para entregas na zona norte.' },
          { id: 5, nome: 'Diego Santos', status: 'Em entrega', contato: 'diego.santos@email.com', info: 'Entrega em andamento na regiao oeste.' },
          { id: 6, nome: 'Fernanda Oliveira', status: 'Indisponivel', contato: 'fernanda.oliveira@email.com', info: 'Em manutencao de veiculo.' },
          { id: 7, nome: 'Gabriel Pereira', status: 'Disponivel', contato: 'gabriel.pereira@email.com', info: 'Disponivel para entregas na regiao leste.' },
          { id: 8, nome: 'Juliana Mendes', status: 'Em entrega', contato: 'juliana.mendes@email.com', info: 'Entrega em andamento no centro.' },
          { id: 9, nome: 'Lucas Ferreira', status: 'Indisponivel', contato: 'lucas.ferreira@email.com', info: 'Em treinamento ate proxima semana.' },
          { id: 10, nome: 'Mariana Costa', status: 'Disponivel', contato: 'mariana.costa@email.com', info: 'Disponivel para entregas em qualquer regiao.' }
        ];

        const mockStats = { pedidosHoje: 42, faturamento: 'R$ 3.250', tempoMedio: '24 min', entregadores: 12 };
        const mockTempoMedio = { labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], values: [25, 22, 28, 24, 30, 27, 23] };
        const mockTaxaEntrega = { labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], values: [95, 92, 98, 90, 88, 93, 96] };
        const mockPedidosDia = { labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], values: [15, 18, 12, 20, 22, 17, 14] };
        const mockFaturamentoDia = { labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], values: [450, 520, 380, 610, 700, 550, 480] };

        // Attempt to fetch data with a timeout
        const fetchWithTimeout = async (url, timeout = 5000) => {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), timeout);
          try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(id);
            return response;
          } catch (error) {
            clearTimeout(id);
            throw error;
          }
        };

        try {
          const pedidosResponse = await fetchWithTimeout('http://localhost:3001/api/pedidos');
          const pedidosData = await pedidosResponse.json();
          setPedidos(pedidosData);
        } catch (error) {
          console.error('Error fetching pedidos:', error);
          setPedidos(mockPedidos);
        }

        try {
          const entregadoresResponse = await fetchWithTimeout('http://localhost:3001/api/entregadores');
          const entregadoresData = await entregadoresResponse.json();
          setEntregadores(entregadoresData);
        } catch (error) {
          console.error('Error fetching entregadores:', error);
          setEntregadores(mockEntregadores);
        }

        try {
          const statsResponse = await fetchWithTimeout('http://localhost:3001/api/dashboard-stats');
          const statsData = await statsResponse.json();
          setDashboardStats(statsData);
        } catch (error) {
          console.error('Error fetching stats:', error);
          setDashboardStats(mockStats);
        }

        try {
          const tempoMedioResponse = await fetchWithTimeout('http://localhost:3001/api/graph-tempo-medio');
          const tempoMedioData = await tempoMedioResponse.json();
          setTempoMedioData(tempoMedioData);
        } catch (error) {
          console.error('Error fetching tempo medio data:', error);
          setTempoMedioData(mockTempoMedio);
        }

        try {
          const taxaEntregaResponse = await fetchWithTimeout('http://localhost:3001/api/graph-taxa-entrega');
          const taxaEntregaData = await taxaEntregaResponse.json();
          setTaxaEntregaData(taxaEntregaData);
        } catch (error) {
          console.error('Error fetching taxa entrega data:', error);
          setTaxaEntregaData(mockTaxaEntrega);
        }

        try {
          const pedidosDiaResponse = await fetchWithTimeout('http://localhost:3001/api/graph-pedidos-dia');
          const pedidosDiaData = await pedidosDiaResponse.json();
          setPedidosDiaData(pedidosDiaData);
        } catch (error) {
          console.error('Error fetching pedidos dia data:', error);
          setPedidosDiaData(mockPedidosDia);
        }

        try {
          const faturamentoDiaResponse = await fetchWithTimeout('http://localhost:3001/api/graph-faturamento-dia');
          const faturamentoDiaData = await faturamentoDiaResponse.json();
          setFaturamentoDiaData(faturamentoDiaData);
        } catch (error) {
          console.error('Error fetching faturamento dia data:', error);
          setFaturamentoDiaData(mockFaturamentoDia);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const getFilteredPedidos = () => {
    if (!Array.isArray(pedidos)) {
      return [];
    }
    let filteredPedidos = pedidos.map(pedido => ({
      ...pedido,
      cliente: removeAccents(pedido.cliente),
      status: removeAccents(pedido.status),
      detalhes: removeAccents(pedido.detalhes || ''),
      valor: removeAccents(pedido.valor)
    }));
    if (filterStatus === "Todos") {
      return filteredPedidos;
    }
    return filteredPedidos.filter(pedido => pedido.status === removeAccents(filterStatus));
  };

  const themeClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";

  return (
    <div className={`min-h-screen font-sans ${themeClass}`}>
      <div className="flex">
        {/* Sidebar */}
        <aside className={`w-64 ${darkMode ? 'bg-gray-950' : 'bg-blue-50'} border-r ${darkMode ? 'border-gray-700' : 'border-blue-200'} h-screen fixed`}>
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-blue-200'}`}>
            <h2 className="text-xl font-bold text-blue-500">Zeca Delivery</h2>
          </div>
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-lg ${activeTab === "dashboard" ? (darkMode ? "bg-blue-900 text-blue-400" : "bg-blue-100 text-blue-600") : (darkMode ? "hover:bg-gray-800" : "hover:bg-blue-100")}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("pedidos")}
              className={`w-full text-left px-4 py-3 rounded-lg ${activeTab === 'pedidos' ? (darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600') : (darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-100')}`}
            >
              Pedidos
            </button>
            <button
              onClick={() => setActiveTab("entregadores")}
              className={`w-full text-left px-4 py-3 rounded-lg ${activeTab === 'entregadores' ? (darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600') : (darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-100')}`}
            >
              Entregadores
            </button>
            <button
              onClick={() => setActiveTab("opcoes")}
              className={`w-full text-left px-4 py-3 rounded-lg ${activeTab === 'opcoes' ? (darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600') : (darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-100')}`}
            >
              Opções
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <header className={`p-4 flex justify-between items-center border-b ${darkMode ? 'border-gray-700 bg-gray-950' : 'border-gray-200 bg-blue-50'} shadow-lg`}>
            <h1 className="text-xl font-bold">Zeca Delivery - Painel</h1>
            <span className="text-sm text-gray-400">{currentTime}</span>
          </header>

          <main className="p-6">
            {activeTab === "dashboard" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-500">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <Card title="Pedidos Hoje" value={dashboardStats.pedidosHoje} color="from-blue-400 to-blue-600" icon="📦" darkMode={darkMode} />
                  <Card title="Faturamento" value={dashboardStats.faturamento} color="from-blue-400 to-blue-600" icon="💰" darkMode={darkMode} />
                  <Card title="Tempo Médio" value={dashboardStats.tempoMedio} color="from-blue-400 to-blue-600" icon="⏱️" darkMode={darkMode} />
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
                        </tr>
                      </thead>
                      <tbody className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                        <tr className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <td className="py-2">#001</td>
                          <td>João Silva</td>
                          <td><span className="text-green-500">Entregue</span></td>
                          <td>R$ 85,00</td>
                        </tr>
                        <tr className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                          <td className="py-2">#002</td>
                          <td>Maria Oliveira</td>
                          <td><span className="text-yellow-500">Em andamento</span></td>
                          <td>R$ 120,00</td>
                        </tr>
                        <tr className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                          <td className="py-2">#003</td>
                          <td>Pedro Santos</td>
                          <td><span className="text-red-500">Cancelado</span></td>
                          <td>R$ 65,00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
                    <h3 className="text-xl font-semibold mb-4">Tempo Médio de Entrega (minutos)</h3>
                    <div className="h-64">
                      <Line
                        data={{
                          labels: tempoMedioData.labels,
                          datasets: [
                            {
                              label: 'Tempo Médio',
                              data: tempoMedioData.values,
                              borderColor: 'rgba(54, 162, 235, 1)',
                              backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
            )}
            {activeTab === "pedidos" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-500">Pedidos</h2>
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
                  <h3 className="text-xl font-semibold mb-4">Todos os Pedidos</h3>
                  <div className="mb-4 flex gap-2">
                    <button
                      onClick={() => setFilterStatus("Todos")}
                      className={`px-3 py-1 rounded ${filterStatus === "Todos" ? (darkMode ? "bg-blue-900 text-blue-400" : "bg-blue-100 text-blue-600") : (darkMode ? "bg-gray-700" : "bg-gray-200")}`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setFilterStatus("Entregue")}
                      className={`px-3 py-1 rounded ${filterStatus === "Entregue" ? (darkMode ? "bg-blue-900 text-blue-400" : "bg-blue-100 text-blue-600") : (darkMode ? "bg-gray-700" : "bg-gray-200")}`}
                    >
                      Entregue
                    </button>
                    <button
                      onClick={() => setFilterStatus("Em andamento")}
                      className={`px-3 py-1 rounded ${filterStatus === "Em andamento" ? (darkMode ? "bg-blue-900 text-blue-400" : "bg-blue-100 text-blue-600") : (darkMode ? "bg-gray-700" : "bg-gray-200")}`}
                    >
                      Em andamento
                    </button>
                    <button
                      onClick={() => setFilterStatus("Cancelado")}
                      className={`px-3 py-1 rounded ${filterStatus === "Cancelado" ? (darkMode ? "bg-blue-900 text-blue-400" : "bg-blue-100 text-blue-600") : (darkMode ? "bg-gray-700" : "bg-gray-200")}`}
                    >
                      Cancelado
                    </button>
                  </div>
                  <div className="overflow-y-auto h-80">
                    <table className="w-full">
                      <thead>
                        <tr className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          <th className="text-left pb-2">ID</th>
                          <th className="text-left pb-2">Cliente</th>
                          <th className="text-left pb-2">Status</th>
                          <th className="text-left pb-2">Valor</th>
                          <th className="text-left pb-2">Ação</th>
                        </tr>
                      </thead>
                      <tbody className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                        {loading ? (
                          <tr>
                            <td colSpan="5" className="py-2 text-center">Carregando dados...</td>
                          </tr>
                        ) : (
                          getFilteredPedidos().map(pedido => (
                            <tr key={pedido.id} className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                              <td className="py-2">{pedido.order_id}</td>
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
                              <td>
                                <button
                                  onClick={() => setSelectedPedido(pedido)}
                                  className={`px-2 py-1 rounded ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}
                                >
                                  Detalhes
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {selectedPedido && (
                  <div className={`fixed inset-0 flex items-center justify-center ${darkMode ? 'bg-black bg-opacity-50' : 'bg-gray-500 bg-opacity-50'}`}>
                    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg max-w-md w-full`}>
                      <h3 className="text-xl font-bold mb-4">Detalhes do Pedido {selectedPedido.id}</h3>
                      <p><strong>Cliente:</strong> {selectedPedido.cliente}</p>
                      <p><strong>Status:</strong> {selectedPedido.status}</p>
                      <p><strong>Valor:</strong> {selectedPedido.valor}</p>
                      <p><strong>Detalhes:</strong> {selectedPedido.detalhes}</p>
                      <button
                        onClick={() => setSelectedPedido(null)}
                        className={`mt-4 px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "entregadores" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-500">Entregadores</h2>
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
                  <h3 className="text-xl font-semibold mb-4">Entregadores Cadastrados</h3>
                  <div className="overflow-y-auto h-80">
                    <table className="w-full">
                      <thead>
                        <tr className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          <th className="text-left pb-2">Nome</th>
                          <th className="text-left pb-2">Status</th>
                          <th className="text-left pb-2">Contato</th>
                          <th className="text-left pb-2">Ação</th>
                        </tr>
                      </thead>
                      <tbody className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                        {loading ? (
                          <tr>
                            <td colSpan="4" className="py-2 text-center">Carregando dados...</td>
                          </tr>
                        ) : (
                          Array.isArray(entregadores) ? entregadores.map(entregador => {
                            const normalizedEntregador = {
                              ...entregador,
                              nome: removeAccents(entregador.nome),
                              status: removeAccents(entregador.status),
                              contato: entregador.contato,
                              info: removeAccents(entregador.info || '')
                            };
                            return (
                              <tr key={normalizedEntregador.id} className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <td className="py-2">{normalizedEntregador.nome}</td>
                                <td>{normalizedEntregador.status}</td>
                                <td>{normalizedEntregador.contato}</td>
                                <td>
                                  <button
                                    onClick={() => setSelectedEntregador(normalizedEntregador)}
                                    className={`px-2 py-1 rounded ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}
                                  >
                                    Detalhes
                                  </button>
                                </td>
                              </tr>
                            );
                          }) : []
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {selectedEntregador && (
                  <div className={`fixed inset-0 flex items-center justify-center ${darkMode ? 'bg-black bg-opacity-50' : 'bg-gray-500 bg-opacity-50'}`}>
                    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg max-w-md w-full`}>
                      <h3 className="text-xl font-bold mb-4">Detalhes do Entregador {selectedEntregador.nome}</h3>
                      <p><strong>Status:</strong> {selectedEntregador.status}</p>
                      <p><strong>Contato:</strong> {selectedEntregador.contato}</p>
                      <p><strong>Informações Adicionais:</strong> {selectedEntregador.info}</p>
                      <button
                        onClick={() => setSelectedEntregador(null)}
                        className={`mt-4 px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "opcoes" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-500">Opções</h2>
                <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Tema do Site</h3>
                    <button
                      onClick={toggleDarkMode}
                      className={`flex items-center px-4 py-2 rounded-lg transition duration-300 ${darkMode ? 'bg-blue-900 text-blue-400 hover:bg-blue-800' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                    >
                      <span className="mr-2">{darkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
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

export default App;
