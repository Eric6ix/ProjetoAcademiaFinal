import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlineArrowLeft } from "react-icons/ai";
import api from "../../services/api";

function Cadastro() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await api.post("/cadastro", {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      alert("Usuário cadastrado com sucesso!");
    } catch (err) {
      alert("Erro ao cadastrar este usuário!");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {/* Container principal */}
      <div className="max-w-md w-full bg-gray-900 p-8 border border-zinc-700 rounded-lg shadow-lg">
        {/* Botão Voltar */}
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-green-400 hover:underline">
          <AiOutlineArrowLeft className="mr-2" /> Voltar
        </button>
        
        <h2 className="text-3xl font-bold mb-6 text-center text-green-500">Cadastro</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nome */}
          <div className="relative">
            <AiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={nameRef}
              placeholder="Nome"
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
            />
          </div>

          {/* Campo Email */}
          <div className="relative">
            <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={emailRef}
              placeholder="Email"
              type="email"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
            />
          </div>

          {/* Campo Senha */}
          <div className="relative">
            <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={passwordRef}
              placeholder="Senha"
              type="password"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
            />
          </div>

          {/* Botão Cadastrar-se */}
          <button className="w-full bg-green-500 text-gray-900 font-bold py-2 rounded-md hover:bg-green-400 transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
            Cadastrar-se
          </button>
        </form>

        {/* Link para Login */}
        <Link
          to="/login"
          className="text-green-400 hover:underline mt-4 block text-center"
        >
          Já tem uma conta? Faça Login
        </Link>
      </div>
    </div>
  );
}

export default Cadastro;
