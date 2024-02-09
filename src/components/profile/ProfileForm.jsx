import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import {Button, Container, Paper, Stack, Typography, IconButton, InputAdornment, Avatar, CssBaseline, Box, Grid} from '@mui/material';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {db, auth} from "../../firebase";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {getDoc, doc, updateDoc} from "firebase/firestore";
import {Email as EmailIcon } from '@mui/icons-material';
import {Lock as LockIcon } from '@mui/icons-material';
import {faUser } from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from "react-i18next";
import {useSnackbar} from '../../hooks/useSnackbar';
import {useForm} from "react-hook-form";


const ProfileForm = () => {
    const currentUser = auth.currentUser;
    const {t} = useTranslation();
    const {openSnackbar, SnackbarComponent} = useSnackbar();
    const [originalUserData, setOriginalUserData] = useState({});
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const docRef = doc(db, 'user-data', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                    setOriginalUserData(docSnap.data());
                } else {
                    console.error('Document does not exist!');
                }
            }
        };
        fetchUserData();
    }, [currentUser]);

    const handleEditProfile = () => {
        setEditable(true);
    };
    const handleCancelEdit = () => {
        setUserData({ ...originalUserData });
        setEditable(false);
    };
    const saveProfileChanges = async () => {
        if (currentUser) {
            const docRef = doc(db, 'user-data', currentUser.uid);
            try {
                await updateDoc(docRef, {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                });
                if (userData.confirmPassword) {
                    await updateDoc(docRef, {password: userData.confirmPassword});
                }
                setEditable(false);
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    };
    const onSubmit= () => {
        if (editable) {
            if (userData.newPassword !== userData.confirmPassword) {
                openSnackbar(t('New password and confirm password must match.'), 'error');
                return;
            }
            saveProfileChanges();
            setEditable(false);
            openSnackbar(t('Changes saved successfully!'), 'success');
        }
    };
    return (
        <Container  component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <Paper elevation={3}
                   sx={{border: '2px solid #8e44ad', padding: '16px',
                       display: 'flex', flexDirection: 'column', alignItems: 'center',
                       boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                       width: '100%',
                       maxWidth: '500px',
                   }}>
                <Typography variant="h4" gutterBottom>
                    {t('Profile')}
                </Typography>
                <Avatar alt="User Avatar" src="https://th.bing.com/th/id/R.8e2c571ff125b3531705198a15d3103c?rik=gzhbzBpXBa%2bxMA&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fuser-png-icon-big-image-png-2240.png&ehk=VeWsrun%2fvDy5QDv2Z6Xm8XnIMXyeaz2fhR3AgxlvxAc%3d&risl=&pid=ImgRaw&r=0" sx={{ width: 60, height: 60 }} />
                <IconButton
                    variant="contained"
                    onClick={handleEditProfile}
                    sx={{  marginLeft: 50, marginBottom: 2, backgroundColor: '#8e44ad', color: 'white',  '@media (max-width: 600px)': {
                            marginLeft: '270px',
                            marginTop: '10px',
                        }, }}>
                    <FontAwesomeIcon icon={faEdit} />
                </IconButton>
                <Container sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TextField className={editable ? "": "Mui-disabled"}
                               {...register('firstName', {
                                   required: t('First Name is required.'),
                               })}
                               value={userData.firstName}
                               disabled={!editable}
                               name="firstName"
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
                               }}
                               onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                               InputProps={{
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <FontAwesomeIcon icon={faUser} />
                                       </InputAdornment>),
                               }}/>
                    <TextField
                        className={editable ? "": "Mui-disabled"}
                        {...register('lastName', {
                            required: t('Last Name is required.'),
                        })}
                        id="lastName"
                        value={userData.lastName}
                        disabled={!editable}
                        label={t('Last Name')}
                        name="lastName"
                        error={!!errors.lastName}
                        helperText={errors.lastName ? (
                            <span style={{ color: 'red' }}>{errors.lastName.message}</span>
                        ) : null}
                        inputProps={{ style: { borderColor: '#8e44ad' } }}
                        sx={{ marginLeft: '5px', '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#8e44ad',},
                                '&:hover fieldset': {borderColor: '#8e44ad',},
                                '&.Mui-focused fieldset': {borderColor: '#8e44ad',},},
                        }}
                        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faUser} />
                                </InputAdornment>),}}
                    />
                </Container>
                <Container sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TextField
                        className={editable ? "": "Mui-disabled"} label={t('Email Address')}
                        value={userData.email} disabled
                        sx = {{marginTop: '20px', width:'495px',  '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#8e44ad',},
                                '&:hover fieldset': {borderColor: '#8e44ad',},
                                '&.Mui-focused fieldset': {borderColor: '#8e44ad',},},
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton size="small" edge="start">
                                        <EmailIcon />
                                    </IconButton>
                                </InputAdornment>),}}
                    />
                </Container>
                <Container sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TextField
                        className={editable ? "": "Mui-disabled"}
                        label={t('New Password')}
                        {...register('newPassword', {
                            minLength: {
                                value: 6,
                                message: t('The password must have at least 6 characters.'),},
                        })}
                        type="password"
                        value={userData.newPassword || ''}
                        disabled={!editable}
                        onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                        sx = {{marginTop: '20px', marginRight: '5px', width: '245px',  '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#8e44ad',},
                                '&:hover fieldset': {borderColor: '#8e44ad',},
                                '&.Mui-focused fieldset': {borderColor: '#8e44ad',},},
                        }}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword ? (
                            <span style={{ color: 'red' }}>{errors.newPassword.message}</span>
                        ) : null}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton size="small" edge="start">
                                        <LockIcon />
                                    </IconButton>
                                </InputAdornment>),}}/>
                    <TextField
                        className={editable ? "": "Mui-disabled"}
                        label={t('Confirm Password')}
                        type="password"
                        {...register('confirmPassword', {
                            minLength: {
                                value: 6,
                                message: t('The password must have at least 6 characters.'),},
                        })}
                        value={userData.confirmPassword || ''}
                        disabled={!editable}
                        onChange={(e) =>setUserData({ ...userData, confirmPassword: e.target.value })}
                        sx = {{marginTop: '20px', width: '245px',  '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#8e44ad',},
                                '&:hover fieldset': {borderColor: '#8e44ad',},
                                '&.Mui-focused fieldset': {borderColor: '#8e44ad',},},}}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword ? (
                            <span style={{ color: 'red' }}>{errors.confirmPassword.message}</span>
                        ) : null}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton size="small" edge="start">
                                        <LockIcon />
                                    </IconButton>
                                </InputAdornment>),}}/>
                </Container>
                <Stack direction="row" spacing={2} sx={{ mt: 2}}>
                    {editable && (
                        <Button variant="contained" type = 'submit'
                                style={{backgroundColor: '#8e44ad', color: 'white'}}>
                            {t('Save')}
                        </Button>
                    )}
                    <SnackbarComponent/>
                    {editable && (
                        <Button variant="contained" onClick={handleCancelEdit}
                                style={{ backgroundColor: '#8e44ad', color: 'white' }}>
                            {t('Cancel')}
                        </Button>
                    )}
                </Stack>
            </Paper>
        </Container>
    );
};

export default ProfileForm;