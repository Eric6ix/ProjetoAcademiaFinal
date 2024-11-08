import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator"; // Corrigido aqui
import express from "express";

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
      const User = await prisma.User.findUnique({
        where: { email },
      });

      // Verifica se o e-mail do funcionário  existe
      if (!User) {
        return res.status(404).json({ message: "Usuário não encontrado" });
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



router.get("/listausuario", async (req, res) => {
  try {
    const usuarios = await prisma.User.findMany();

    res.status(200).json({ message: "Usuário listado com sucesso", usuarios });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha no servidor" });
  }
});



router.post("/cadastrofuncionario", async (req, res) => {
  try {
    const User = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(User.password, salt);

    const funcionarioDB = await prisma.User.create({
      data: {
        role: User.role = "FUNCIONARIO",
        name: User.name,
        email: User.email,
        phone: User.phone,
        peso: User.peso,
        dataContra: User.dataContra,
        dataNasc: User.dataNasc,
        password: hashPassword,
      },
    });
    res.status(201).json({ messege: `Sucesso! ${User.email} Cadastrado` });

  } catch (err) {
    res
      .status(500)
      .json({ messege: `Erro no servidaor, Tente novamente ${err}` });
  }
});



// Rota para editar usuário
router.put("/editarusuarios/:email", async (req, res) => {
  try {
    await prisma.User.update({
      where: {
        email: req.params.email,
      },
      data: {
        name: req.body.name, // Atualiza o nome
        email: req.body.email, // Atualiza o nome
        password: req.body.hashPassword, // Atualiza a senha (hash)
      },
    });
    res.status(201).json(req.body);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Falha na Edição" });
  }
});

//deletar
router.delete("/funcionariodell/:email", async (req, res) => {
  try {
    await prisma.User.delete({
      where: {
        email: req.params.email,
      },
    });
    res.status(201).json({ message: "Usuário deletado com Sucesso!!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha ao Deletar" });
    err;
  }
});


router.delete("/Userdell/:email", async (req, res) => {
  try {
    await prisma.User.delete({
      where: {
        email: req.params.email,
      },
    });
    res.status(201).json({ message: "Usuário deletado com Sucesso!!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha ao Deletar" });
    err;
  }
});

//pesquisar com o body
router.post("/pesquisarUser/:email", async (req, res) => {
  try {
    const User = await prisma.User.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (User) {
      res
        .status(201)
        .json({ User, message: "Usuário encontrado com Sucesso!!!" });
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Falha ao pesquisar" });
  }
});



router.post("/pesquisar/:email", async (req, res) => {
  try {
    const User = await prisma.User.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (User) {
      res
        .status(201)
        .json({ User, message: "Usuário encontrado com Sucesso!!!" });
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Falha ao pesquisar" });
  }
});

export default router;
