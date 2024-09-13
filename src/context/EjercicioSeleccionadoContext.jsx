import React, { useState, useContext, createContext, useEffect } from "react";

const EjercicioSeleccionadoContext = createContext();

export const EjercicioSeleccionadoContextProvider = ({ children }) => {
    const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);
    const actualizarEjercicioSeleccionado = (nuevoEjercicioSeleccionado) => {
        setEjercicioSeleccionado(nuevoEjercicioSeleccionado);
    };

    useEffect(() => {
        console.log("Ejercicio seleccionado en el contexto")
        console.log(ejercicioSeleccionado);
    }, [ejercicioSeleccionado]);

    return (
        <EjercicioSeleccionadoContext.Provider value={{ ejercicioSeleccionado, setEjercicioSeleccionado, actualizarEjercicioSeleccionado }}>
            {children}
        </EjercicioSeleccionadoContext.Provider>
    )
}

export const useEjercicioSeleccionado = () => {
    return useContext(EjercicioSeleccionadoContext);
}
