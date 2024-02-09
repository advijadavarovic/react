import React, {useEffect, useState} from 'react';
import {AppBar,Container, Toolbar,Typography, Button, Select, MenuItem,FormControl, IconButton} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import {useNavigate, useLocation} from "react-router-dom";
import {useTranslation} from 'react-i18next';
import {signOut} from "firebase/auth";
import {auth} from "../../firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';

const AuthentificatedAppBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
    const { t, i18n} = useTranslation();
    const isDashboardRoute = location.pathname === '/dashboard';
    const handleProfileClick = () => {
        navigate('/profile');
    };
    const handleLogoutClick = async () => {
        try {
            await signOut(auth);
            Cookies.remove('authToken');
            console.log('User successfully logged out.');
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    };
    const handleBackClick = () => {
        navigate('/dashboard');
    };
    const handleChangeLanguage = (event) => {
        const newSelectedLanguage = event.target.value;
        i18n.changeLanguage(newSelectedLanguage).then((t) => {
            console.log('Language changed to:', newSelectedLanguage);
            setSelectedLanguage(newSelectedLanguage);
            localStorage.setItem('selectedLanguage', newSelectedLanguage);
        });
    };
    useEffect(() => {
        i18n.changeLanguage(selectedLanguage);
    }, [selectedLanguage]);

    return (
        <AppBar position="static"  sx={{ backgroundColor: '#8e44ad' }}>
            <Container>
                <Toolbar>
                    { !isDashboardRoute && (
                    <IconButton onClick={handleBackClick} sx={{ marginRight: '16px',color: 'white' }}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </IconButton>
                    )}
                    <FlightIcon />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {t('Flights scanner')}
                    </Typography>
                    <FormControl>
                        <Select
                            labelId="language-selector-label"
                            id="language-selector"
                            value={i18n.language}
                            onChange={handleChangeLanguage}
                            sx={{ border: '1px solid white', color: 'white', height: '36px', width: '85px', '@media (max-width: 600px)': {
                                    width: '75px', marginRight: '28px'
                                },}}
                        >
                            <MenuItem value="en">{t('EN')}</MenuItem>
                            <MenuItem value="ba">{t('BS')}</MenuItem>
                        </Select>
                    </FormControl>
                    {isDashboardRoute && (
                        <>
                            <Button color="inherit"  variant="outlined"
                                    sx={{ border: '1px solid white', marginLeft: '8px' }}
                                    onClick={handleProfileClick}>
                                {t('Profile')}
                            </Button>
                            <Button color="inherit"  variant="outlined"
                                    sx={{ border: '1px solid white',  marginLeft: '8px'  }}
                                    onClick={handleLogoutClick}>
                                {t('Logout')}
                            </Button>
                        </>
                       )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default AuthentificatedAppBar;



