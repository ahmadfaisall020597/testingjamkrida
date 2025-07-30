import Keycloak from "keycloak-js";

const keycloakSetting = {
  url: `${import.meta.env.VITE_KEYCLOAK_URL}`,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
}

const authInstance = new Keycloak(keycloakSetting)

export default authInstance