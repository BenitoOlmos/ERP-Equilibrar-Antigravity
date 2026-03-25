import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

type User = {
   id: string;
   name: string;
   email: string;
   role: string;
};

type AuthContextType = {
   user: User | null;
   token: string | null;
   login: (token: string, user: User) => void;
   logout: () => void;
   isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
   user: null,
   token: null,
   login: () => {},
   logout: () => {},
   isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [user, setUser] = useState<User | null>(null);
   const [token, setToken] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      // Rehydrate session from storage
      const storedToken = localStorage.getItem('erp_token');
      const storedUser = localStorage.getItem('erp_user');
      
      if (storedToken && storedUser) {
         setToken(storedToken);
         setUser(JSON.parse(storedUser));
         // Set global axios auth header
         axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
      setIsLoading(false);
   }, []);

   const login = (newToken: string, newUser: User) => {
      localStorage.setItem('erp_token', newToken);
      localStorage.setItem('erp_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
   };

   const logout = () => {
      localStorage.removeItem('erp_token');
      localStorage.removeItem('erp_user');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
   };

   return (
      <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
         {children}
      </AuthContext.Provider>
   );
};
