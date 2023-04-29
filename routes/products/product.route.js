const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const upload = require("./multer");
const cloudinary = require("./cloudinary");

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
router.post("/", upload.array("productImage"), async (req, res, next) => {
  //cloudinary
  const uploader = async (path) =>
    await cloudinary.uplaods(path, "productImages");

  const urls = [];
  //for loot to get the actual path
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath);
  }

  const { name, price, categoryId } = req.body;

  try {
    const products = await prisma.product.create({
      data: {
        name,
        categoryId,
        price: Number(price),
        productImage: urls,
      },
    });
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

//update products
router.patch("/:id", upload.single("productImage"), async (req, res, next) => {
  const { id } = req.params;

  try {
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

//update ProductImage
router.patch(
  "/file/:id",
  upload.single("productImage"),
  async (req, res, next) => {
    const file = req.file;
    const { id } = req.params;

    try {
      const productUnique = await prisma.product.findUnique({
        where: {
          id,
        },
      });

      const oldPhoto = productUnique.productImage;

      if (oldPhoto) {
        fs.unlink(oldPhoto, (err) => {
          console.log(err);
        });
      }

      const updateImage = await prisma.product.update({
        where: {
          id,
        },
        data: {
          productImage: file.path,
        },
        include: {
          category: true,
        },
      });

      res.status(200).json(updateImage);
    } catch (error) {
      next(error);
    }
  }
);

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
