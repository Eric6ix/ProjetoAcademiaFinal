import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaEdit, FaTrashAlt, FaSignOutAlt, FaArrowLeft, FaUserPlus } from "react-icons/fa"; // Importando ícones do React Icons
import api from "../../services/api";

function ListarUsuarios() {
  const [allUsers, setAllUsers] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPeso, setUserPeso] = useState("");
  const [userDataContra, setUserDataContra] = useState("");
  const [userDataNasc, setUserDataNasc] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const navigate = useNavigate(); 
  const roles = ["ADMIN", "FUNCIONARIO", "ALUNO"];

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

  const filteredUsers = allUsers.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); 
    window.location.reload();
  };

  function handleEdit(user) {
    setSelectedUser(user); 
    setUserRole(user.role);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserPhone(user.phone);
    setUserPeso(user.peso);
    setUserDataContra(user.dataContra);
    setUserDataNasc(user.dataNasc);
    setUserPassword(""); 
    setIsModalOpen(true); 
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedUser(null); 
    setUserRole("");
    setUserName("");
    setUserEmail("");
    setUserPhone("");
    setUserPeso("");
    setUserDataContra("");
    setUserDataNasc("");
    setUserPassword(""); 
  }

  async function EditarUser(e) {
    e.preventDefault(); 
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
        `/editarusuario/${selectedUser.email}`,
        {
          role: userRole,
          name: userName,
          email: userEmail,
          phone: userPhone,
          peso: userPeso,
          dataContra: userDataContra,
          dataNasc: userDataNasc,
          password: userPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Usuário atualizado com sucesso!");

      const updatedUsers = allUsers.map((user) =>
        user.email === selectedUser.email
          ? { ...user, name: userName, role: userRole, email: userEmail, phone: userPhone, peso: userPeso, dataContra: userDataContra, dataNasc: userDataNasc }
          : user
      );
      setAllUsers(updatedUsers);
      closeModal(); 

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

      setAllUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));

      alert("Usuário deletado com sucesso!");
    } catch (err) {
      alert("Erro ao deletar usuário");
      console.log(err);
    }
  }

  return (
    <div className="p-6 bg-gray-800 min-h-screen text-white"> {/* Alterei para bg-gray-800 e texto branco */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-green-400">Lista de Usuários</h2>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          >
            <FaArrowLeft className="inline mr-2" /> Voltar
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            <FaSignOutAlt className="inline mr-2" /> Logout
          </button>

          <button
            onClick={() => navigate("/cadastroFuncionario")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            <FaUserPlus className="inline mr-2" /> Cadastrar Funcionário
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar usuário..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-3 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <ul className="space-y-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li key={user.id} className="bg-gray-700 p-6 rounded-lg shadow-lg flex justify-between items-center">
              <div className="space-y-2">
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
              <div className="space-x-4">
                <button
                  onClick={() => handleEdit(user)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  <FaEdit className="inline mr-2" /> Editar
                </button>
                <button
                  onClick={() => DeletarUserVerToken(user)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                >
                  <FaTrashAlt className="inline mr-2" /> Excluir
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhum usuário encontrado.</p>
        )}
      </ul>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-2xl font-semibold text-gray-200 mb-4">Editar Usuário</h3>
            <form onSubmit={EditarUser}>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full mb-3 p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" disabled>Selecione o tipo de usuário</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>{role}</option>
                ))}
              </select>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nome"
                className="w-full mb-3 p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Email"
                className="w-full mb-3 p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="Telefone"
                className="w-full mb-3 p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={userPeso}
                onChange={(e) => setUserPeso(e.target.value)}
                placeholder="Peso Kg"
                className="w-full mb-3 p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={userDataContra}
                onChange={(e) => setUserDataContra(e.target.value)}
                placeholder="Data de Contratação"
                className="w-full mb-3 p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={userDataNasc}
                onChange={(e) => setUserDataNasc(e.target.value)}
                placeholder="Data de Nascimento"
                className="w-full mb-3 p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Senha"
                className="w-full mb-3 p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-600 rounded-lg hover:bg-gray-700 transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
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
