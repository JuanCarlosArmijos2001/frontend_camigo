import React from 'react'
import { Grid, Paper, Typography } from '@mui/material'

export default function GridComponentWhiteElevated() {
    return (
        <Grid container>
            <Grid item xs={12} sm={3.6}>
                <Paper
                    elevation={4}
                    sx={{
                        height: '100%',
                        backgroundColor: 'white',
                        borderRadius: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: 2,
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <Typography variant="h6" color="primary">Columna 30%</Typography>
                    <Typography color="text.secondary">
                        Esta columna ocupa el 30% del ancho y tiene una elevación que crea una sombra.
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={8.4}>
                <Paper
                    square
                    elevation={0}
                    sx={{
                        height: '100%',
                        backgroundColor: 'white',
                        borderRadius: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: 2,
                    }}
                >
                    <Typography variant="h6" color="primary">Columna 70%</Typography>
                    <Typography color="text.secondary">
                        Esta columna ocupa el 70% del ancho y no tiene elevación.
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}