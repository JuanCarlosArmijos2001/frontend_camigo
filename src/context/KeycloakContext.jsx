import React, { createContext, useContext, useState, useEffect } from 'react';
import Keycloak from 'keycloak-js';


const KeycloakContext = createContext();

const keycloak = new Keycloak({
  url: 'https://computacion.unl.edu.ec:8889/auth/',
  realm: 'master',
  clientId:'camigo',
});

// Function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return null;
  }
};

export const KeycloakProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (!authenticated){
    keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
    }).then(authenticated => {
      setAuthenticated(authenticated);
      if (authenticated) {
        keycloak.loadUserInfo().then(userInfo => {
          setUser(userInfo);
          const token = keycloak.token;
          if (token) {
            const decodedToken = decodeToken(token);
            setRoles(decodedToken.realm_access.roles || []);
          }
        }).catch(error => {
          console.error('Error al cargar información del usuario:', error);
        });
      }
    }).catch(error => {
      console.error('Error durante la inicialización de Keycloak:', error);
    });
  }
  }, [keycloak]);


  const login = () => {
    if (!authenticated){
    keycloak.login().then(() => {
      keycloak.loadUserInfo().then(userInfo => {
        setUser(userInfo);
        setAuthenticated(true);
        const token = keycloak.token;
        if (token) {
          const decodedToken = decodeToken(token);
          setRoles(decodedToken.realm_access.roles || []);
        }
      }).catch(error => {
        console.error('Error al cargar información del usuario:', error);
      });
    }).catch(error => {
      console.error('Error durante el inicio de sesión:', error);
    });
  }
  };

  const logout = () => {
    keycloak.logout();
    setAuthenticated(false);
    setUser(null);
    setRoles([]);
  };

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, login, logout, user, roles }}>
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = () => useContext(KeycloakContext);

export default KeycloakContext;
