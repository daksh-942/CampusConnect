import { getUser } from "../service/auth.js";

export const restrictToLoggedInUserOnly = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please login." });
  }

  const user = getUser(token);
  if (!user) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Invalid token. Please login." });
  }

  req.user = user;
  next();
};
