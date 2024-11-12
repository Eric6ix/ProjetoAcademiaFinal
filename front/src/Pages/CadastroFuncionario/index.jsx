import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineArrowLeft,
  AiOutlinePhone,
  AiOutlineTrophy,
  AiOutlineCalendar,
} from "react-icons/ai"; // Importando ícones
import api from "../../services/api";

function Cadastro() {
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const pesoRef = useRef();
  const dataContraRef = useRef();
  const dataNascRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(""); // Para exibir erros

  // Função para validar o email
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Função para validar o formato da data de nascimento
  const validateDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    // Limpar mensagens de erro anteriores
    setErrorMessage("");

    // Verificar se todos os campos foram preenchidos
    if (
      !nameRef.current.value ||
      !emailRef.current.value ||
      !phoneRef.current.value ||
      !pesoRef.current.value ||
      !dataNascRef.current.value ||
      !dataContraRef.current.value ||
      !passwordRef.current.value
    ) {
      setErrorMessage("Todos os campos são obrigatórios.");
      return;
    }

    // Verificar se o email é válido
    if (!validateEmail(emailRef.current.value)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }

    // Verificar se a data de nascimento está no formato correto (YYYY-MM-DD)
    if (!validateDate(dataNascRef.current.value)) {
      setErrorMessage(
        "Por favor, insira uma data de nascimento válida (YYYY-MM-DD)."
      );
      return;
    }

    // Preparando os dados para envio
    const userData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      peso: parseFloat(pesoRef.current.value), // Garantir que o peso seja um número
      dataContra: new Date(dataContraRef.current.value).toISOString(), // Convertendo para ISO 8601
      dataNasc: new Date(dataNascRef.current.value).toISOString(), // Convertendo para ISO 8601
      password: passwordRef.current.value,
    };

    try {
      // Chamar a API para cadastro
      const token = localStorage.getItem("token");
      await api.post("/cadastroFuncionario", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Usuário cadastrado com sucesso!");
    } catch (err) {
      setErrorMessage("Erro ao cadastrar este usuário! Tente novamente.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {/* Container principal */}
      <div className="max-w-md w-full bg-gray-900 p-8 border border-zinc-700 rounded-lg shadow-lg">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-green-400 hover:underline"
        >
          <AiOutlineArrowLeft className="mr-2" /> Voltar
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-green-500">
          Cadastro Funcionário
        </h2>

        {/* Exibir mensagem de erro, se houver */}
        {errorMessage && (
          <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
        )}

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
              placeholder="Email Ex: (teste@gmail.com)"
              type="email"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
            />
          </div>

          {/* Campo Phone */}
          <div className="relative">
            <AiOutlinePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={phoneRef}
              placeholder="Telefone Ex: (+55 11 99000-0000)"
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
            />
          </div>

          {/* Campo Peso */}
          <div className="relative">
            <AiOutlineTrophy className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={pesoRef}
              placeholder="Peso (kg)"
              type="number"
              step="0.1"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
            />
          </div>

          {/* Campo Data de Nascimento */}
          <div className="relative">
            <AiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={dataContraRef}
              placeholder="Data de Contratação"
              type="date"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <AiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={dataNascRef}
              placeholder="Data de Nascimento"
              type="date"
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
