import { createContext, useContext } from "react";
import { useKeycloak } from "@react-keycloak/web";

const KeycloakContext = createContext(null);

export const KeycloakProvider = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();
  return (
    <KeycloakContext.Provider value={{ keycloak, initialized }}>
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloakAuth = () => useContext(KeycloakContext);