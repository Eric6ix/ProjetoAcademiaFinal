import express from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


//login

router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body;

    //faz a busca no banco o email único
    const user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    //Faz a verificação se existe um usuário no banco
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" })
    }


    //Faz a comparação de senah com a senha qeue o usuário colocou
    const isMatch = await bcrypt.compare(userInfo.password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: " Senha Inválida" })
    }


    //Geração do Token JWC

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '20d' })


    res.status(200).json(token)
  } catch (err) {
    res.status(500).json({ messege: "Erro no servidaor, Tente novamente" });
  }
});







//Cadastro
router.post("/cadastro", async (req, res) => {
  //receber as variaveis
  const user = req.body;

  //realiza a contagem da quentidade de letras no nome  
  const VerirNamer = user.name
  const QtLetrasName = VerirNamer.length

  //realiza a contagem da quentidade de letras no Email com e sem o "@gmail.com"
  const Veriremail = user.email
  const QtLetrasEmail = Veriremail.length
  const LetrasSemEmail = Veriremail.replace('@gmail.com', '')
  const QtLetrasSemEmail = LetrasSemEmail.length

  //realiza a contagem da quentidade de letras na senha
  const VerirPassword = user.password
  const QtLetrasPassword = VerirPassword.length

  //if das const
  if (QtLetrasName > 3) {
    if (QtLetrasEmail >= 14 && QtLetrasEmail - 10 == QtLetrasSemEmail) {
      if (QtLetrasPassword >= 8) {

        try {

          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(user.password, salt);

          const userDB = await prisma.user.create({
            data: {

              name: user.name,
              email: user.email,
              password: hashPassword,
            },
          });
          res.status(201).json(userDB);
        } catch (err) {
          res.status(500).json({ messege: `Erro no servidaor, Tente novamente` });
        }
      } else { res.status(500).json({ messege: `Erro na senha, quantidades de caracteres insuficiente` }); }
    } else { res.status(500).json({ messege: `Erro, Email invalido` }); }
  } else { res.status(500).json({ messege: `Erro no nome, quantidades de caracteres insuficiente` }); }
});








// Editar Usuário



export default router;
