import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/cadastroProduto", async (req, res) => {
  try {
    const { name, preco, descricao } = req.body;

    // Verificar se todos os campos obrigatórios estão presentes
    if (!name || !preco || !descricao) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }



    // Verificar se o nome já está em uso
    const existingProduct = await prisma.produto.findUnique({ where: { name } });
    if (existingProduct) {
      return res.status(400).json({ message: "Este nome já está em uso." });
    }

    // Criar um novo produto no banco de dados usando Prisma
    const produto = await prisma.produto.create({
      data: {
        name,
        preco,
        descricao,
      },
    });

    res.status(201).json({ message: "Produto cadastrado com sucesso!", produto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor. Tente novamente mais tarde." });
  }
});


export default router;
