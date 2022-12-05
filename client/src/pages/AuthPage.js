import React, { useContext, useEffect, useState } from "react";
import Qr from "../components/Qr";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import Loader from "../UI/Loader";
import "./AuthPage.scss";

const AuthPage = () => {
  const authCtx = useContext(AuthContext);
  const { loading, error, request } = useHttp();
  const [form, setForm] = useState({
    email: "",
    password: "",
    code: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState();
  const [isSuccess, setIsSuccess] = useState("");
  const [errorHelperMsg, setErrorHelperMsg] = useState({
    email: "",
    password: "",
    code: "",
    confirmPassword: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const [qrURL, setQrURL] = useState();

  useEffect(() => {
    if (error) {
      setMessage(error.message);
      error.errors &&
        error.errors.forEach((err) => {
          setErrorHelperMsg((prev) => {
            return { ...prev, [err.param]: err.msg };
          });
        });
    }
  }, [error, setMessage]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async (event) => {
    setIsSuccess("");
    setErrorHelperMsg({});
    event.preventDefault();

    try {
      if (form.password === form.confirmPassword) {
        const data = await request("/api/auth/register", "POST", { ...form });
        if (data) setIsSuccess(data.status);
        setMessage(data.message);
        setQrURL(data.qr);
        return;
      }
      setErrorHelperMsg({
        confirmPassword: "Passwords don't match",
      });
    } catch (e) {}
  };

  const loginHandler = async () => {
    setIsSuccess("");
    setErrorHelperMsg({});
    try {
      const data = await request("/api/auth/login", "POST", { ...form });
      if (data) setIsSuccess(data.status);
      setMessage(data.message);
      authCtx.login(data.token, data.userEmail);
    } catch (e) {}
  };

  const switchPageHandler = () => {
    setMessage(null);
    setErrorHelperMsg({});
    setIsRegister((prev) => !prev);
  };

  return (
    <div className="main">
      <form className="login-form">
        {message && (
          <div className={`flex-row alert--error ${isSuccess}`}>
            <label className="lf--label" htmlFor="error">
              {isSuccess ? (
                <span className="material-symbols-outlined success">done</span>
              ) : (
                <span className="material-symbols-outlined">error</span>
              )}
            </label>
            <p id="error" className="error--message">
              {message}
            </p>
          </div>
        )}

        {errorHelperMsg.email && (
          <div className="error--helper">
            <span className="material-symbols-outlined">warning</span>
            <span className="error--helper--message">
              {errorHelperMsg.email}
            </span>
          </div>
        )}
        <div className="flex-row">
          <label className="lf--label" htmlFor="username">
            <svg x="0px" y="0px" width="12px" height="13px">
              <path
                fill="#B1B7C4"
                d="M8.9,7.2C9,6.9,9,6.7,9,6.5v-4C9,1.1,7.9,0,6.5,0h-1C4.1,0,3,1.1,3,2.5v4c0,0.2,0,0.4,0.1,0.7 C1.3,7.8,0,9.5,0,11.5V13h12v-1.5C12,9.5,10.7,7.8,8.9,7.2z M4,2.5C4,1.7,4.7,1,5.5,1h1C7.3,1,8,1.7,8,2.5v4c0,0.2,0,0.4-0.1,0.6 l0.1,0L7.9,7.3C7.6,7.8,7.1,8.2,6.5,8.2h-1c-0.6,0-1.1-0.4-1.4-0.9L4.1,7.1l0.1,0C4,6.9,4,6.7,4,6.5V2.5z M11,12H1v-0.5 c0-1.6,1-2.9,2.4-3.4c0.5,0.7,1.2,1.1,2.1,1.1h1c0.8,0,1.6-0.4,2.1-1.1C10,8.5,11,9.9,11,11.5V12z"
              />
            </svg>
          </label>
          <input
            id="username"
            className="lf--input"
            placeholder="email"
            type="email"
            name="email"
            value={form.email}
            onChange={changeHandler}
          />
        </div>

        {errorHelperMsg.password && (
          <div className="error--helper">
            <span className="material-symbols-outlined">warning</span>
            <span className="error--helper--message">
              {errorHelperMsg.password}
            </span>
          </div>
        )}
        <div className="flex-row">
          <label className="lf--label" htmlFor="password">
            <svg x="0px" y="0px" width="15px" height="5px">
              <g>
                <path
                  fill="#B1B7C4"
                  d="M6,2L6,2c0-1.1-1-2-2.1-2H2.1C1,0,0,0.9,0,2.1v0.8C0,4.1,1,5,2.1,5h1.7C5,5,6,4.1,6,2.9V3h5v1h1V3h1v2h1V3h1 V2H6z M5.1,2.9c0,0.7-0.6,1.2-1.3,1.2H2.1c-0.7,0-1.3-0.6-1.3-1.2V2.1c0-0.7,0.6-1.2,1.3-1.2h1.7c0.7,0,1.3,0.6,1.3,1.2V2.9z"
                />
              </g>
            </svg>
          </label>
          <input
            id="password"
            className="lf--input"
            placeholder="password"
            type="password"
            name="password"
            value={form.password}
            onChange={changeHandler}
          />
        </div>

        {!isRegister && errorHelperMsg.code && (
          <div className="error--helper">
            <span className="material-symbols-outlined">warning</span>
            <span className="error--helper--message">
              {errorHelperMsg.code}
            </span>
          </div>
        )}
        {!isRegister && (
          <div className="flex-row">
            <label className="lf--label" htmlFor="code">
              <svg x="0px" y="0px" width="15px" height="5px">
                <g>
                  <path
                    fill="#B1B7C4"
                    d="M6,2L6,2c0-1.1-1-2-2.1-2H2.1C1,0,0,0.9,0,2.1v0.8C0,4.1,1,5,2.1,5h1.7C5,5,6,4.1,6,2.9V3h5v1h1V3h1v2h1V3h1 V2H6z M5.1,2.9c0,0.7-0.6,1.2-1.3,1.2H2.1c-0.7,0-1.3-0.6-1.3-1.2V2.1c0-0.7,0.6-1.2,1.3-1.2h1.7c0.7,0,1.3,0.6,1.3,1.2V2.9z"
                  />
                </g>
              </svg>
            </label>
            <input
              id="code"
              className="lf--input"
              placeholder="code"
              type="text"
              name="code"
              value={form.code}
              onChange={changeHandler}
            />
          </div>
        )}

        {isRegister && errorHelperMsg.confirmPassword && (
          <div className="error--helper">
            <span className="material-symbols-outlined">warning</span>
            <span className="error--helper--message">
              {errorHelperMsg.confirmPassword}
            </span>
          </div>
        )}
        {isRegister && (
          <>
            <div className="flex-row">
              <label className="lf--label" htmlFor="confirmPassword">
                <svg x="0px" y="0px" width="15px" height="5px">
                  <g>
                    <path
                      fill="#B1B7C4"
                      d="M6,2L6,2c0-1.1-1-2-2.1-2H2.1C1,0,0,0.9,0,2.1v0.8C0,4.1,1,5,2.1,5h1.7C5,5,6,4.1,6,2.9V3h5v1h1V3h1v2h1V3h1 V2H6z M5.1,2.9c0,0.7-0.6,1.2-1.3,1.2H2.1c-0.7,0-1.3-0.6-1.3-1.2V2.1c0-0.7,0.6-1.2,1.3-1.2h1.7c0.7,0,1.3,0.6,1.3,1.2V2.9z"
                    />
                  </g>
                </svg>
              </label>
              <input
                id="confirmPassword"
                className="lf--input"
                placeholder="confirm password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={changeHandler}
              />
            </div>
            {qrURL && <Qr url={qrURL} />}
          </>
        )}

        {loading ? (
          <Loader />
        ) : (
          <div className="buttons">
            {!isRegister && (
              <button
                className="lf--submit"
                disabled={loading}
                onClick={loginHandler}
              >
                LOGIN
              </button>
            )}

            {isRegister && (
              <button
                className="lf--submit"
                disabled={loading}
                onClick={registerHandler}
              >
                SIGN UP
              </button>
            )}
          </div>
        )}
      </form>
      <span className="isRegister" onClick={switchPageHandler}>
        {isRegister ? "Login" : "Sign up"}
      </span>
    </div>
  );
};

export default AuthPage;
