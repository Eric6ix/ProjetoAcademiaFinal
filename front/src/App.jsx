import { BrowserRouter, Route, Routes } from "react-router-dom"
import CadastroFuncionario from "./Pages/Cadastro/cadastroProduto"
import Cadastro from "./Pages/Cadastro"
import CadastroProduto from "./Pages/Cadastro/cadastroProduto"
import Lista from "./Pages/Lista"
import Login from "./Pages/Login"
import Home from "./Pages/Home"
import LoginFncionario from "./Pages/LoginFuncionario"
import ListaProduto from "./Pages/EcommerceLista"
import ListaProdutoFncionario from "./Pages/EcommerceLista/listaFuncionarioProduto"

function App() {
  

  return (

     <BrowserRouter>
     <Routes>

    <Route path="/" element={<Home />} />
    <Route path="/cadastro" element={<Cadastro />} />
    <Route path="/CadastroProduto" element={<CadastroProduto />} />
    <Route path="/cadastroFuncionario" element={<CadastroFuncionario />} />
    <Route path="/login" element={<Login />} />
    <Route path="/loginFuncionario" element={<LoginFncionario />} />
    <Route path="/listar-usuarios" element={<Lista />} />
    <Route path="/lista-produto" element={<ListaProduto />} />
    <Route path="/lista-produto-funcionaro" element={<ListaProdutoFncionario />} />

     </Routes>
     </BrowserRouter>
    
  )
}

export default App
