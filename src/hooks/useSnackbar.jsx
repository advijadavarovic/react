import React, { useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export const useSnackbar = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const openSnackbar = useCallback((message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }, []);

    const closeSnackbar = useCallback(() => {
        setSnackbarOpen(false);
    }, []);

    const SnackbarComponent = () => (
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
            <MuiAlert elevation={6} variant="outlined" onClose={closeSnackbar} severity={snackbarSeverity}>
                {snackbarMessage}
            </MuiAlert>
        </Snackbar>
    );

    return { openSnackbar, SnackbarComponent };
};