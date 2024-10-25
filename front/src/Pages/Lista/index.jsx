import { useEffect, useState } from "react";
import api from "../../services/api";


function ListarUsuarios() {
  const [allUses, setAllUsers] = useState();


  try {
    useEffect(() => {
      async function loadUsers() {
        const token = localStorage.getItem("token");
        const {
          data: { users },
        } = await api.get("/listar-usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(users);
      }

      loadUsers();
    }, []);
  } catch (err) {
    alert("Token inválido ou expirado");
    console.log(err);
  }

  return (
    <div>
      <h2>Lista Usuários</h2>
      <hr />
      <br />
      <ul>
        {allUses &&
          allUses.length > 0 &&
          allUses.map((user) => (
            <li key={user.id}>
              <p>{user.id}</p>
              <p>{user.name}</p>
              <p>{user.email}</p>
              <hr /> <br /><br /><br /><br />
            </li>
          ))}
          
      </ul>
    </div>
  );
}
export default ListarUsuarios;
