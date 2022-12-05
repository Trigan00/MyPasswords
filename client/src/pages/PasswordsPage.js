import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
//import Loader from "../UI/Loader";
import AddPassword from "../components/AddPassword";
//import PasswordCard from "../components/PasswordCard";
import PasswordsList from "../components/PasswordsList";
import styles from "./PasswordsPage.module.scss";

const PasswordsPage = () => {
  const [passwords, setPasswords] = useState([]);
  const { loading, request, error } = useHttp();
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const fetchPasswords = useCallback(async () => {
    try {
      const fetched = await request("/api/passwords", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setPasswords(fetched);
      //console.log(fetched);
    } catch (e) {}
  }, [token, request]);

  useEffect(() => {
    fetchPasswords();
  }, [fetchPasswords]);

  useEffect(() => {
    if (error) {
      setMessage(error.message);
    }
  }, [error, setMessage]);

  // if (loading) {
  //   return <Loader />;
  // }

  if (message) {
    return <div className={styles.Error}>{message}</div>;
  }

  return (
    <div className={styles.PasswordsPageWrapper}>
      <PasswordsList
        loading={loading}
        passwords={passwords}
        fetchPasswords={fetchPasswords}
      />

      {<AddPassword fetchPasswords={fetchPasswords}></AddPassword>}
    </div>
  );
};

export default PasswordsPage;
