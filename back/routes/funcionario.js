import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator"; // Corrigido aqui

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

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
      const funcionario = await prisma.funcionario.findUnique({
        where: { email },
      });

      // Verifica se o e-mail do funcionário  existe
      if (!funcionario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Comparação da senha
      const isMatch = await bcrypt.compare(password, funcionario.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Senha inválida" });
      }

      // Geração do token JWT
      const token = jwt.sign({ id: funcionario.id }, JWT_SECRET, { expiresIn: "20d" });

      res.status(200).json({ token });
    } catch (err) {
      console.error(err); // Log do erro
      res.status(500).json({ message: "Erro no servidor, tente novamente" });
    }
  }
);

//Cadastro
router.post("/cadastrofuncionario", async (req, res) => {
  try {
    const funcionario = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(funcionario.password, salt);

    const funcionarioDB = await prisma.funcionario.create({
      data: {
        email: funcionario.email,
        name: funcionario.name,
        fone: funcionario.fone,
        dataNasc: funcionario.dataNasc,
        dataContra: funcionario.dataContra,
        password: hashPassword,
        address: funcionario.address
      },
    });
    res.status(201).json(funcionarioDB);
  } catch (err) {
    res
      .status(500)
      .json({ messege: `Erro no servidaor, Tente novamente ${err}` });
      console.log(err)
  }
});

// Editar Usuário

export default router;
