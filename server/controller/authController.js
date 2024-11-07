import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY;
const jwtKey = process.env.JWT_KEY;

export const signup = async (req, res) => {

  try {
    const { username, email, password } = req.body;

    // Encrypt password
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      secretKey
    ).toString();

    // Create new user
    const user = new User({
      username,
      email,
      password: encryptedPassword,
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.username },
      jwtKey,
      {
        expiresIn: "2d",
      }
    );

    // Send response with token
    res.status(200).json({ success: true, email: user.email, token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to sign up. Please try again later.",
    });
  }
};

export const login = async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // Decrypt stored password
      const bytes = CryptoJS.AES.decrypt(user.password, secretKey);
      const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

      // Check credentials
      if (req.body.password === decryptedPassword) {
        // Generate JWT token
        const token = jwt.sign(
          { _id: user._id, email: user.email, name: user.username },
          jwtKey,
          { expiresIn: "2d" }
        );

        // Send response with token
        res.status(200).json({ success: true, email: user.email, token });
      } else {
        res.status(400).json({ success: false, error: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ success: false, error: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

export const getAllusers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users); // Send the list of users as the response
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve users", error });
  }
};

export const fetchName = async (req, res) => {
  const { userId } = req.body; // Get userId from the body
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Respond with user data
    res.json({ name: user.username, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
