import React from 'react';
import { useSesionUsuario } from "../../context/SesionUsuarioContext";

function GestionarContenido() {
    const {cerrarSesion } = useSesionUsuario();
    return (
        <div>
            <h1>Funciona el login</h1>
            <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
    );
}

export default GestionarContenido;