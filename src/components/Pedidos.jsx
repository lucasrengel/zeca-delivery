import React, { useState } from "react";

function Pedidos({ pedidos, setPedidos, dashboardStats, setDashboardStats, filterStatus, setFilterStatus, selectedPedido, setSelectedPedido, darkMode, loading, removeAccents }) {
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
      return filteredPedidos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return filteredPedidos.filter(pedido => pedido.status === removeAccents(filterStatus)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-blue-500">Pedidos</h2>
      <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Todos os Pedidos</h3>
          <button
            onClick={() => setSelectedPedido({ id: 'new', cliente: '', status: 'Em andamento', valor: '', detalhes: '' })}
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}
          >
            Adicionar Pedido
          </button>
        </div>
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
                <th className="text-left pb-2">Data</th>
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
                        onClick={() => setSelectedPedido(pedido)}
                        className={`px-2 py-1 rounded mr-1 ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}
                      >
                        Detalhes
                      </button>
                      <button
                        onClick={() => setSelectedPedido({ ...pedido, editMode: true })}
                        className={`px-2 py-1 rounded mr-1 ${darkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(`http://localhost:3001/api/pedidos/${pedido.id}`, {
                              method: 'DELETE'
                            });
                            if (response.ok) {
                              setPedidos(pedidos.filter(p => p.id !== pedido.id));
                              // Refresh dashboard stats
                              const statsResponse = await fetch('http://localhost:3001/api/dashboard-stats');
                              if (statsResponse.ok) {
                                const statsData = await statsResponse.json();
                                setDashboardStats(statsData);
                              }
                            } else {
                              console.error('Erro ao excluir pedido:', response.status);
                            }
                          } catch (error) {
                            console.error('Error deleting pedido:', error);
                          }
                        }}
                        className={`px-2 py-1 rounded ${darkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600'}`}
                      >
                        Excluir
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
            {selectedPedido.id === 'new' ? (
              <>
                <h3 className="text-xl font-bold mb-4">Adicionar Novo Pedido</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  let valor = e.target.valor.value;
                  valor = valor.replace(/[^0-9,.]/g, '').replace(',', '.');
                  const parts = valor.split('.');
                  if (parts.length === 2) {
                    valor = 'R$ ' + parts[0] + ',' + parts[1].padEnd(2, '0').slice(0, 2);
                  } else {
                    valor = 'R$ ' + valor + ',00';
                  }
                  const newPedido = {
                    cliente: e.target.cliente.value,
                    status: e.target.status.value,
                    valor: valor,
                    detalhes: e.target.detalhes.value,
                    endereco: e.target.endereco.value
                  };
                  try {
                    const response = await fetch('http://localhost:3001/api/pedidos', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newPedido)
                    });
                    if (response.ok) {
                      const addedPedido = await response.json();
                      setPedidos([...pedidos, addedPedido]);
                      setSelectedPedido(null);
                      // Refresh dashboard stats
                      try {
                        const statsResponse = await fetch('http://localhost:3001/api/dashboard-stats');
                        if (statsResponse.ok) {
                          const statsData = await statsResponse.json();
                          setDashboardStats(statsData);
                        }
                      } catch (error) {
                        console.error('Error refreshing dashboard stats:', error);
                      }
                    } else {
                      console.error('Erro ao adicionar pedido:', response.status);
                    }
                  } catch (error) {
                    console.error('Error adding pedido:', error);
                  }
                }}>
                  <div className="mb-4">
                    <label className="block mb-1">Cliente:</label>
                    <input type="text" name="cliente" required className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Status:</label>
                    <select name="status" required className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}>
                      <option value="Entregue">Entregue</option>
                      <option value="Em andamento" selected>Em andamento</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Valor:</label>
                    <input type="text" name="valor" required placeholder="0,00" className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9,.]/g, '');
                      if (value) {
                        e.target.value = value;
                      }
                    }} />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Detalhes:</label>
                    <textarea name="detalhes" className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} rows="3"></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Endereço:</label>
                    <textarea name="endereco" className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} rows="2"></textarea>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setSelectedPedido(null)} className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-700'}`}>Cancelar</button>
                    <button type="submit" className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>Salvar</button>
                  </div>
                </form>
              </>
            ) : selectedPedido.editMode ? (
              <>
                <h3 className="text-xl font-bold mb-4">Editar Pedido {selectedPedido.order_id}</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  let valor = e.target.valor.value;
                  valor = valor.replace(/[^0-9,.]/g, '').replace(',', '.');
                  const parts = valor.split('.');
                  if (parts.length === 2) {
                    valor = 'R$ ' + parts[0] + ',' + parts[1].padEnd(2, '0').slice(0, 2);
                  } else {
                    valor = 'R$ ' + valor + ',00';
                  }
                  const updatedPedido = {
                    cliente: e.target.cliente.value,
                    status: e.target.status.value,
                    valor: valor,
                    detalhes: e.target.detalhes.value
                  };
                  try {
                    const response = await fetch(`http://localhost:3001/api/pedidos/${selectedPedido.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(updatedPedido)
                    });
                    if (response.ok) {
                      const updatedData = await response.json();
                      setPedidos(pedidos.map(p => p.id === selectedPedido.id ? updatedData : p));
                      setSelectedPedido(null);
                      // Refresh dashboard stats
                      try {
                        const statsResponse = await fetch('http://localhost:3001/api/dashboard-stats');
                        if (statsResponse.ok) {
                          const statsData = await statsResponse.json();
                          setDashboardStats(statsData);
                        }
                      } catch (error) {
                        console.error('Error refreshing dashboard stats:', error);
                      }
                    } else {
                      console.error('Erro ao atualizar pedido:', response.status);
                    }
                  } catch (error) {
                    console.error('Error updating pedido:', error);
                  }
                }}>
                  <div className="mb-4">
                    <label className="block mb-1">Cliente:</label>
                    <input type="text" name="cliente" defaultValue={selectedPedido.cliente} required className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Status:</label>
                    <select name="status" defaultValue={selectedPedido.status} required className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}>
                      <option value="Entregue">Entregue</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Valor:</label>
                    <input type="text" name="valor" defaultValue={selectedPedido.valor} required placeholder="R$ 0,00" className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Detalhes:</label>
                    <textarea name="detalhes" defaultValue={selectedPedido.detalhes} className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} rows="3"></textarea>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setSelectedPedido(null)} className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-700'}`}>Cancelar</button>
                    <button type="submit" className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>Salvar</button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Detalhes do Pedido #{selectedPedido.id}</h3>
                <p><strong>Cliente:</strong> {selectedPedido.cliente}</p>
                <p><strong>Status:</strong> {selectedPedido.status}</p>
                <p><strong>Valor:</strong> {selectedPedido.valor}</p>
                <p><strong>Detalhes:</strong> {selectedPedido.detalhes}</p>
                <p><strong>Endereço:</strong> {selectedPedido.endereco || 'Não informado'}</p>
                <button
                  onClick={() => setSelectedPedido(null)}
                  className={`mt-4 px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}
                >
                  Fechar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Pedidos;
