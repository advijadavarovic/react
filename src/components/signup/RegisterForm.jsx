import * as React from 'react';
import {Avatar, Button, Link, Grid, Box, Container, Typography, Paper, CssBaseline, TextField, Snackbar, Alert} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../../firebase";
import {NavLink} from "react-router-dom";
import {useForm} from "react-hook-form";
import {setDoc, collection, doc} from "firebase/firestore";
import {useTranslation} from "react-i18next";
import {useSnackbar} from '../../hooks/useSnackbar';
import Copyright from "../copyright/Copyright";
const defaultTheme = createTheme();
 function SignUp() {
     const {openSnackbar, SnackbarComponent} = useSnackbar();
     const { t } = useTranslation();
     const { register, handleSubmit, formState: { errors } } = useForm();

     const onSubmit = async (data) => {
         const { email, password, firstName, lastName } = data;
         try {
             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
             const user = userCredential.user;
             const userRef = doc(collection(db, 'user-data'), user.uid);
             await setDoc(userRef, {
                 uid: user.uid,
                 firstName,
                 lastName,
                 email,
                 password
             });
             console.log(userCredential);
             window.location.href = '/dashboard';
             openSnackbar(t('Registered successful!'),'success');
         } catch (error) {
            openSnackbar(t('User already exist!'), 'error');

         }
     };
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <Paper elevation={3}
                       sx={{border: '2px solid #8e44ad', padding: '16px', marginTop: '20px', display: 'flex',
                           flexDirection: 'column', alignItems: 'center', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                       }}>
                <CssBaseline />
                <Box
                    sx={{marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                    <Avatar sx={{ m: 1, bgcolor: '#8e44ad' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ color: '#8e44ad' }}>
                        {t('Sign up')}
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('firstName', {
                                        required: t('First Name is required.'),
                                    })}
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label={t('First Name')}
                                    autoFocus
                                    error={!!errors.firstName}
                                    helperText={errors.firstName ? (
                                        <span style={{ color: 'red' }}>{errors.firstName.message}</span>
                                    ) : null}
                                    inputProps={{ style: { borderColor: 'purple' } }}
                                    sx={{'& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#8e44ad',},
                                            '&:hover fieldset': {borderColor: '#8e44ad',},
                                            '&.Mui-focused fieldset': {borderColor: '#8e44ad',},
                                        },
                                    }}/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('lastName', {
                                        required: t('Last Name is required.'),
                                    })}
                                    required
                                    fullWidth
                                    id="lastName"
                                    label={t('Last Name')}
                                    name="lastName"
                                    error={!!errors.lastName}
                                    helperText={errors.lastName ? (
                                        <span style={{ color: 'red' }}>{errors.lastName.message}</span>
                                    ) : null}
                                    inputProps={{ style: { borderColor: '#8e44ad' } }}
                                    sx={{'& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#8e44ad',},
                                            '&:hover fieldset': {borderColor: '#8e44ad',},
                                            '&.Mui-focused fieldset': {borderColor: '#8e44ad',},},
                                    }}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register('email', {
                                        required: t('Email is required.'),
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: t('Please enter a valid email address.'),},
                                    })}
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
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register('password', {
                                        required: t('Password is required.'),
                                        minLength: {
                                            value: 6,
                                            message: t('The password must have at least 6 characters.'),},
                                    })}
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
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color = "secondary"
                            sx={{ mt: 3, mb: 2, backgroundColor: '#8e44ad', color: '#ffffff' }}
                        >
                            {t('Sign Up')}
                        </Button>
                       <SnackbarComponent/>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <NavLink to = "/login"  style={{ color: '#8e44ad' }}>
                                    {t('Already have an account? Sign in')}
                                </NavLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                </Paper>
                <Copyright sx={{ mt: 3 }} />
            </Container>
        </ThemeProvider>
    );
}
export default SignUp;