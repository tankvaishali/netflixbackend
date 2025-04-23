import express from "express"

const adminlogin=express.Router()


adminlogin.post("/adminlogin", (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@gmail.com" && password === "adminpanel1223") {
      res.status(200).json({ success: true, message: "Login successful!" });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }});
    export default adminlogin;