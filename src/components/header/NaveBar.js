import React, { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';  // Importa el icono de configuración
import { useSesionUsuario } from "../../context/SesionUsuarioContext";
import ModalEditarUsuario from "../administrarSesion/ModalEditarUsuario";

export default function NaveBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { usuarioDetalles, cerrarSesion } = useSesionUsuario();
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

  useEffect(() => {
    console.log("Sesión en NaveBar: ", usuarioDetalles);
  }, [usuarioDetalles]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const abrirModalEditar = () => {
    setMostrarModalEditar(true);
    handleClose();  // Cerrar el menú cuando se abre el modal
  };

  const cerrarModalEditar = () => {
    setMostrarModalEditar(false);
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <SettingsIcon style={{ color: 'white' }} />  {/* Cambia el color del icono a gris */}
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={abrirModalEditar}>Perfil</MenuItem>
        <MenuItem onClick={cerrarSesion}>Cerrar sesión</MenuItem>
      </Menu>
      <ModalEditarUsuario show={mostrarModalEditar} onHide={cerrarModalEditar} />
    </div>
  );
}

