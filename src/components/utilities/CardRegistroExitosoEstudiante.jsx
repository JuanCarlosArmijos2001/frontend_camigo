import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import HowToRegIcon from "@mui/icons-material/HowToReg";

const StyledIcon = styled(HowToRegIcon)({
  fontSize: 100,
  color: "#3864A6",
});

function CardRegistroExitosoEstudiante() {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        ¡Registro Exitoso en Camigo!
        <Button
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <StyledIcon />
        </Box>
        <Typography variant="body1" paragraph>
          ¡Enhorabuena! Has completado con éxito el registro en Camigo, tu
          compañero de aprendizaje en el mundo de la programación en C. Ahora
          estás listo para explorar un viaje educativo emocionante y sumergirte
          en el fascinante mundo del lenguaje de programación C.
        </Typography>
        <Typography variant="body1" paragraph>
          ¡Bienvenido a la comunidad Camigo, donde el aprendizaje se convierte
          en una experiencia colaborativa y divertida! No dudes en explorar los
          recursos de aprendizaje, participar en desafíos de programación y
          conectarte con otros entusiastas de la programación.
        </Typography>
        <Typography variant="body1" paragraph>
          Estamos aquí para apoyarte en cada paso de tu viaje hacia la maestría
          en C. ¡Feliz programación y bienvenido a Camigo!
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          Inicia sesión para comenzar tu viaje de aprendizaje 🚀👩‍💻👨‍💻.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CardRegistroExitosoEstudiante;
