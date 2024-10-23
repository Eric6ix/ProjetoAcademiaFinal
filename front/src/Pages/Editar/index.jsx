import React, { useState } from "react";
import api from "../../services/api"; // Importando o arquivo "api"

function EditarUsuarios() {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleUpdateUser = async () => {
    try {
      await api.put(`/usuarios/${userId}`, {
        name: name,
        hashPassword: password,
      });
      alert("Usuário atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar o usuário.");
      console.error("Erro:", error);
    }
  };

  return (
    <div>
      <h1>Atualizar Usuário</h1>
      <input
        type="text"
        placeholder="ID do Usuário"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleUpdateUser}>Atualizar</button>
    </div>
  );
}

export default EditarUsuarios;
