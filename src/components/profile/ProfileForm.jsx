import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import  {Button,Container, Paper, Stack,Typography,IconButton, InputAdornment, Avatar} from '@mui/material';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {db, auth} from "../../firebase";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {getDoc, doc, updateDoc} from "firebase/firestore";
import {Email as EmailIcon } from '@mui/icons-material';
import {Lock as LockIcon } from '@mui/icons-material';
import {faUser } from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from "react-i18next";
import {useSnackbar} from '../../hooks/useSnackbar';
const ProfileForm = () => {
    const currentUser = auth.currentUser;
    const {t} = useTranslation();
    const {openSnackbar, SnackbarComponent} = useSnackbar();
    const [originalUserData, setOriginalUserData] = useState({});
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
                const docRef = doc(db, 'user-data', currentUser.uid); // Prilagodite ovo
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
    const handleSaveProfile = () => {
        if (editable) {
            if (userData.newPassword !== userData.confirmPassword) {
                openSnackbar('New password and confirm password must match.', 'error');
                return;
            }
            const nameRegex = /^[a-zA-Z]+$/;
            if (!userData.firstName || !nameRegex.test(userData.firstName)) {
                openSnackbar('First name is required and should contain only letters.', 'error');
                return;
            }
            if (!userData.lastName || !nameRegex.test(userData.lastName)) {
                openSnackbar('Last name is required and should contain only letters.', 'error');
                return;
            }
            const passwordRegex = /^[A-Za-z\d!@#$%^&*]{6,}$/;
            if (!passwordRegex.test(userData.newPassword) || !passwordRegex.test(userData.confirmPassword)) {
                openSnackbar('Password must be at least 6 characters.', 'error')
                return;
            }
            saveProfileChanges();
            setEditable(false);
            openSnackbar('Changes saved successfully!', 'success');
        }
    };
    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <Paper elevation={3}
                   sx={{border: '2px solid #8e44ad', padding: '16px',
                       display: 'flex', flexDirection: 'column', alignItems: 'center',
                       boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                   }}>
            <Typography variant="h4" gutterBottom>
                {t('Profile')}
            </Typography>
            <Avatar alt="User Avatar" src="https://th.bing.com/th/id/R.8e2c571ff125b3531705198a15d3103c?rik=gzhbzBpXBa%2bxMA&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fuser-png-icon-big-image-png-2240.png&ehk=VeWsrun%2fvDy5QDv2Z6Xm8XnIMXyeaz2fhR3AgxlvxAc%3d&risl=&pid=ImgRaw&r=0" sx={{ width: 60, height: 60 }} />
            <IconButton
                variant="contained"
                onClick={handleEditProfile}
                sx={{  marginLeft: 50, marginBottom: 2, backgroundColor: '#8e44ad', color: 'white' }}>
                <FontAwesomeIcon icon={faEdit} />
            </IconButton>
            <Container sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TextField className={editable ? "": "Mui-disabled"} label={t('First Name')}
                           value={userData.firstName} disabled={!editable}
                           sx = {{ marginRight: '5px'}}
                           onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                           InputProps={{startAdornment: (
                                   <InputAdornment position="start">
                                       <FontAwesomeIcon icon={faUser} />
                                   </InputAdornment>),}}
                />
                <TextField
                    className={editable ? "": "Mui-disabled"} label={t('Last Name')} value={userData.lastName}
                    disabled={!editable}
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
                    //onChange={(e) => handleInputChange('email', e.target.value)}
                    sx = {{marginTop: '20px', width:'495px'}}
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
                    value={userData.newPassword || ''}
                    disabled={!editable}
                    onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                    sx = {{marginTop: '20px', marginRight: '5px', width: '245px'}}
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
                    value={userData.confirmPassword || ''}
                    disabled={!editable}
                    onChange={(e) =>setUserData({ ...userData, confirmPassword: e.target.value })}
                    sx = {{marginTop: '20px', width: '245px'}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton size="small" edge="start">
                                    <LockIcon />
                                </IconButton>
                            </InputAdornment>),}}/>
            </Container>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                {editable && (
                    <Button variant="contained" onClick={handleSaveProfile}
                            style={{backgroundColor: '#8e44ad', color: 'white' }}>
                        Save
                    </Button>
                )}
                <SnackbarComponent/>
                {editable && (
                    <Button variant="contained" onClick={handleCancelEdit}
                            style={{ backgroundColor: '#8e44ad', color: 'white' }}>
                        Cancel
                    </Button>
                )}
            </Stack>
            </Paper>
        </Container>
    );
};

export default ProfileForm;