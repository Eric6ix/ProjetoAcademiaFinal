import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator"; // Corrigido aqui
import jwt from "jsonwebtoken"


const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Senha é obrigatória"),
  ],
  async (req, res) => {
    // Verifica erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Tenta buscar o usuário na tabela User
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Verifica se o usuário existe
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Verifica se o role do usuário é válido
      const validRoles = ['ALUNO', 'FUNCIONARIO', 'ADMIN'];
      if (!validRoles.includes(user.role)) {
        return res.status(400).json({ message: "Role inválido para este usuário" });
      }

      // Comparação da senha
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Senha inválida" });
      }

      // Geração do token JWT
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "20d" });

      // Retorna o tipo de usuário (role) e id na resposta
      res.status(200).json({
        message: "Login bem-sucedido",
        message: `Token:    ${token}`,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,  // Inclui o role no retorno
        },
      });
    } catch (err) {
      console.error(err); // Log do erro
      res.status(500).json({ message: "Erro no servidor, tente novamente" });
    }
  }
);





//Cadastro
router.post("/cadastro", async (req, res) => {
  try {
    const User = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(User.password, salt);

    const UserDB = await prisma.User.create({
      data: {
        role:User.role = "ALUNO",
        name: User.name,
        email: User.email,
        phone: User.phone,
        peso: User.peso,
        dataNasc: User.dataNasc,
        password: hashPassword,
      },
    });
    res.status(201).json(UserDB);
  } catch (err) {
    res
      .status(500)
      .json({ messege: `Erro no servidaor, Tente novamente ${err}` });
    console.log(err);
  }
});

export default router;
