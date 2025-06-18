import React from "react";

function Entregadores({ entregadores, setEntregadores, dashboardStats, setDashboardStats, selectedEntregador, setSelectedEntregador, darkMode, loading, removeAccents }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-blue-500">Entregadores</h2>
      <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Entregadores Cadastrados</h3>
          <button
            onClick={() => setSelectedEntregador({ id: 'new', nome: '', status: 'Disponivel', contato: '', info: '' })}
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}
          >
            Adicionar Entregador
          </button>
        </div>
        <div className="overflow-y-auto h-80">
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                <th className="text-left pb-2">Nome</th>
                <th className="text-left pb-2">Status</th>
                <th className="text-left pb-2">Contato</th>
                <th className="text-left pb-2">Ações</th>
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
                      <td className="flex gap-2">
                        <button
                          onClick={() => setSelectedEntregador(normalizedEntregador)}
                          className={`px-2 py-1 rounded ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}
                        >
                          Detalhes
                        </button>
                        <button
                          onClick={() => setSelectedEntregador({ ...normalizedEntregador, editMode: true })}
                          className={`px-2 py-1 rounded ${darkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}
                        >
                          Editar
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(`http://localhost:3001/api/entregadores/${normalizedEntregador.id}`, {
                                method: 'DELETE',
                              });
                              if (response.ok) {
                                const updatedEntregadores = entregadores.filter(e => e.id !== normalizedEntregador.id);
                                setEntregadores(updatedEntregadores);
                                // Refresh dashboard stats
                                try {
                                  const statsResponse = await fetch('http://localhost:3001/api/dashboard/stats');
                                  if (statsResponse.ok) {
                                    const statsData = await statsResponse.json();
                                    setDashboardStats(statsData);
                                  }
                                } catch (error) {
                                  console.error('Error refreshing dashboard stats:', error);
                                }
                              } else {
                                console.error('Erro ao excluir entregador:', response.status);
                              }
                            } catch (error) {
                              console.error('Error deleting entregador:', error);
                            }
                          }}
                          className={`px-2 py-1 rounded ${darkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600'}`}
                        >
                          Excluir
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
            {selectedEntregador.id === 'new' ? (
              <>
                <h3 className="text-xl font-bold mb-4">Adicionar Novo Entregador</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const newEntregador = {
                    nome: e.target.nome.value,
                    status: e.target.status.value,
                    contato: e.target.contato.value,
                    info: e.target.info.value
                  };
                  try {
                    const response = await fetch('http://localhost:3001/api/entregadores', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newEntregador)
                    });
                    if (response.ok) {
                      const addedEntregador = await response.json();
                      setEntregadores([...entregadores, addedEntregador]);
                      setSelectedEntregador(null);
                      // Refresh dashboard stats
                      try {
                        const statsResponse = await fetch('http://localhost:3001/api/dashboard/stats');
                        if (statsResponse.ok) {
                          const statsData = await statsResponse.json();
                          setDashboardStats(statsData);
                        }
                      } catch (error) {
                        console.error('Error refreshing dashboard stats:', error);
                      }
                    } else {
                      console.error('Erro ao adicionar entregador:', response.status);
                    }
                  } catch (error) {
                    console.error('Error adding entregador:', error);
                  }
                }}>
                  <div className="mb-4">
                    <label className="block mb-1">Nome:</label>
                    <input type="text" name="nome" required className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Status:</label>
                    <select name="status" required className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}>
                      <option value="Disponivel" selected>Disponível</option>
                      <option value="Em entrega">Em entrega</option>
                      <option value="Indisponivel">Indisponível</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Contato:</label>
                    <input type="text" name="contato" required className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Informações Adicionais:</label>
                    <textarea name="info" className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} rows="3"></textarea>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setSelectedEntregador(null)} className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-700'}`}>Cancelar</button>
                    <button type="submit" className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>Salvar</button>
                  </div>
                </form>
              </>
            ) : selectedEntregador.editMode ? (
              <>
                <h3 className="text-xl font-bold mb-4">Editar Entregador {selectedEntregador.nome}</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const updatedEntregador = {
                    nome: e.target.nome.value,
                    status: e.target.status.value,
                    contato: e.target.contato.value,
                    info: e.target.info.value
                  };
                  try {
                    const response = await fetch(`http://localhost:3001/api/entregadores/${selectedEntregador.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(updatedEntregador)
                    });
                    if (response.ok) {
                      const updatedData = await response.json();
                      const updatedList = entregadores.map(e => 
                        e.id === selectedEntregador.id ? updatedData : e
                      );
                      setEntregadores(updatedList);
                      setSelectedEntregador(null);
                    } else {
                      console.error('Erro ao atualizar entregador:', response.status);
                    }
                  } catch (error) {
                    console.error('Error updating entregador:', error);
                  }
                }}>
                  <div className="mb-4">
                    <label className="block mb-1">Nome:</label>
                    <input type="text" name="nome" defaultValue={selectedEntregador.nome} required className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Status:</label>
                    <select name="status" defaultValue={selectedEntregador.status} required className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}>
                      <option value="Disponivel">Disponível</option>
                      <option value="Em entrega">Em entrega</option>
                      <option value="Indisponivel">Indisponível</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Contato:</label>
                    <input type="text" name="contato" defaultValue={selectedEntregador.contato} required className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Informações Adicionais:</label>
                    <textarea name="info" defaultValue={selectedEntregador.info} className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} rows="3"></textarea>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setSelectedEntregador(null)} className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-700'}`}>Cancelar</button>
                    <button type="submit" className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>Salvar</button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Detalhes do Entregador {selectedEntregador.nome}</h3>
                <p><strong>Status:</strong> {selectedEntregador.status}</p>
                <p><strong>Contato:</strong> {selectedEntregador.contato}</p>
                <p><strong>Informações Adicionais:</strong> {selectedEntregador.info}</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setSelectedEntregador(null)}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-700'}`}
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => setSelectedEntregador({ ...selectedEntregador, editMode: true })}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}
                  >
                    Editar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Entregadores;
