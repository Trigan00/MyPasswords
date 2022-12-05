import { createContext } from "react";

export const AuthContext = createContext({
  token: null,
  userEmail: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  searchTerm: "",
  setSearchTerm: () => {},
});
