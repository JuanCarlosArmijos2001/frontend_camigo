import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CodeIcon from '@mui/icons-material/Code';
import FolderIcon from '@mui/icons-material/Folder';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DoneIcon from '@mui/icons-material/Done';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useTemaSeleccionado } from "../../../context/TemaSeleccionadoContext";
import { useSubtemaSeleccionado } from "../../../context/SubtemaSeleccionadoContext";
import { useEjercicioSeleccionado } from "../../../context/EjercicioSeleccionadoContext";
import { usePreguntaSeleccionado } from "../../../context/PreguntaSeleccionadoContext";
import { useSesionUsuario } from "../../../context/SesionUsuarioContext";
import NaveBar from "../../header/NaveBar";
import MostrarContenido from "./MostrarContenido";
import GestionarContenido from "../gestionarContenido/GestionarContenido";
import PaginaPrincipalAdmin from "../paginaPrincipalAdmin/PaginaPrincipalAdmin";
import ProgressBar from 'react-bootstrap/ProgressBar';
import TextField from '@mui/material/TextField';
import PaginaBienvenida from "./PaginaBienvenida";


const drawerWidth = 425;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: 'grey',
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Home() {
    const [open, setOpen] = useState(true);
    const { temaSeleccionado, actualizarTemaSeleccionado } = useTemaSeleccionado();
    const { subtemaSeleccionado, actualizarSubtemaSeleccionado } = useSubtemaSeleccionado();
    const { actualizarEjercicioSeleccionado } = useEjercicioSeleccionado();
    const { actualizarPreguntaSeleccionado } = usePreguntaSeleccionado();
    const { usuarioDetalles } = useSesionUsuario();
    const [temas, setTemas] = useState([]);
    const [subtemas, setSubtemas] = useState(null);
    const subtemasRef = useRef(null);
    const [mostrarPaginaBienvenida, setMostrarPaginaBienvenida] = useState(true);
    const [mostrarGestionarContenido, setMostrarGestionarContenido] = useState(false);
    const [mostrarPaginaAdmin, setMostrarPaginaAdmin] = useState(false);
    const [temaSearchTerm, setTemaSearchTerm] = useState('');
    const [subtemaSearchTerm, setSubtemaSearchTerm] = useState('');


    useEffect(() => {
        cargarTemas();
    }, [usuarioDetalles.detallesPersona]);

    useEffect(() => {
        if (temaSeleccionado) {
            cargarSubtemas(temaSeleccionado.id);
        } else {
            setSubtemas(null);
            actualizarSubtemaSeleccionado(null);
        }
    }, [temaSeleccionado]);

    useEffect(() => {
        if (subtemasRef.current) {
            subtemasRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [subtemas]);

    const cargarTemas = () => {
        const parametros = {
            idUsuario: usuarioDetalles.id,
            mensaje: "temasActivos",
        };

        axios
            .post("http://localhost:5000/temas/listarTemas", parametros)
            .then((response) => {
                if (response.data.en === 1) {
                    setTemas(response.data.temas);
                } else {
                    console.log("Hubo un problema al cargar los temas");
                }
            })
            .catch((error) => {
                console.error("Error al obtener los temas:", error);
            });
    };

    const cargarSubtemas = () => {
        const parametros = {
            mensaje: "subtemasActivos",
            idTema: temaSeleccionado.idTema,
            idUsuario: usuarioDetalles.id,
        };

        axios
            .post("http://localhost:5000/subtemas/listarSubtemas", parametros)
            .then((response) => {
                if (response.data.en === 1) {
                    setSubtemas(response.data.subtemas);
                } else {
                    console.log("Hubo un problema al cargar los subtemas");
                    setSubtemas([]);
                }
            })
            .catch((error) => {
                console.error("Error al obtener los subtemas:", error);
            });
    };

    const cleanHtmlTags = (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, "text/html");
        return doc.body.textContent || "";
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const handleGestionarContenido = () => {
        setMostrarPaginaBienvenida(false);
        setMostrarPaginaAdmin(false);
        setMostrarGestionarContenido(true);
    };

    const handleMostrarContenido = () => {
        setMostrarPaginaBienvenida(false);
        setMostrarGestionarContenido(false);
        setMostrarPaginaAdmin(false);
    };

    const handleMostrarPaginaAdmin = () => {
        setMostrarPaginaBienvenida(false);
        setMostrarGestionarContenido(false);
        setMostrarPaginaAdmin(true);
    }


    const handleTemaSearch = (event) => {
        setTemaSearchTerm(event.target.value);
    };

    const handleSubtemaSearch = (event) => {
        setSubtemaSearchTerm(event.target.value);
    };

    const filteredTemas = temas.filter((tema) =>
        cleanHtmlTags(tema.titulo).toLowerCase().includes(temaSearchTerm.toLowerCase())
    );

    const filteredSubtemas = subtemas
        ? subtemas.filter((subtema) =>
            cleanHtmlTags(subtema.titulo).toLowerCase().includes(subtemaSearchTerm.toLowerCase())
        )
        : [];


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={open ? handleDrawerClose : handleDrawerOpen}
                        sx={{ ml: 2 }}
                    >
                        {open ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {usuarioDetalles.detallesPersona.nombres}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="h6" noWrap component="div">
                        <ProgressBar variant="success" style={{ width: `200px`, height: `20px` }} label={`Progreso: ${usuarioDetalles.progreso}%`} />
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <NaveBar />
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <Typography variant="h4" noWrap style={{ fontWeight: 'bold' }}>
                        C'amigo
                    </Typography>
                </DrawerHeader>
                <Divider />
                {open ? (
                    <Typography variant="h5" sx={{ textAlign: 'center' }}>
                        Temas
                    </Typography>
                ) : (
                    <ListItemIcon style={{ margin: 'auto' }}>
                        <FolderIcon sx={{ textAlign: 'center' }} />
                    </ListItemIcon>
                )}
                <Divider />
                <List>
                    {open ? (
                        <TextField
                            label="Buscar tema"
                            variant="outlined"
                            fullWidth
                            size="small"
                            onChange={handleTemaSearch}
                            value={temaSearchTerm}
                        />
                    ) : (
                        <ListItemIcon>
                            <SearchIcon />
                        </ListItemIcon>
                    )}
                    {filteredTemas.map((tema) => (
                        <ListItem
                            key={tema.idTema}
                            disablePadding
                            onClick={() => {
                                actualizarTemaSeleccionado(tema);
                                actualizarSubtemaSeleccionado(null);
                                actualizarEjercicioSeleccionado(null);
                                actualizarPreguntaSeleccionado(null);
                                handleMostrarContenido();
                            }}
                            sx={{ display: 'block' }}
                        >

                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: 'initial',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon>
                                    <CodeIcon />
                                </ListItemIcon>
                                <ListItemText primary={cleanHtmlTags(tema.titulo)} />
                                {tema.progreso === 100 ? (
                                    <DoneIcon style={{ color: 'green' }} />
                                ) : (
                                    <ProgressBar variant="success" style={{ width: `25px` }} label={`${tema.progreso}%`} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>


                {open ? (
                    <Typography variant="h5" sx={{ textAlign: 'center' }}>
                        Subtemas
                    </Typography>
                ) : (
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                )}
                <Divider />
                <List ref={subtemasRef}>
                    {open ? (
                        <TextField
                            label="Buscar subtema"
                            variant="outlined"
                            fullWidth
                            size="small"
                            onChange={handleSubtemaSearch}
                            value={subtemaSearchTerm}
                        />
                    ) : (
                        <ListItemIcon>
                            <SearchIcon />
                        </ListItemIcon>
                    )}
                    {filteredSubtemas.map((subtema) => (
                        <ListItem
                            key={subtema.idSubtema}
                            disablePadding
                            onClick={() => {
                                actualizarSubtemaSeleccionado(subtema);
                                actualizarEjercicioSeleccionado(null);
                                actualizarPreguntaSeleccionado(null);
                            }}
                            sx={{ display: 'block' }}
                        >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: 'initial',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon>
                                    <CodeIcon />
                                </ListItemIcon>
                                <ListItemText primary={cleanHtmlTags(subtema.titulo)} />
                                {subtema.progreso === 100 ? (
                                    <DoneIcon style={{ color: 'green' }} />
                                ) : (
                                    <ProgressBar variant="success" style={{ width: `25px` }} label={`${subtema.progreso}%`} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                {/* --------------------- */}

                <List>
                    {open ? (
                        <Typography variant="h5" sx={{ textAlign: 'center' }}>
                            Gestionar contenido
                        </Typography>
                    ) : (
                        <ListItemIcon>
                            <LibraryBooksIcon />
                        </ListItemIcon>
                    )}
                    <Divider />
                    <ListItem
                        key="administrarContenido"
                        disablePadding
                        onClick={handleGestionarContenido}
                        sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: 'initial',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon>
                                <EditIcon />
                            </ListItemIcon>
                            <ListItemText primary="Gestionar contenido" />
                        </ListItemButton>
                    </ListItem>
                    {open ? (
                        <Typography variant="h5" sx={{ textAlign: 'center' }}>
                            Administrar docentes
                        </Typography>
                    ) : (
                        <ListItemIcon>
                            <LibraryBooksIcon />
                        </ListItemIcon>
                    )}
                    <Divider />
                    <ListItem
                        key="administrarDocentes"
                        disablePadding
                        onClick={handleMostrarPaginaAdmin}
                        sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: 'initial',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon>
                                <EditIcon />
                            </ListItemIcon>
                            <ListItemText primary="Administrar docentes" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {mostrarPaginaBienvenida ? (
                    <PaginaBienvenida />
                ) : mostrarGestionarContenido ? (
                    <GestionarContenido />
                ) : mostrarPaginaAdmin ? (
                    <PaginaPrincipalAdmin />
                ) : (
                    <MostrarContenido />
                )}
            </Box>
        </Box>
    );
}
