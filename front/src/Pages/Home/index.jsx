import { useNavigate } from "react-router-dom";
import Img1 from "../../../PNG/kdkd.jpg";
import Img2 from "../../../PNG/nnxn.jpg";
import Img3 from "../../../PNG/foto3.jpg";

function Home() {
  const navigate = useNavigate();

  const handleNavigateCadastro = () => {
    navigate("/cadastro");
  };

  const handleNavigateFuncionarios = () => {
    navigate("/loginFuncionario");
  };

  const handleNavigatelListaCompra = () => {
    navigate("/Lista-Produto");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Cabeçalho */}
      <header className="w-full bg-gray-800 py-4 flex items-center justify-between px-8 shadow-lg">
        {/* Campo para a logo */}
        <div className="w-24 h-24 bg-gray-700 rounded-full flex justify-center items-center mr-8 transition-transform hover:scale-110">
          <span className="text-xl text-gray-400 font-bold">Logo</span>
        </div>

        {/* Botões de Navegação */}
        <div className="flex space-x-6">
          <button
            onClick={handleNavigateCadastro}
            className="bg-green-400 hover:bg-green-500 text-gray-900 font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <i className="bi bi-person-fill"></i>
            <span>Cadastrar</span>
          </button>
          <button
            onClick={handleNavigatelListaCompra}
            className="bg-blue-400 hover:bg-blue-500 text-gray-900 font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <i className="bi bi-cart-fill"></i>
            <span>Compras</span>
          </button>
          <button
            onClick={handleNavigateFuncionarios}
            className="bg-purple-400 hover:bg-purple-500 text-gray-900 font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <i className="bi bi-person-badge"></i>
            <span>Funcionários</span>
          </button>
        </div>
      </header>
{/* Seção principal */}
<main className="flex flex-col items-center mt-10">
        <h2 className="text-2xl font-semibold mb-6">Bem-vindo à AcademiaDEV</h2>
        <p className="mb-8 text-lg text-gray-300 text-center">
          Seu lugar para alcançar seus objetivos de fitness!
        </p>

        {/* Carrossel de fotos */}
        <div
          id="carouselExampleControlsNoTouching"
          className="carousel slide w-full max-w-3xl mx-auto mb-12"
          data-bs-touch="false"
          data-bs-interval="false"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={Img1} alt="Imagem 1" className="d-block w-100 object-cover rounded-lg" />
            </div>
            <div className="carousel-item">
              <img src={Img2} alt="Imagem 2" className="d-block w-100 object-cover rounded-lg" />
            </div>
            <div className="carousel-item">
              <img src={Img3} alt="Imagem 3" className="d-block w-100 object-cover rounded-lg" />
            </div>
          </div>

          {/* Controles do carrossel */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControlsNoTouching"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControlsNoTouching"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Próximo</span>
          </button>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="w-full bg-gray-800 py-4 mt-auto">
        <p className="text-center text-gray-400 text-sm">
          © 2024 AcademiaDEV - Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}

export default Home;
