import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Paper, Typography, useTheme } from '@mui/material';

const data = [
    { name: 'Tema 1', likes: 55 },
    { name: 'Tema 2', likes: 68 },
    { name: 'Tema 3', likes: 59 },
    { name: 'Tema 4', likes: 81 },
    { name: 'Tema 5', likes: 86 },
    { name: 'Tema 6', likes: 84 },
];

export default function EnhancedLikeBarChart() {
    const theme = useTheme();

    const getBarColor = (value) => {
        if (value > 80) return theme.palette.success.main;
        if (value > 50) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                maxWidth: 700,
                margin: 'auto',
                borderRadius: 4,
                background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`
            }}
        >
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                Temas con más me gusta.
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: theme.palette.text.secondary }}
                        axisLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis
                        tick={{ fill: theme.palette.text.secondary }}
                        axisLine={{ stroke: theme.palette.divider }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 4,
                        }}
                    />
                    <Bar dataKey="likes" animationDuration={1500}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.likes)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <Typography variant="body2" align="center" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                Porcentaje de "Me gusta" por tema
            </Typography>
        </Paper>
    );
}