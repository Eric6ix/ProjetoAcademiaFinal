import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaSignOutAlt, FaArrowLeft, FaUserPlus } from "react-icons/fa"; // Importando ícones do React Icons
import api from "../../services/api";

function EcommerceLista() {
  const [allProduct, setAllProduct] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ProductName, setProductName] = useState("");
  const [ProductPreco, setProductPreco] = useState("");
  const [ProductDescricao, setProductDescricao] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadProducts() {
      try {
        const token = localStorage.getItem("token");
        const { data: { message } } = await api.get("/listar-produto", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllProduct(message); // Corrigindo o nome da função para 'setAllProduct'
      } catch (err) {
        alert("Você não tem uma conta ainda, Porfavor cadastre-se na tela inicial!");
        console.log(err);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = allProduct.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };



  const handleCadastroProduto = () => {
    navigate("/CadastroProduto");
    window.location.reload();
  };

  function handleEdit(product) {
    setSelectedProduct(product);
    setProductName(product.name);
    setProductPreco(product.preco);
    setProductDescricao(product.descricao);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setProductName("");
    setProductPreco("");
    setProductDescricao("");
  }

  async function EditarProduct(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (!ProductName) {
        alert("Nome do produto não pode estar vazio");
        return;
      }
      if (!ProductPreco || isNaN(ProductPreco)) {
        alert("Preço inválido");
        return;
      }
      if (!ProductDescricao) {
        alert("Descrição não pode estar vazia");
        return;
      }

      await api.put(
        `/editarusproduto/${selectedProduct.name}`, // Corrigido para o ID do produto
        {
          name: ProductName,
          preco: ProductPreco,
          descricao: ProductDescricao,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Produto atualizado com sucesso!");

      const updatedProduct = allProduct.map((product) =>
        product.id === selectedProduct.id
          ? { ...product, name: ProductName, preco: ProductPreco, descricao: ProductDescricao }
          : product
      );
      setAllProduct(updatedProduct);
      closeModal();

    } catch (err) {
      alert("Erro ao atualizar Produto");
      console.log(err);
    }
  }

  async function DeletarProduct(product) {
    const token = localStorage.getItem("token");
    if (!product) {
      alert("Nenhum produto selecionado para exclusão.");
      return;
    }
    try {
      await api.delete(`/produtodell/${product.name}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllProduct(prevProducts => prevProducts.filter(p => p.id !== product.id));

      alert("Produto deletado com sucesso!");
    } catch (err) {
      alert("Erro ao deletar Produto");
      console.log(err);
    }
  }

  return (
    <div className="p-6 bg-gray-800 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-green-400">Lista de Produtos</h2>

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

          
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar produto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-3 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <ul className="space-y-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <li key={product.id} className="bg-gray-700 p-6 rounded-lg shadow-lg flex justify-between items-center">
              <div className="space-y-2">
                <p><strong>ID:</strong> {product.id}</p>
                <p><strong>Nome:</strong> {product.name}</p>
                <p><strong>Preço:</strong> R${product.preco}</p>
                <p><strong>Descrição:</strong> {product.descricao}</p>
              </div>
    
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhum produto encontrado.</p>
        )}
      </ul>

      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-2xl font-semibold text-gray-200 mb-4">Editar Produto</h3>
            <form onSubmit={EditarProduct}>
              <input
                type="text"
                value={ProductName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Nome do Produto"
                className="w-full mb-3 p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                value={ProductPreco}
                onChange={(e) => setProductPreco(e.target.value)}
                placeholder="Preço"
                className="w-full mb-3 p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                value={ProductDescricao}
                onChange={(e) => setProductDescricao(e.target.value)}
                placeholder="Descrição"
                className="w-full mb-3 p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>

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

export default EcommerceLista;
