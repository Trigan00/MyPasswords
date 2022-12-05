import React, { useEffect, useState } from "react";
import styles from "./Alert.module.scss";

const Alert = ({ deletePasswordHandler, setIsAlert }) => {
  const [blink, setBlink] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setBlink("");
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [blink]);

  const onBlinkHandler = () => {
    setBlink("Blink");
  };

  const buttonsHandler = (event) => {
    switch (event.target.name) {
      case "Yes":
        deletePasswordHandler();
        break;
      case "No":
        setIsAlert(false);
        break;
      default:
        setIsAlert(false);
    }
  };
  return (
    <div className={styles.BackGround} onClick={onBlinkHandler}>
      <div className={`${styles.Wrapper} ${styles[blink]}`}>
        <h1>Are you sure you want to delete the password?</h1>
        <hr />
        <div className={styles.Buttons}>
          <button name="Yes" onClick={buttonsHandler}>
            Yes
          </button>
          <button name="No" onClick={buttonsHandler}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
