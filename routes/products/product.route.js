const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//get all products
router.get("/", async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
    });

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

//get product by id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const productById = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
    res.status(200).json(productById);
  } catch (error) {
    next(error);
  }
});

//post products
router.post("/", async (req, res, next) => {
  const { name, price, categoryId } = req.body;
  try {
    const products = await prisma.product.create({
      data: {
        name,
        categoryId,
        price,
      },
    });
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

//update products
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateProduct = await prisma.product.update({
      where: {
        id,
      },
      data: req.body,
      include: {
        category: true,
      },
    });
    res.status(200).json(updateProduct);
  } catch (error) {
    next(error);
  }
});

//delete products
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await prisma.product.delete({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
    res.status(200).json(deletedProduct);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
