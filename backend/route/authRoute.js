import express from "express";
import {signup, getNonce, verifyLogin } from "../controllers/authController.js";

const authrouter = express.Router();

authrouter.post("/signup", signup);
authrouter.get("/nonce", getNonce);
authrouter.post("/login", verifyLogin);

export default authrouter;
