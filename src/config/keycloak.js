import Keycloak from 'keycloak-js';


const keycloakConfig = {
    url: 'http://localhost/auth',
    realm: 'aerobase',
    clientId: 'react-test'
};


const keycloak = new Keycloak(keycloakConfig);
console.log("DATOS DE KEYCLOAK")
console.log(keycloak)

export default keycloak;