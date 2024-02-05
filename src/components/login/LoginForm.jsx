import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {Alert, Container, Link, Paper, Snackbar} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {NavLink} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../firebase";
import "../../translate/i18n";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://www.bing.com/ck/a?!&&p=6395dc94e6f83fe6JmltdHM9MTcwNjkxODQwMCZpZ3VpZD0xNmIxZmUxYy0zYTQ3LTZjMzAtMmFmZC1lZGExM2IwMzZkYWMmaW5zaWQ9NTIwOA&ptn=3&ver=2&hsh=3&fclid=16b1fe1c-3a47-6c30-2afd-eda13b036dac&psq=serapion&u=a1aHR0cHM6Ly9zZXJhcGlvbi5uZXQv&ntb=1">
                Serapion
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
const defaultTheme = createTheme();
function LoginForm() {
    const {t} = useTranslation();
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const handleSnackbarOpen = (severity) => {
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickable') {
            return;
        }
        setSnackbarOpen(false);
    };
    const onSubmit = (data) => {
        const { email, password } = data;
       try {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                window.location.href = '/dashboard';
            }).catch((error) => {
            console.error(error);
            handleSnackbarOpen('error');
        });
        }
        catch(error) {
            console.log(error);
            handleSnackbarOpen('fail');
        }
    };
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <Paper elevation={3}
                       sx={{border: '2px solid #8e44ad', padding: '16px', marginTop: '40px',
                           display: 'flex', flexDirection: 'column', alignItems: 'center',
                           boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                       }}>
                <CssBaseline />
                <Box
                    sx={{marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                    <Avatar sx={{ m: 1, bgcolor: '#8e44ad' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5"  sx={{ color: '#8e44ad' }}>
                        {t('Sign in')}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                        <TextField
                            {...register('email', {
                                required: 'Email is required.',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Please enter a valid email address.',
                                },
                            })}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label={t('Email Address')}
                            name="email"
                            error={!!errors.email}
                            helperText={errors.email ? (
                                <span style={{ color: 'red' }}>{errors.email.message}</span>
                            ) : null}
                            inputProps={{ style: { borderColor: '#8e44ad' } }}
                            sx={{'& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#8e44ad',},
                                    '&:hover fieldset': {borderColor: '#8e44ad',},
                                    '&.Mui-focused fieldset': {borderColor: '#8e44ad',},
                                },
                            }}/>
                        <TextField
                            {...register('password', {
                                required: 'Password is required.',
                                minLength: {
                                    value: 6,
                                    message: 'The password must have at least 6 characters.',
                                },
                            })}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={t('Password')}
                            type="password"
                            id="password"
                            error={!!errors.password}
                            helperText={errors.password ? (
                                <span style={{ color: 'red' }}>{errors.password.message}</span>
                            ) : null}
                            inputProps={{ style: { borderColor: '#8e44ad' } }}
                            sx={{'& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#8e44ad',},
                                    '&:hover fieldset': {borderColor: '#8e44ad',},
                                    '&.Mui-focused fieldset': {borderColor: '#8e44ad',},
                                },
                            }}/>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, backgroundColor: '#8e44ad', color: '#ffffff' }}
                        >
                            {t('Sign In')}
                        </Button>
                        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                                {snackbarSeverity === 'error' ? 'Invalid credentials. Please check your email and password.' : 'An error occurred during login!'}
                            </Alert>
                        </Snackbar>
                        <Grid container>
                            <Grid item>
                                <NavLink to = "/signup"  style={{ color: '#8e44ad' }} >
                                    {t("Don't have an account? Sign Up")}
                                </NavLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                </Paper>
            </Container>
            <Copyright sx={{ mt: 4, mb: 4 }} />
        </ThemeProvider>
    );
}
export default LoginForm;