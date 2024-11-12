import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator"; // Corrigido aqui
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

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

      // Comparação da senha
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Senha inválida" });
      }

      // Geração do token JWT com o jsonwebtoken
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "20d" });

      // Enviar o token em um objeto JSON
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({
        message: "Erro no servidor, tente novamente",
        error: err.message,  // Detalhes do erro, caso necessário
      });
    }
  }
);


// Login Funcionários
router.post(
  "/loginfuncionario",
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

      // Busca no banco de dados pelo email
      const User = await prisma.User.findUnique({
        where: { email },
      });

      // Verifica se o e-mail do funcionário existe
      if (!User) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Verifica se o usuário tem o papel de "FUNCIONARIO"
      if (User.role !== "FUNCIONARIO") {
        return res.status(403).json({ message: "Acesso restrito a funcionários" });
      }

      // Comparação da senha
      const isMatch = await bcrypt.compare(password, User.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Senha inválida" });
      }

      // Geração do token JWT
      const token = jwt.sign({ id: User.id }, JWT_SECRET, {
        expiresIn: "20d",
      });

      res.status(200).json({ token });
    } catch (err) {
      console.error(err); // Log do erro
      res.status(500).json({ message: "Erro no servidor, tente novamente" });
    }
  }
);


router.post("/cadastro", async (req, res) => {
  try {
    const { name, email, phone, peso, dataNasc, password } = req.body;

    // Verificar se todos os campos obrigatórios estão presentes
    if (!name || !email || !phone || !peso || !dataNasc || !password) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    // Validar o formato do email
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Email inválido." });
    }

    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Este email já está em uso." });
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Criar o novo usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        role: "ALUNO", // Definir o role como "ALUNO"
        name,
        email,
        phone,
        peso: parseFloat(peso), // Certificar-se de que o peso é um número
        dataNasc: new Date(dataNasc), // Converter a data de nascimento para o formato Date
        password: hashPassword,
      },
    });

    res.status(201).json({ message: "Usuário cadastrado com sucesso!", user });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: `Erro no servidor. Tente novamente mais tarde.` });
  }
});

export default router;
