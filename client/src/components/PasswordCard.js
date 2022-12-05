import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import PasswordInfo from "./PasswordInfo";
import styles from "./PasswordCard.module.scss";
import Alert from "./Alert";

const PasswordCard = ({
  id,
  title,
  passwordstrength,
  index,
  fetchPasswords,
}) => {
  const authCtx = useContext(AuthContext);
  const { request, loading, error } = useHttp();
  const [data, setData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [isHover, setIsHover] = useState("");

  const showPasswordHandler = async () => {
    setIsOpen(true);
    try {
      const data = await request(`/api/passwords/${id}`, "GET", null, {
        Authorization: `Bearer ${authCtx.token}`,
      });
      setData(data);
    } catch (e) {}
  };

  const deletePasswordHandler = async () => {
    try {
      await request(`/api/passwords/${id}`, "DELETE", null, {
        Authorization: `Bearer ${authCtx.token}`,
      });
      fetchPasswords();
    } catch (e) {}
  };

  const savePasswordHandler = async (updatedPaswordData) => {
    const newData = {
      title: updatedPaswordData.title,
      login: updatedPaswordData.login,
      password: updatedPaswordData.password,
      id: updatedPaswordData.id,
    };
    try {
      await request(`/api/passwords/update`, "PUT", newData, {
        Authorization: `Bearer ${authCtx.token}`,
      });
      fetchPasswords();
    } catch (e) {}
  };

  const hidePasswordHandler = () => {
    setIsOpen(false);
  };

  return (
    <React.Fragment>
      {isAlert && (
        <Alert
          deletePasswordHandler={deletePasswordHandler}
          setIsAlert={setIsAlert}
        />
      )}
      <div className={styles.Card}>
        <div
          className={`${styles.Circle} ${styles[passwordstrength]} ${styles[isHover]}`}
        ></div>
        <div
          className={styles.Password}
          onClick={showPasswordHandler}
          onMouseOver={() => setIsHover("Hover")}
          onMouseOut={() => setIsHover("")}
        >
          <div className={styles.Number}>{index + 1}</div>
          <span className={styles.Title}>{title}</span>
        </div>
        <div className={styles.Delete}>
          <span
            onClick={() => setIsAlert(true)}
            className="material-symbols-outlined"
            style={{ color: "#fff" }}
          >
            delete
          </span>
        </div>
      </div>

      {isOpen && (
        <PasswordInfo
          isLoading={loading}
          error={error}
          data={data}
          hidePassword={hidePasswordHandler}
          fetchPasswords={fetchPasswords}
          savePasswordHandler={savePasswordHandler}
        />
      )}
    </React.Fragment>
  );
};

export default PasswordCard;
