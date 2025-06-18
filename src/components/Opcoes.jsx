import React from "react";

function Opcoes({ darkMode, toggleDarkMode }) {
  return (
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
  );
}

export default Opcoes;
