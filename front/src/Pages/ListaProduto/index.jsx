import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importe useNavigate
import api from "../../services/api";

function ListarUsuarios() {
  const [allUsers, setAllUsers] = useState([]); // Usuários
  const [searchTerm, setSearchTerm] = useState(""); // Termo de busca
  const [selectedUser, setSelectedUser] = useState(null); // Usuário para editar
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal

  const navigate = useNavigate(); // Inicializa o hook de navegação

  useEffect(() => {
    async function loadUsers() {
      try {
        const token = localStorage.getItem("token");
        const { data: { message } } = await api.get("/listar-usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(message);
      } catch (err) {
        alert("Token inválido ou expirado");
        console.log(err);
      }
    }
    loadUsers();
  }, []);

  // Filtrar usuários conforme o termo de busca
  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para abrir o modal de edição
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); // Ou use a navegação para redirecionar
  };

  // Função para redirecionar para a página de cadastro
  const handleCreateFuncionario = () => {
    navigate("/cadastroFuncionario"); // Substitua "/cadastro-funcionario" pelo caminho correto da página de cadastro
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lista de Usuários</h2>
        
        {/* Botões de Voltar, Logout e Cadastrar Funcionário */}
        <div className="flex space-x-4">
          {/* Botão Voltar */}
          <button
            onClick={() => navigate(-1)} // Vai voltar à página anterior
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Voltar
          </button>
          
          {/* Botão Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            
          >
            Logout
          </button>

          {/* Botão Cadastrar Funcionário */}
          <button
            onClick={handleCreateFuncionario}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Cadastrar Funcionário
          </button>
        </div>
      </div>

      {/* Campo de Pesquisa */}
      <input
        type="text"
        placeholder="Buscar usuário..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />

      {/* Lista de Usuários */}
      <ul className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li key={user.id} className="bg-gray-200 p-4 rounded-md shadow-md flex justify-between items-center">
              <div>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Tipo de Usuário:</strong> {user.role}</p>
                <p><strong>Nome:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Telefone:</strong> {user.phone}</p>
                <p><strong>Peso Kg:</strong> {user.peso}</p>
                <p><strong>Data de Nascimento:</strong> {user.dataNasc}</p>
                <p><strong>Data do Cadastro:</strong> {user.userCriacao}</p>
                <p><strong>Data do Contrato:</strong> {user.dataContra}</p>
                <p><strong>Data da Edição:</strong> {user.userEdicao}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => console.log("Excluir usuário:", user.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>Nenhum usuário encontrado.</p>
        )}
      </ul>

      {/* Modal de Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Editar Usuário</h3>
            <form onSubmit={() => console.log("Salvando mudanças...")}>
              <input
                type="text"
                defaultValue={selectedUser.name}
                placeholder="Nome"
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                defaultValue={selectedUser.email}
                placeholder="Email"
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                defaultValue={selectedUser.phone}
                placeholder="Telefone"
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                defaultValue={selectedUser.peso}
                placeholder="Peso Kg"
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                defaultValue={selectedUser.dataContra}
                placeholder="Data de Contratação"
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                defaultValue={selectedUser.dataNasc}
                placeholder="Data de Nascimento"
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
              />
              {/* Outros campos de edição conforme necessário */}
              
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListarUsuarios;
