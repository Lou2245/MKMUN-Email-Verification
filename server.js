import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

module.exports = app;

let otps = {};

app.post("/send-otp", async (req, res) => {
  const { name, email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = otp;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Hi ${name}, your OTP code is ${otp}.`,
    });
    res.status(200).send("OTP sent");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending OTP");
  }
});

app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otps[email] === otp) {
    delete otps[email];
    res.status(200).send("Verified");
  } else {
    res.status(400).send("Invalid OTP");
  }
});

//app.listen(3000, () => console.log("Server running on port 3000"));
