import React from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const stats = [
    { label: 'Active Agents', value: '37+', icon: <AutoAwesomeIcon />, color: '#1976d2' },
    { label: 'Team Members', value: '12', icon: <GroupIcon />, color: '#388e3c' },
    { label: 'Active Tasks', value: '48', icon: <AssignmentIcon />, color: '#f57c00' },
    { label: 'Completion Rate', value: '98.78%', icon: <TrendingUpIcon />, color: '#7b1fa2' },
];

export const DashboardMain: React.FC = () => {
    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome to WPC Team Manager — your AI-powered team automation hub.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {stats.map((stat) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
                        <Card elevation={2}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={700} sx={{ color: stat.color }}>
                                    {stat.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Recent Activity
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {[
                                { title: 'Loki Mode activated', desc: 'Full-stack demo app deployment completed', status: 'success' },
                                { title: 'Agent orchestration', desc: '37 agents coordinated for parallel task execution', status: 'info' },
                                { title: 'Code review pass', desc: 'PR #42 passed automated review with 0 issues', status: 'success' },
                                { title: 'Task automation', desc: 'Scheduled workflow executed on time', status: 'info' },
                            ].map((item, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Chip
                                        label={item.status}
                                        color={item.status === 'success' ? 'success' : 'info'}
                                        size="small"
                                        sx={{ mt: 0.5 }}
                                    />
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.desc}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            System Status
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {[
                                { name: 'API Gateway', status: 'Online' },
                                { name: 'Agent Orchestrator', status: 'Online' },
                                { name: 'Task Queue', status: 'Online' },
                                { name: 'Analytics Engine', status: 'Online' },
                            ].map((service) => (
                                <Box key={service.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2">{service.name}</Typography>
                                    <Chip label={service.status} color="success" size="small" variant="outlined" />
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardMain;
