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
import Dashboard from './components/Dashboard';
import Pedidos from './components/Pedidos';
import Entregadores from './components/Entregadores';
import Opcoes from './components/Opcoes';

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
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
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
        const fetchWithTimeout = async (url, timeout = 5000) => {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), timeout);
          try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(id);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
          } catch (error) {
            clearTimeout(id);
            throw error;
          }
        };

        const [
          pedidosData,
          entregadoresData,
          statsData,
          tempoMedioData,
          taxaEntregaData,
          pedidosDiaData,
          faturamentoDiaData
        ] = await Promise.all([
          fetchWithTimeout('http://localhost:3001/api/pedidos').catch(err => {
            console.error('Error fetching pedidos:', err);
            return [];
          }),
          fetchWithTimeout('http://localhost:3001/api/entregadores').catch(err => {
            console.error('Error fetching entregadores:', err);
            return [];
          }),
          fetchWithTimeout('http://localhost:3001/api/dashboard/stats').catch(err => {
            console.error('Error fetching stats:', err);
            return { pedidosHoje: 0, faturamento: 'R$ 0', entregadores: 0 };
          }),
          fetchWithTimeout('http://localhost:3001/api/dashboard/graph-tempo-medio').catch(err => {
            console.error('Error fetching tempo medio:', err);
            return { labels: [], values: [] };
          }),
          fetchWithTimeout('http://localhost:3001/api/dashboard/graph-taxa-entrega').catch(err => {
            console.error('Error fetching taxa entrega:', err);
            return { labels: [], values: [] };
          }),
          fetchWithTimeout('http://localhost:3001/api/dashboard/graph-pedidos-dia').catch(err => {
            console.error('Error fetching pedidos dia:', err);
            return { labels: [], values: [] };
          }),
          fetchWithTimeout('http://localhost:3001/api/dashboard/graph-faturamento-dia').catch(err => {
            console.error('Error fetching faturamento dia:', err);
            return { labels: [], values: [] };
          })
        ]);

        console.log('Dashboard Stats Data:', statsData); // Debug log to check the received data
        
        // Calculate faturamento directly from pedidos data for delivered orders
        const calculateFaturamento = (pedidos) => {
          const deliveredOrders = pedidos.filter(pedido => pedido.status === 'Entregue');
          const totalRevenue = deliveredOrders.reduce((sum, pedido) => {
            const valor = pedido.valor ? parseFloat(pedido.valor.replace('R$ ', '').replace(',', '.')) : 0;
            return sum + (isNaN(valor) ? 0 : valor);
          }, 0);
          return `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`;
        };
        
        const formattedStatsData = {
          ...statsData,
          faturamento: calculateFaturamento(pedidosData)
        };
        
        setPedidos(pedidosData);
        setEntregadores(entregadoresData);
        setDashboardStats(formattedStatsData);
        setTempoMedioData(tempoMedioData);
        setTaxaEntregaData(taxaEntregaData);
        setPedidosDiaData(pedidosDiaData);
        setFaturamentoDiaData(faturamentoDiaData);
      } catch (error) {
        console.error('Unexpected error fetching data:', error);
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
              <Dashboard 
                dashboardStats={dashboardStats} 
                pedidos={pedidos} 
                tempoMedioData={tempoMedioData} 
                taxaEntregaData={taxaEntregaData} 
                pedidosDiaData={pedidosDiaData} 
                faturamentoDiaData={faturamentoDiaData} 
                darkMode={darkMode} 
              />
            )}
            {activeTab === "pedidos" && (
              <Pedidos 
                pedidos={pedidos} 
                setPedidos={setPedidos} 
                dashboardStats={dashboardStats} 
                setDashboardStats={setDashboardStats} 
                filterStatus={filterStatus} 
                setFilterStatus={setFilterStatus} 
                selectedPedido={selectedPedido} 
                setSelectedPedido={setSelectedPedido} 
                darkMode={darkMode} 
                loading={loading} 
                removeAccents={removeAccents} 
              />
            )}
            {activeTab === "entregadores" && (
              <Entregadores 
                entregadores={entregadores} 
                setEntregadores={setEntregadores} 
                dashboardStats={dashboardStats} 
                setDashboardStats={setDashboardStats} 
                selectedEntregador={selectedEntregador} 
                setSelectedEntregador={setSelectedEntregador} 
                darkMode={darkMode} 
                loading={loading} 
                removeAccents={removeAccents} 
              />
            )}
            {activeTab === "opcoes" && (
              <Opcoes 
                darkMode={darkMode} 
                toggleDarkMode={toggleDarkMode} 
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
