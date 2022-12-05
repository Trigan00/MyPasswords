import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import { AuthContext } from "./context/AuthContext";
import { useAuth } from "./hooks/auth.hook";
import useRoutes from "./routes";

function App() {
  const { token, login, logout, userEmail } = useAuth();
  const isAuthenticated = !!token;
  const [searchTerm, setSearchTerm] = useState("");
  const routes = useRoutes(isAuthenticated);
  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        userEmail,
        isAuthenticated,
        searchTerm,
        setSearchTerm,
      }}
    >
      <BrowserRouter>
        {isAuthenticated && <NavBar />}
        <div>{routes}</div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
