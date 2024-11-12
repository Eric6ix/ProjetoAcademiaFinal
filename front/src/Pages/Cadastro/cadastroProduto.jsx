import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineMoneyCollect,
  AiOutlineEdit,
  AiOutlineArrowLeft,
} from "react-icons/ai"; // Importando ícones necessários
import api from "../../services/api";

function Cadastro() {
  const nameRef = useRef();
  const precoRef = useRef();
  const descricaoRef = useRef();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(""); // Para exibir erros

  async function handleSubmit(event) {
    event.preventDefault();

    // Limpar mensagens de erro anteriores
    setErrorMessage("");

    // Verificar se todos os campos foram preenchidos
    if (
      !nameRef.current.value ||
      !precoRef.current.value ||
      !descricaoRef.current.value
    ) {
      setErrorMessage("Todos os campos são obrigatórios.");
      return;
    }

    // Verificar se o preço é um número válido e maior que 0
    const preco = parseFloat(precoRef.current.value);
    if (isNaN(preco) || preco <= 0) {
      setErrorMessage("O preço deve ser um número positivo.");
      return;
    }

    // Preparando os dados para envio
    const productData = {
      name: nameRef.current.value,
      preco: preco,
      descricao: descricaoRef.current.value,
    };

    try {
      // Chamar a API para cadastro
      await api.post("/cadastroProduto", productData);

      alert("Produto cadastrado com sucesso!");
      navigate("/Lista-Produto");
    } catch (err) {
      setErrorMessage("Erro ao cadastrar este Produto! Tente novamente.");
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
          Cadastro de Produto
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
              placeholder="Nome do Produto"
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
            />
          </div>

          {/* Campo Preço */}
          <div className="relative">
            <AiOutlineMoneyCollect className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={precoRef}
              placeholder="Preço do Produto (R$)"
              type="number"
              step="0.1"
              min="0"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
            />
          </div>

          {/* Campo Descrição */}
          <div className="relative">
            <AiOutlineEdit className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <textarea
              ref={descricaoRef}
              placeholder="Descrição do Produto"
              rows="4"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
            />
          </div>

          {/* Botão Cadastrar-se */}
          <button className="w-full bg-green-500 text-gray-900 font-bold py-2 rounded-md hover:bg-green-400 transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
            Cadastrar Produto
          </button>
        </form>

        {/* Link para Lista de Produtos */}
        <Link
          to="/Lista-Produto"
          className="text-green-400 hover:underline mt-4 block text-center"
        >
          Ver Lista de Produtos
        </Link>
      </div>
    </div>
  );
}

export default Cadastro;
