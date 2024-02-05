import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import  {Button,Container} from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {db} from "../../firebase";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {getDoc, doc, updateDoc} from "firebase/firestore";
import {getAuth, onAuthStateChanged } from "firebase/auth";
import {IconButton} from "@mui/material";
import {InputAdornment} from '@mui/material';
import {Email as EmailIcon } from '@mui/icons-material';
import {Lock as LockIcon } from '@mui/icons-material';
import {faUser } from '@fortawesome/free-solid-svg-icons';
import Avatar from "@mui/material/Avatar";
import {useTranslation} from "react-i18next";
import { useForm} from 'react-hook-form';
import "../../translate/i18n";
const ProfileForm = () => {
    const [editable, setEditable] = useState(false);
    const { control, handleSubmit, setError, formState: { errors } } = useForm();
    const [originalUserData, setOriginalUserData] = useState({});
    const {t} = useTranslation();
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        newPassword:'',
        confirmPassword: ''
    });
    const auth = getAuth();
    let unsubscribe;
    const fetchData = async (uid) => {
        const docRef = doc(db, "user-data", uid);
        const docSnap = await getDoc(docRef);
        console.log("Document data:", docSnap.data());
        if (!editable) {
            setUserData(docSnap.data());
            setOriginalUserData(docSnap.data());
        }
    };
    useEffect(() => {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                fetchData(uid);
            }
        });
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [editable]);
    const handleInputChange = (name, value) => {
        if (name === 'newPassword' || name === 'confirmPassword') {
            setUserData((prevUserData) => ({
                ...prevUserData,
                [name]: value,
            }));
        } else {
            setUserData((prevUserData) => ({
                ...prevUserData,
                [name]: value,
            }));
        }
    };
    const saveProfileChanges = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const uid = user.uid;
            const userDocRef = doc(db, 'user-data', uid);
            try {
                await updateDoc(userDocRef, {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    //email: userData.email,
                    password: userData.confirmPassword
                });
                alert('Successfully!');
            } catch (error) {
                console.error('ERROR:', error.message);
            }}};
    const handleEditProfile = () => {
        setEditable(true);
        setOriginalUserData({ ...userData });
    };

    const handleSaveProfile = () => {
        if (editable) {
            if (userData.newPassword !== userData.confirmPassword) {
                alert('New password and confirm password must match.');
                return;
            }
            saveProfileChanges();
            setEditable(false);
        }
    };
    const handleCancelEdit = () => {
        setUserData({ ...originalUserData });
        setEditable(false);
    };
    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
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
                           onChange={(e) => handleInputChange('firstName', e.target.value)}
                           InputProps={{startAdornment: (
                                   <InputAdornment position="start">
                                       <FontAwesomeIcon icon={faUser} />
                                   </InputAdornment>),}}
                />
                <TextField
                    className={editable ? "": "Mui-disabled"} label={t('Last Name')} value={userData.lastName}
                    disabled={!editable} onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                    onChange={(e) => handleInputChange('email', e.target.value)}
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
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
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
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
                {editable && (
                    <Button variant="contained" onClick={handleCancelEdit}
                            style={{ backgroundColor: '#8e44ad', color: 'white' }}>
                        Cancel
                    </Button>
                )}
            </Stack>
        </Container>
    );
};

export default ProfileForm;