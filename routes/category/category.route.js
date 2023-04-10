const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//get all category
router.get("/", async (req, res, next) => {
  try {
    const category = await prisma.category.findMany({
      include: { products: true },
    });

    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
});

//post categpry
router.post("/", async (req, res, next) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
