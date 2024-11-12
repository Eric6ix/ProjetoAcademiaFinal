import { BrowserRouter, Route, Routes } from "react-router-dom"
import Cadastro from "./Pages/Cadastro"
import CadastroFuncionario from "./Pages/CadastroFuncionario"
import Lista from "./Pages/Lista"
import Login from "./Pages/Login"
import Home from "./Pages/Home"
import LoginFncionario from "./Pages/LoginFuncionario"

function App() {
  

  return (

     <BrowserRouter>
     <Routes>

    <Route path="/" element={<Home />} />
    <Route path="/cadastro" element={<Cadastro />} />
    <Route path="/cadastroFuncionario" element={<CadastroFuncionario />} />
    <Route path="/login" element={<Login />} />
    <Route path="/loginFuncionario" element={<LoginFncionario />} />
    <Route path="/listar-usuarios" element={<Lista />} />

     </Routes>
     </BrowserRouter>
    
  )
}

export default App
