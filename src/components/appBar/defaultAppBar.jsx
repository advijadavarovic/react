import React, {useState} from 'react';
import {AppBar,Container, Toolbar,Typography, Button, Select, MenuItem,FormControl} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import {useNavigate} from "react-router-dom";
import {useTranslation} from 'react-i18next';

const CustomAppBar = () => {
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const { t, i18n} = useTranslation("translation");
    const handleLoginClick = () => {
        navigate('/login');
    };
    const handleSignupClick = () => {
        navigate('/signup');
    };
    const handleHomeClick = () => {
        navigate('/');
    };

    const handleChangeLanguage = (event) => {
        const selectedLanguage = event.target.value;
        setSelectedLanguage(selectedLanguage);
        i18n.changeLanguage(selectedLanguage);
    };
    return (
        <AppBar position="static" sx={{ backgroundColor: '#8e44ad' }}>
            <Container>
                <Toolbar>
                    <FlightIcon sx={{ marginRight: '5px' }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Flights scanner
                    </Typography>
                    <FormControl>
                        <Select
                            labelId="language-selector-label"
                            id="language-selector"
                            value={selectedLanguage}
                            onChange={handleChangeLanguage}
                            sx={{ border: '1px solid white', color: 'white', marginRight: '8px', height: '37px'}}
                        >
                            <MenuItem value="en">EN</MenuItem>
                            <MenuItem value="ba">BA</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        color="inherit"
                        variant="outlined"
                        sx={{ border: '1px solid white', marginRight: '8px' }}
                        onClick={handleHomeClick}
                    >
                        {t('Home')}
                    </Button>
                    <Button
                        color="inherit"
                        variant="outlined"
                        sx={{ border: '1px solid white', marginRight: '8px' }}
                        onClick={handleLoginClick}
                    >
                        {t('Login')}
                    </Button>
                    <Button color="inherit" variant="outlined"
                            sx={{ border: '1px solid white' }}
                            onClick={handleSignupClick}>
                        {t('Signup')}
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default CustomAppBar;