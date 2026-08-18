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
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600"
      },
      {
        name: "Cricket Bat",
        price: 899,
        image: "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=600"
      },
      {
        name: "Running Shoes",
        price: 1999,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
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
