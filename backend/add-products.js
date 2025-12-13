import mongoose from "mongoose";
import Product from "./models/Product.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/sporty")
  .then(async () => {
    console.log("MongoDB Connected");

    await Product.deleteMany(); 

    const products = [
      {
        name: "Football",
        price: 599,
        image: "http://localhost:5000/uploads/football.jpg"
      },
      {
        name: "Cricket Bat",
        price: 899,
        image: "http://localhost:5000/uploads/cricket-bat.jpg"
      },
      {
        name: "Running Shoes",
        price: 1999,
        image: "http://localhost:5000/uploads/running-shoes.avif"
      },
      {
        name: "Sports Jersey",
        price: 499,
        image: "http://localhost:5000/uploads/sports-jersey.png"
      },
      {
        name: "Basketball",
        price: 699,
        image: "http://localhost:5000/uploads/basketball.png"
      },
      {
        name: "Badminton Racket",
        price: 999,
        image: "http://localhost:5000/uploads/racket.webp"
      },
      {
        name: "Gym Gloves",
        price: 349,
        image: "http://localhost:5000/uploads/gym-gloves.jpg"
      },
      {
        name: "Skipping Rope",
        price: 249,
        image: "http://localhost:5000/uploads/rope.webp"
      },
      {
        name: "Yoga Mat",
        price: 799,
        image: "http://localhost:5000/uploads/yoga-mat.jpeg"
      },
      {
        name: "Knee Guard",
        price: 399,
        image: "http://localhost:5000/uploads/knee-guard.jpg"
      },
      {
        name: "Tennis Ball Pack",
        price: 299,
        image: "http://localhost:5000/uploads/tennis-ball-pack.webp"
      },
      {
        name: "Boxing Gloves",
        price: 1299,
        image: "http://localhost:5000/uploads/boxing-gloves.jpg"
      },
      {
        name: "Water Bottle",
        price: 199,
        image: "http://localhost:5000/uploads/water-bottle.jpg"
      },
      {
        name: "Sports Cap",
        price: 249,
        image: "http://localhost:5000/uploads/sports-cap.jpg"
      },
      {
        name: "Gym Shorts",
        price: 599,
        image: "http://localhost:5000/uploads/gym-shorts.jpg"
      }
    ];

    await Product.insertMany(products);

    console.log("✅ All products inserted successfully");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Error inserting products:", err);
    process.exit(1);
  });
