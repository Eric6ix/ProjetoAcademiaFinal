import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api"

function Login() {
  
  const emailRef = useRef()
  const passwordRef = useRef()
  const Navigate = useNavigate()

  async function handleSubmit(event){
    event.preventDefault()

    try{

    const { data:token } = await api.post("/login",{
     
      email: emailRef.current.value,
      password: passwordRef.current.value
    })

    localStorage.setItem("token", token)
    console.log("ok")
    Navigate('/listar-usuarios')
    
  }catch(err){ 

    alert("Senha ou E-mail inválido");
    alert(err)
    

  }
    /*
    console.log(emailRef.current.value)
    console.log(passwordRef.current.value)*/
  }

  return (



    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-zinc-300 rounded-lg shadow-lg">

      <h2 className="text-2x1 font-bold mb-6 text-center text-gray-800">Login</h2>

      <form onSubmit={handleSubmit}>

        <input ref={emailRef} placeholder="Email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"/>
        <input ref={passwordRef} placeholder="Senha" type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"/>  

        <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-400">Logar</button>
      </form>

      <Link to="/" className="text-blue-700 hover:underline mt-4 block text-center">Não tem uma conta? Faça o Cadastro</Link>

    </div>
  );
}
export default Login;