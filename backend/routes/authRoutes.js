import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPw = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPw });
  res.json({ message: "User Registered Successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ error: "User not found" });

  const checkPw = await bcrypt.compare(password, user.password);
  if (!checkPw) return res.json({ error: "Wrong Password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ message: "Login Success", token });
});

export default router;
