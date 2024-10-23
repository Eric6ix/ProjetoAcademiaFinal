import { useEffect, useState } from "react";
import Modal from "react-modal";
import api from "../../services/api";
Modal.setAppElement("#root");

function ListarUsuarios() {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const token = localStorage.getItem("token");
        const {
          data: { users },
        } = await api.get("/listar-usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(users);
      } catch (err) {
        alert("Token inválido ou expirado");
        console.log(err);
      }
    }

    loadUsers();
  }, []);

  const openModal = (user) => {
    setUserToEdit(user);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditedPassword(user.password || ""); // Verifica se há senha para preencher
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/usuarios/${userToEdit.id}`, {
        name: editedName,
        email: editedEmail,
        password: editedPassword,
      });

      const updatedUsers = allUsers.map((user) =>
        user.id === userToEdit.id
          ? { ...user, name: editedName, email: editedEmail, password: editedPassword }
          : user
      );
      setAllUsers(updatedUsers);

      closeModal();
    } catch (err) {
      console.error("Erro ao atualizar o usuário", err);
      alert("Erro ao atualizar o usuário");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-3xl font-extrabold text-center text-green-600 uppercase mb-8">
        Lista de Usuários
      </h2>

      <div className="max-w-4xl mx-auto">
        <hr className="border-t-2 border-green-500 mb-8" />

        <ul className="space-y-8">
          {allUsers.length > 0 ? (
            allUsers.map((user) => (
              <li
                key={user.id}
                className="bg-white p-6 shadow-md rounded-lg flex items-center justify-between"
              >
                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="text-right">
                  <button
                    className="ml-4 text-blue-500 hover:text-blue-700"
                    onClick={() => openModal(user)}
                  >
                    Editar
                  </button>
                  <span className="text-gray-500 text-xs">ID: {user.id}</span>
                </div>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500">
              Nenhum usuário encontrado
            </li>
          )}
        </ul>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Editar Usuário</h2>
          <form onSubmit={handleEditUser}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Nome:
              </label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Senha:
              </label>
              <input
                type="password"
                value={editedPassword}
                onChange={(e) => setEditedPassword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ListarUsuarios;
