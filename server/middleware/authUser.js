import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtKey = process.env.JWT_KEY;

const fetchUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, jwtKey);
    req.user = data;

    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

export default fetchUser;
