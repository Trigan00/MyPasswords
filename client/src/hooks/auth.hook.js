import { useState, useCallback, useEffect } from "react";

const storageName = "userData";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userEmail, setuserEmail] = useState(null);

  const login = useCallback((jwtToken, email) => {
    setToken(jwtToken);
    setuserEmail(email);

    localStorage.setItem(
      storageName,
      JSON.stringify({
        userEmail: email,
        token: jwtToken,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setuserEmail(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.userEmail);
    }
    setReady(true);
  }, [login]);

  return { login, logout, token, userEmail, ready };
};
