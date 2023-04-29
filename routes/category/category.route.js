const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const upload = require("../products/multer");
const cloudinary = require("..products/cloudinary");

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
router.post("/", upload.single("categoryImage"), async (req, res, next) => {
  const { name } = req.body;
  //cloudinary
  const uploader = async (path) =>
    await cloudinary.uplaods(path, "categoryImage");

  const categoryImage = [];

  //for loot to get the actual path
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    categoryImage.push(newPath);
  }
  try {
    const category = await prisma.category.create({
      data: {
        name,
        categoryImage,
      },
    });
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
