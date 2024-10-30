import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  AiOutlineSearch,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineLogout,
} from "react-icons/ai";
import Modal from "react-modal";

// Configurações do modal
Modal.setAppElement("#root");

function ListarUsuarios() {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false); // Estado de loading

  const navigate = useNavigate();

  async function loadUsers() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não está autenticado.");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { users },
      } = await api.get("/listar-usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(users);
    } catch (err) {
      alert("Token inválido ou expirado");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    alert("Você foi deslogado");
    navigate("/");
  }

  function openEditModal(user) {
    setCurrentUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setCurrentUser(null);
    setUserName("");
    setUserEmail("");
    setUserPassword("");
  }

  async function EditarUserVerToken() {
    const token = localStorage.getItem("token");
    try {
      if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) {
        alert("E-mail inválido");
        return;
      }
      if (!userPassword) {
        alert("A senha não pode estar vazia");
        return;
      }

      await api.put(
        `/editarusuarios/${currentUser.email}`,
        {
          name: userName,
          email: userEmail,
          password: userPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Usuário atualizado com sucesso!");
      closeModal();
      loadUsers();
    } catch (err) {
      alert("Erro ao atualizar usuário");
      console.log(err);
    }
  }

  async function DeletarUserVerToken(user) {
    const token = localStorage.getItem("token");
    if (!user) {
      alert("Nenhum usuário selecionado para exclusão.");
      return;
    }
    try {
      await api.delete(`/usuariosdell/${user.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Usuário deletado com sucesso!");
      loadUsers();
    } catch (err) {
      alert("Erro ao deletar usuário");
      console.log(err);
    }
  }

  // Filtrando os usuários com base no termo de pesquisa
  const filteredUsers = allUsers.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <header className="w-full max-w-3xl px-4 py-6 bg-gray-800 rounded-md shadow-lg flex justify-between items-center">
        <h2 className="text-3xl font-bold text-green-500">Lista de Usuários</h2>
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          <AiOutlineLogout className="mr-2" /> Deslogar
        </button>
      </header>

      <div className="max-w-3xl w-full mt-6 p-4 bg-gray-800 rounded-md shadow-lg">
        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="Pesquisar usuário"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-md focus:outline-none text-white placeholder-gray-400"
          />
          <button className="bg-green-500 px-4 py-2 rounded-r-md hover:bg-green-600 transition">
            <AiOutlineSearch />
          </button>
          <button
            onClick={() => navigate("/cadastro")}
            className="ml-4 flex items-center bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            <AiOutlinePlus className="mr-2" /> Cadastrar
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Carregando usuários...</p>
        ) : (
          <ul className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="bg-gray-700 p-4 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-semibold">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="bg-yellow-500 px-3 py-2 rounded-md hover:bg-yellow-600 transition flex items-center"
                    >
                      <AiOutlineEdit className="mr-1" /> Editar
                    </button>
                    <button
                      onClick={() => DeletarUserVerToken(user)}
                      className="bg-red-500 px-3 py-2 rounded-md hover:bg-red-600 transition flex items-center"
                    >
                      <AiOutlineDelete className="mr-1" /> Excluir
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-400">
                Nenhum usuário encontrado
              </p>
            )}
          </ul>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-gray-800 p-6 rounded-md shadow-lg w-1/3 mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h3 className="text-lg font-semibold text-white">Editar Usuário</h3>
        <div className="mt-4">
          <label className="block text-gray-400">Nome</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none text-white placeholder-gray-400"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-400">Email</label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none text-white placeholder-gray-400"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-400">Senha</label>
          <input
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none text-white placeholder-gray-400"
          />
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={closeModal}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={EditarUserVerToken}
            className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Salvar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ListarUsuarios;
