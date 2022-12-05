import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import styles from "./AddPassword.module.scss";

const AddPassword = (props) => {
  const authCtx = useContext(AuthContext);
  const { request, loading, error } = useHttp();
  const [form, setForm] = useState({
    title: "",
    login: "",
    password: "",
  });
  const [message, setMessage] = useState();

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const addPasswordHandler = async () => {
    if (
      form.title.trim().length === 0 ||
      form.login.trim().length === 0 ||
      form.password.trim().length === 0
    ) {
      setMessage("Fields must not be empty");
      return;
    }

    try {
      await request(
        "/api/passwords/add",
        "POST",
        { ...form },
        {
          Authorization: `Bearer ${authCtx.token}`,
        }
      );
      setForm({ title: "", login: "", password: "" });
      setMessage(null);
      props.fetchPasswords();
    } catch (e) {}
  };

  useEffect(() => {
    if (error) {
      setMessage(error.message);
    }
  }, [error, setMessage]);

  const generatePasswordHandler = async () => {
    try {
      const generatedPassword = await request(
        "/api/passwords/generate",
        "POST",
        null,
        {
          Authorization: `Bearer ${authCtx.token}`,
        }
      );
      setForm({ ...form, password: generatedPassword.generatedPassword });
    } catch (e) {}
  };

  return (
    <div className={styles.PasswordForm}>
      <h2 className={styles.NewPassword}>New Password</h2>
      {message && <div className={styles.Message}>{message}</div>}

      <input
        id="title"
        className={styles.Input}
        placeholder="title"
        type="text"
        name="title"
        value={form.title}
        onChange={changeHandler}
      />

      <input
        id="login"
        className={styles.Input}
        placeholder="login"
        type="text"
        name="login"
        value={form.login}
        onChange={changeHandler}
      />

      <div className={styles.PasswordRow}>
        <input
          id="password"
          className={styles.Input}
          placeholder="password"
          type="text"
          name="password"
          value={loading ? "loading..." : form.password}
          onChange={changeHandler}
          style={{ width: "260px" }}
        />
        <span
          className="material-symbols-outlined"
          onClick={generatePasswordHandler}
        >
          autorenew
        </span>
      </div>

      <button
        className={styles.Button}
        disabled={loading}
        onClick={addPasswordHandler}
      >
        ADD
      </button>
    </div>
  );
};

export default AddPassword;
