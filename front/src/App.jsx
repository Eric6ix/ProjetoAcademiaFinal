import { BrowserRouter, Route, Routes } from "react-router-dom"
import Cadastro from "./Pages/cadastro"
import Lista from "./Pages/Lista"
import Login from "./Pages/Login"
import Editar from "./Pages/Editar"

function App() {
  

  return (

     <BrowserRouter>
     <Routes>

    <Route path="/" element={<Cadastro />} />
    <Route path="/login" element={<Login />} />
    <Route path="/listar-usuarios" element={<Lista />} />
    <Route path="/listar-usuarios/editar" element={<Editar />} />

     </Routes>
     </BrowserRouter>
    
  )
}

export default App
