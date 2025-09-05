import { ethers } from "ethers";
import User from "../models/User.js";

// SIGNUP: Create new user
export const signup = async (req, res) => {
  try {
    const { username, email, walletAddress } = req.body;

    if (!username || !email || !walletAddress) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if already exists
    let user = await User.findOne({ walletAddress });
    if (user) {
      return res.status(400).json({ error: "Wallet already registered" });
    }

    user = new User({ username, email, walletAddress });
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET: request nonce
export const getNonce = async (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: "Wallet address required" });

  let user = await User.findOne({ walletAddress: address });
  if (!user) return res.status(404).json({ error: "User not found. Please sign up." });

  // generate random nonce
  const nonce = "Login to Game: " + Math.floor(Math.random() * 1000000);
  user.nonce = nonce;
  await user.save();

  res.json({ nonce });
};

// POST: verify signature
export const verifyLogin = async (req, res) => {
  try {
    const { address, signature } = req.body;

    let user = await User.findOne({ walletAddress: address });
    if (!user) return res.status(404).json({ error: "User not found" });

    // verify signature
    const recovered = ethers.verifyMessage(user.nonce, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: "Signature verification failed" });
    }

    // update login time + reset nonce
    user.lastLogin = new Date();
    user.nonce = null; // optional security step
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
