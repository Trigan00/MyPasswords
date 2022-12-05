import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import PasswordsPage from "./pages/PasswordsPage";

const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="passwords/" element={<PasswordsPage />} />
        <Route path="*" element={<Navigate to="passwords/" replace />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path={"/"} element={<AuthPage />} />
      <Route path={"*"} element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default useRoutes;
