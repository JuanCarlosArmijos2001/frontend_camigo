import React, { useState, useContext, createContext, useEffect } from "react";

const PreguntaSeleccionadoContext = createContext();

export const PreguntaSeleccionadoContextProvider = ({ children }) => {
    const [preguntaSeleccionado, setPreguntaSeleccionado] = useState(null);
    const actualizarPreguntaSeleccionado = (nuevoPreguntaSeleccionado) => {
        setPreguntaSeleccionado(nuevoPreguntaSeleccionado);
    };

    useEffect(() => {
        // console.log("Pregunta seleccionada en el contexto")
        // console.log(preguntaSeleccionado);
    }, [preguntaSeleccionado]);

    return (
        <PreguntaSeleccionadoContext.Provider value={{ preguntaSeleccionado, setPreguntaSeleccionado, actualizarPreguntaSeleccionado }}>
            {children}
        </PreguntaSeleccionadoContext.Provider>
    )
}

export const usePreguntaSeleccionado = () => {
    return useContext(PreguntaSeleccionadoContext);
}
