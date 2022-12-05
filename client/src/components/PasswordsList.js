import React, { useContext, useState, useEffect } from "react";
import PasswordCard from "./PasswordCard";
import Loader from "../UI/Loader";
import styles from "./PasswordsList.module.scss";
import { AuthContext } from "../context/AuthContext";

const PasswordsList = ({ loading, passwords, fetchPasswords }) => {
  const { searchTerm } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const results = passwords.filter((password) =>
      password.title.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results.reverse());
  }, [searchTerm, passwords]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {searchResults.length > 0 ? (
        searchResults.map((password, i) => (
          <PasswordCard
            key={password.id}
            id={password.id}
            title={password.title}
            passwordstrength={password.passwordstrength}
            index={i}
            fetchPasswords={fetchPasswords}
          />
        ))
      ) : (
        <div className={styles.IsEmpty}>Password list is empty</div>
      )}
    </div>
  );
};

export default PasswordsList;
