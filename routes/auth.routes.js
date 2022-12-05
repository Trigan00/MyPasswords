const Router = require("express");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const { body, validationResult } = require("express-validator");
const { pool } = require("../poolConfig");
const mailService = require("../mailService");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const router = new Router();

// /api/auth/register
router.post(
  "/register",
  [
    body("email", "Uncorrected email").isEmail(),
    body("password", "The minimum password length is 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "failure",
          errors: errors.array(),
          message: "Incorrect data during registration",
        });
      }

      const { email, password } = req.body;
      const condidate = await pool.query(
        "SELECT * FROM person WHERE email = $1",
        [email]
      );
      if (condidate.rows[0]) {
        return res
          .status(400)
          .json({ status: "failure", message: "User already exists" });
      }

      const activationLink = uuid.v4();
      const secret2fa = speakeasy.generateSecret({
        name: "MyPasswords",
        length: 20,
      });

      bcrypt.hash(password, 12).then(function (hashedPassword) {
        //bcrypt.hash(myPlaintextPassword, saltRounds)
        pool.query(
          "INSERT INTO person (email, password, activationLink, secret2fa) VALUES ($1, $2, $3, $4)",
          [email, hashedPassword, activationLink, secret2fa.base32],
          (error) => {
            if (error) {
              throw error;
            }
          }
        );
      });

      QRCode.toDataURL(secret2fa.otpauth_url, function (err, image_data) {
        if (err)
          return res
            .status(500)
            .json({ message: "Error generating secret key" });
        res.status(201).json({
          status: "success",
          message: "User added. Confirm your email address",
          qr: image_data, // A data URI for the QR code image
        });
      });

      mailService(
        email,
        `${process.env.API_URL}/api/auth/activate/${activationLink}`
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failure",
        message: "Something went wrong, try again",
      });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [
    body("email", "Uncorrected email").isEmail(),
    body("password", "The minimum password length is 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "failure",
          errors: errors.array(),
          message: "Incorrect data during authentication",
        });
      }

      const { email, password, code } = req.body;
      const user = await pool.query("SELECT * FROM person WHERE email = $1", [
        email,
      ]);
      if (!user.rows[0]) {
        return res.status(400).json({
          status: "failure",
          message: "Invalid login or password, try again", //login
        });
      }

      if (!user.rows[0].isactivated) {
        return res.status(400).json({
          status: "failure",
          message: "User is not activated",
        });
      }

      const isMatch = await bcrypt.compare(password, user.rows[0].password);
      if (!isMatch) {
        return res.status(400).json({
          status: "failure",
          message: "Invalid login or password, try again", //password
        });
      }

      const twoFAtoken = speakeasy.totp({
        secret: user.rows[0].secret2fa,
        encoding: "base32",
      });

      if (code != twoFAtoken) {
        return res.status(400).json({
          status: "failure",
          message: "Invalid code, try again",
        });
      }

      const tokenValidates = speakeasy.totp.verify({
        secret: user.rows[0].secret2fa,
        encoding: "base32",
        token: code,
        window: 6,
      });

      if (!tokenValidates) {
        return res.status(400).json({
          status: "failure",
          message: "Token is invalid",
        });
      }

      const token = jwt.sign(
        { userId: user.rows[0].id },
        process.env.jwtSecret,
        { expiresIn: "1h" }
      );
      res.json({ token, userEmail: user.rows[0].email });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failure",
        message: "Something went wrong, try again",
      });
    }
  }
);

router.get("/activate/:link", async (req, res) => {
  try {
    const activationLink = req.params.link;
    const user = await pool.query(
      "SELECT * FROM person WHERE activationlink = $1",
      [activationLink]
    );
    if (!user.rows[0]) {
      return res
        .status(400)
        .json({ status: "failure", message: "Invalid activation link" });
    }

    pool.query(
      "UPDATE person SET isactivated=true WHERE id = $1",
      [user.rows[0].id],
      (error) => {
        if (error) {
          throw error;
        }
      }
    );
    return res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failure",
      message: "Something went wrong, try again",
    });
  }
});

router.get("/users", async function getUsers(req, res) {
  pool.query("SELECT * FROM person", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

module.exports = router;
