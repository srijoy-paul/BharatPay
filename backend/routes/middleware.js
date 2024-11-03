const authMiddleware = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Unauthorized" })
        }

        const token = authorization.split(" ")[1];

        await jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Unauthorized" })
            }
            req.user = decoded.userId;
            next();
        })
    } catch (error) {
        return res.json(403).json({})
    }

}