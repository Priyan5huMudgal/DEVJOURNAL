import jwt from "jsonwebtoken";
function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No authorization token provided.",
      error: "UNAUTHORIZED"
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "super-secret-jwt-key";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again.",
      error: "INVALID_TOKEN"
    });
  }
}
export {
  protect
};
