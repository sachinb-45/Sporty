const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://localhost:27017/sporty")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const products = [
  { name: "Football", price: 599, image: football.jpg },
  { name: "Cricket Bat", price: 899, image: "images/cricket-bat.jpg" },
  { name: "Running Shoes", price: 1999, image: "images/running-shoes.jpg" },
  { name: "Sports Jersey", price: 499, image: "images/jersey.jpg" },
  { name: "Basketball", price: 699, image: "images/basketball.jpg" },
  { name: "Badminton Racket", price: 799, image: "images/badminton.jpg" },
  { name: "Gym Gloves", price: 299, image: "images/gym-gloves.jpg" },
  { name: "Skipping Rope", price: 199, image: "images/rope.jpg" },
  { name: "Yoga Mat", price: 450, image: "images/yoga-mat.jpg" },
  { name: "Knee Guard", price: 349, image: "images/knee-guard.jpg" },
  { name: "Tennis Ball Pack", price: 250, image: "images/tennis-ball.jpg" },
  { name: "Boxing Gloves", price: 1199, image: "images/boxing-gloves.jpg" },
  { name: "Water Bottle", price: 299, image: "images/bottle.jpg" },
  { name: "Sports Cap", price: 199, image: "images/cap.jpg" },
  { name: "Gym Shorts", price: 399, image: "images/gym-shorts.jpg" }
];

async function insertProducts() {
  await Product.deleteMany(); // Clears old products WITHOUT images
  await Product.insertMany(products);
  console.log("Products inserted with images!");
  process.exit();
}

insertProducts();
