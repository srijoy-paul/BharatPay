const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken")

const { User } = require("../db");
const { JWT_SECRET } = require("../config");

const validateSignupData = zod.object({
    username: zod.string().email(),
    firstName: zod.string().min(3),
    lastName: zod.string().min(3),
    password: zod.string().min(6)
});
const validateSigninData = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6)
});

router.post("/signup", async (req, res) => {
    console.log(req.body);

    const inputValidationResult = validateSignupData.safeParse(req.body);
    if (!inputValidationResult.success) {
        return res.status(411).json({ message: "Incorrect inputs" });
    }

    const { username, firstName, lastName, password } = req.body;

    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
        //409 status code for some conflicts
        return res.status(409).json({ message: "Email already taken" });
    }

    //stored hased password
    const newUser = await User.create({
        username,
        firstName,
        lastName,
        password
    })

    const userId = newUser._id;

    const token = jwt.sign({ userId }, JWT_SECRET);

    console.log("Signup successful");

    return res.status(200).json({
        message: "User created successfully",
        token
    })
})

router.post("/signin", async (req, res) => {
    try {
        const inputValidationResult = validateSigninData.safeParse(req.body);
        if (!inputValidationResult.success) {
            return res.status(411).json({ message: "Incorrect inputs" });
        }
        const { username, password } = req.body;

        //hashed password match
        const userExists = await User.findOne({ username: username, password: password });

        if (!userExists) {
            return res.status(411).json({ message: "Email not found/password incorrect" });
        }

        const token = jwt.sign({ userId: userExists._id }, JWT_SECRET)
        return res.status(200).json({
            message: "Signin successful",
            token
        })
    } catch (e) {
        console.log("Error while logging in", e);
    }
})
module.exports = router;