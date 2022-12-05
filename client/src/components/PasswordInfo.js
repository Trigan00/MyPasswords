import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import copy from "copy-to-clipboard";
import Loader from "../UI/Loader";
import styles from "./PasswordInfo.module.scss";

const PasswordInfo = ({
  isLoading,
  error,
  data,
  hidePassword,
  savePasswordHandler,
}) => {
  const authCtx = useContext(AuthContext);
  const { request, loading } = useHttp();
  const [paswordData, setPaswordData] = useState({
    title: "",
    login: "",
    password: "",
  });

  const [isCopied, setIsCopied] = useState({
    title: false,
    login: false,
    password: false,
  });

  useEffect(() => {
    if (!isLoading) setPaswordData({ ...data });
  }, [isLoading, data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCopied(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [isCopied]);

  const changeHandler = (event) => {
    setPaswordData({ ...paswordData, [event.target.name]: event.target.value });
  };

  const copyToClipboard = (event) => {
    copy(paswordData[event.target.name]);
    setIsCopied({ [event.target.name]: true });
  };

  const saveHandler = () => {
    for (const key in paswordData) {
      if (paswordData[key] === "") return;
    }
    savePasswordHandler(paswordData);
    hidePassword();
  };

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
      setPaswordData({
        ...paswordData,
        password: generatedPassword.generatedPassword,
      });
    } catch (e) {}
  };

  if (isLoading) {
    return (
      <div className={styles.BackGround} onClick={() => hidePassword()}>
        <div className={styles.Wrapper} onClick={(e) => e.stopPropagation()}>
          <Loader color={"grey"} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.BackGround} onClick={() => hidePassword()}>
      <div className={styles.Wrapper} onClick={(e) => e.stopPropagation()}>
        {error ? (
          <div className="Error">{error.message}</div>
        ) : (
          <>
            <h1 className="Title">{data.title}</h1>
            <div className={styles.Row}>
              <label htmlFor="title">
                {paswordData.title ? (
                  "Title"
                ) : (
                  <font color="red">Title must not be empty</font>
                )}
              </label>
              <div className={styles.Content}>
                <input
                  id="title"
                  name="title"
                  value={paswordData.title}
                  onChange={changeHandler}
                />
                <button
                  className="material-symbols-outlined"
                  style={{ color: "#d3d3d3" }}
                  name="title"
                  onClick={copyToClipboard}
                >
                  content_copy
                </button>
                {isCopied.title && (
                  <div className={styles.Copied}>Password copied</div>
                )}
              </div>
            </div>
            <div className={styles.Row}>
              <label htmlFor="login">
                {paswordData.login ? (
                  "Login"
                ) : (
                  <font color="red">Login must not be empty</font>
                )}
              </label>
              <div className={styles.Content}>
                <input
                  id="login"
                  name="login"
                  value={paswordData.login}
                  onChange={changeHandler}
                />
                <button
                  className="material-symbols-outlined"
                  style={{ color: "#d3d3d3" }}
                  name="login"
                  onClick={copyToClipboard}
                >
                  content_copy
                </button>
                {isCopied.login && (
                  <div className={styles.Copied}>Password copied</div>
                )}
              </div>
            </div>
            <div className={styles.Row}>
              <label htmlFor="password">
                {paswordData.password ? (
                  "Password"
                ) : (
                  <font color="red">Password must not be empty</font>
                )}
              </label>
              <div className={styles.Content}>
                <input
                  id="password"
                  name="password"
                  value={loading ? "loading..." : paswordData.password}
                  onChange={changeHandler}
                />
                <button
                  className="material-symbols-outlined"
                  style={{ color: "#d3d3d3" }}
                  name="password"
                  onClick={copyToClipboard}
                >
                  content_copy
                </button>
                {isCopied.password && (
                  <div className={styles.Copied}>Password copied</div>
                )}
              </div>
            </div>
            <span className={styles.Generate} onClick={generatePasswordHandler}>
              Generate password
            </span>
            <div className={styles.Buttons}>
              <button className={styles.Save} onClick={saveHandler}>
                Save
              </button>
              <button className={styles.Cancel} onClick={() => hidePassword()}>
                Cancel
              </button>
            </div>
          </>
        )}

        <div className={styles.Close} onClick={() => hidePassword()}>
          &#10006;
        </div>
      </div>
    </div>
  );
};

export default PasswordInfo;
