import {Avatar,Button,CssBaseline,TextField, Grid,Box,Alert,Container, Link,Paper, Snackbar} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {createTheme,ThemeProvider} from '@mui/material/styles';
import {NavLink} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../firebase";
import Cookies from 'js-cookie';
import {useSnackbar} from "../../hooks/useSnackbar";
import Copyright from "../copyright/Copyright";
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../../context/AuthContext";
import {useEffect} from "react";
const defaultTheme = createTheme();
function LoginForm() {
    const user = useAuthContext();
    const {t} = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {openSnackbar, SnackbarComponent} = useSnackbar();
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
           navigate('/dashboard');
        }
    }, [user]);
    const onSubmit = (data) => {
        const { email, password } = data;
       try {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const authToken = userCredential?.user?.getIdToken();
                Cookies.set('authToken', authToken, { expires: 7 });
                console.log(userCredential);
                navigate('/dashboard');
            }).catch((error) => {
            console.error(error);
            openSnackbar(t('Invalid credentials. Please check your email and password.'), 'error');
        });
        }
        catch(error) {
            console.log(error);
            openSnackbar(t('An error occurred during login!'), 'error');
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
                                required: t('Email is required.'),
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: t('Please enter a valid email address.'),
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
                                required: t('Password is required.'),
                                minLength: {
                                    value: 6,
                                    message: t('The password must have at least 6 characters.'),
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
                            color = "secondary"
                            sx={{ mt: 3, mb: 2, backgroundColor: '#8e44ad', color: '#ffffff' }}
                        >
                            {t('Sign In')}
                        </Button>
                        <SnackbarComponent/>
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