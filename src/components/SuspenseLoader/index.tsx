import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface SuspenseLoaderProps {
    size?: number;
}

export const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({ size = 40 }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px',
                width: '100%',
            }}
        >
            <CircularProgress size={size} />
        </Box>
    );
};

export default SuspenseLoader;
