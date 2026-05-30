import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await apiLogin({ Email: email, MotDePasse: password });
      if (response && response.status === 'success') {
        setUser(response.user);
        sessionStorage.setItem('user', JSON.stringify(response.user));
        return { success: true };
      }
      return { success: false, message: response?.message || 'Erreur de connexion' };
    } catch (error) {
      return { success: false, message: 'Erreur réseau.' };
    }
  };

  const register = async (nom, prenom, email, password) => {
    try {
      const response = await apiRegister({ Nom: nom, Prenom: prenom, Email: email, MotDePasse: password });
      if (response && response.status === 'success') {
        return { success: true };
      }
      return { success: false, message: response?.message || 'Erreur d\'inscription' };
    } catch (error) {
      return { success: false, message: 'Erreur réseau.' };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
