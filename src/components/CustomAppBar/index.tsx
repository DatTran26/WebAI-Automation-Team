import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export const CustomAppBar: React.FC = () => {
    return (
        <AppBar position="fixed" elevation={1}>
            <Toolbar>
                <AutoAwesomeIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    WPC Team Manager
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="inherit">
                        WebAI Automation Team
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default CustomAppBar;
