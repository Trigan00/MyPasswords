const Router = require("express");
const { passwordStrength } = require("check-password-strength");
const { options } = require("../passwordStrengthOptions");
const { pool } = require("../poolConfig");
const auth = require("../middleware/auth.middleware");
const { encrypt, decrypt } = require("../encryption");
const { passwordGenerator } = require("../passwordGenerator");
const router = new Router();

router.post("/add", auth, async (req, res) => {
  const { title, login, password } = req.body;

  try {
    const condidate = await pool.query(
      "SELECT * FROM password WHERE title = $1 AND user_id = $2",
      [title, req.user.userId]
    );

    if (condidate.rows[0]) {
      return res
        .status(400)
        .json({ status: "failure", message: "Password already exists" });
    }

    const pwStrength = passwordStrength(password, options).id;
    const encryptedPassword = encrypt(password);

    pool.query(
      "INSERT INTO password (title, login, password, iv, user_id) VALUES ($1, $2, $3, $4, $5)",
      [
        title,
        login,
        pwStrength + encryptedPassword.password,
        encryptedPassword.iv,
        req.user.userId,
      ],
      (error) => {
        if (error) {
          throw error;
        }
      }
    );

    return res
      .status(201)
      .json({ status: "success", message: "password added." });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Something went wrong, try again",
    });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const titles = await pool.query(
      "SELECT title, password, id FROM password WHERE user_id = $1",
      [req.user.userId]
    );
    const arr = titles.rows.map((obj) => {
      return {
        id: obj.id,
        title: obj.title,
        passwordstrength: obj.password[0],
      };
    });
    res.json(arr);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Something went wrong, try again",
    });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const password = await pool.query("SELECT * FROM password WHERE id = $1", [
      req.params.id,
    ]);

    const decryptedPassword = decrypt({
      password: password.rows[0].password.substring(1),
      iv: password.rows[0].iv,
    });
    res.json({
      ...password.rows[0],
      password: decryptedPassword,
    });
  } catch (e) {
    res.status(500).json({
      status: "failure",
      message: "Something went wrong, try again",
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await pool.query("DELETE FROM password WHERE id = $1", [req.params.id]);
    res.status(201).json({ status: "success", message: "password deleted." });
  } catch (e) {
    res.status(500).json({
      status: "failure",
      message: "Something went wrong, try again",
    });
  }
});

router.put("/update", auth, async (req, res) => {
  const { title, login, password, id } = req.body;

  try {
    // const condidate = await pool.query(
    //   "SELECT * FROM password WHERE title = $1 AND user_id = $2",
    //   [title, req.user.userId]
    // );

    // if (condidate.rows[0]) {
    //   return res
    //     .status(400)
    //     .json({ status: "failure", message: "Password already exists" });
    // }

    const pwStrength = passwordStrength(password, options).id;
    const encryptedPassword = encrypt(password);

    pool.query(
      "UPDATE password set title = $1, login = $2, password = $3, iv = $4, user_id = $5 WHERE id = $6",
      [
        title,
        login,
        pwStrength + encryptedPassword.password,
        encryptedPassword.iv,
        req.user.userId,
        id,
      ],
      (error) => {
        if (error) {
          throw error;
        }
      }
    );
    return res
      .status(201)
      .json({ status: "success", message: "password updated." });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Something went wrong, try again",
    });
  }
});

router.post("/generate", auth, async (req, res) => {
  try {
    const generatedPassword = passwordGenerator();
    res.json({ generatedPassword });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Something went wrong, try again",
    });
  }
});

module.exports = router;
