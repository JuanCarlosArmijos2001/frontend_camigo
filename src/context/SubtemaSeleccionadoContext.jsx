import React, { useState, useContext, createContext, useEffect } from "react";

const SubtemaSeleccionadoContext = createContext();

export const SubtemaSeleccionadoContextProvider = ({ children }) => {
    const [subtemaSeleccionado, setSubtemaSeleccionado] = useState(null);
    const actualizarSubtemaSeleccionado = (nuevoSubtemaSeleccionado) => {
        setSubtemaSeleccionado(nuevoSubtemaSeleccionado);
    };

    useEffect(() => {
        console.log("Subtema seleccionado en el contexto")
        console.log(subtemaSeleccionado);
    }, [subtemaSeleccionado]);

    return (
        <SubtemaSeleccionadoContext.Provider value={{ subtemaSeleccionado, setSubtemaSeleccionado, actualizarSubtemaSeleccionado }}>
            {children}
        </SubtemaSeleccionadoContext.Provider>
    )
}

export const useSubtemaSeleccionado = () => {
    return useContext(SubtemaSeleccionadoContext);
}
