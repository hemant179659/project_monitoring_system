import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "UDHAM_SINGH_NAGAR_SECRET_KEY_2026";

export const verifyToken = (req, res, next) => {
  // Header se token uthao
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Token ka data request mein daal do
    next(); // Agle step par jao
  } catch (err) {
    res.status(403).json({ message: "Token is not valid" });
  }
};