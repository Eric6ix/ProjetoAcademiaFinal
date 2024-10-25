import { BrowserRouter, Route, Routes } from "react-router-dom"
import Cadastro from "./Pages/cadastro"
import Lista from "./Pages/Lista"
import Login from "./Pages/Login"
import Home from "./Pages/Home"



function App() {
  

  return (

     <BrowserRouter>
     <Routes>

    <Route path="/" element={<Home />} />
    <Route path="/cadastro" element={<Cadastro />} />
    <Route path="/login" element={<Login />} />
    <Route path="/listar-usuarios" element={<Lista />} />

     </Routes>
     </BrowserRouter>
    
  )
}

export default App
