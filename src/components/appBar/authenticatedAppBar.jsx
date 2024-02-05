import React, {useState} from 'react';
import {AppBar,Container, Toolbar,Typography, Button, Select, MenuItem,FormControl, IconButton} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import {useNavigate, useLocation} from "react-router-dom";
import {useTranslation} from 'react-i18next';
import {signOut} from "firebase/auth";
import {auth} from "../../firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
const AuthentificatedAppBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n} = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const isDashboardRoute = location.pathname === '/dashboard';
    const handleProfileClick = () => {
        navigate('/profile');
    };
    const handleLogoutClick = async () => {
        try {
            await signOut(auth);
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
        const selectedLanguage = event.target.value;
        setSelectedLanguage(selectedLanguage);
        i18n.changeLanguage(selectedLanguage);
    };
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
                        Flights scanner
                    </Typography>
                    <FormControl>
                        <Select
                            labelId="language-selector-label"
                            id="language-selector"
                            value={selectedLanguage}
                            onChange={handleChangeLanguage}
                            sx={{ border: '1px solid white', color: 'white', marginRight: '8px', height: '36px', width: '85px'}}
                        >
                            <MenuItem value="en">EN</MenuItem>
                            <MenuItem value="ba">BA</MenuItem>
                        </Select>
                    </FormControl>
                    {isDashboardRoute && (
                        <>
                            <Button color="inherit"  variant="outlined"
                                    sx={{ border: '1px solid white', marginRight: '8px' }}
                                    onClick={handleProfileClick}>
                                {t('Profile')}
                            </Button>
                            <Button color="inherit"  variant="outlined"
                                    sx={{ border: '1px solid white' }}
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