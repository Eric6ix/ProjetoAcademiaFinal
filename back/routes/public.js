import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator"; // Corrigido aqui

const prisma = new PrismaClient();
const router = express.Router();

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

      // Busca no banco de dados pelo email
      const aluno = await prisma.aluno.findUnique({
        where: { email },
      });

      // Verifica se o usuário existe
      if (!aluno) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Comparação da senha
      const isMatch = await bcrypt.compare(password, aluno.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Senha inválida" });
      }

      res.status(200).json("ok");
    } catch (err) {
      console.error(err); // Log do erro
      res.status(500).json({ message: "Erro no servidor, tente novamente" });
    }
  }
);

//Cadastro
router.post("/cadastroaluno", async (req, res) => {
  try {
    const aluno = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(aluno.password, salt);

    const alunoDB = await prisma.aluno.create({
      data: {
        email: aluno.email,
        name: aluno.name,
        phone: aluno.phone,
        peso: aluno.peso,
        dataNasc: aluno.dataNasc,
        password: hashPassword,
      },
    });
    res.status(201).json(alunoDB);
  } catch (err) {
    res
      .status(500)
      .json({ messege: `Erro no servidaor, Tente novamente ${err}` });
    console.log(err);
  }
});

export default router;
