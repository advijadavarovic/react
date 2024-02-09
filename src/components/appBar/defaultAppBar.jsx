import {AppBar,Container, Toolbar,Typography, Button, Select, MenuItem,FormControl} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import {useNavigate} from "react-router-dom";
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from "react";

const CustomAppBar = () => {
    const navigate = useNavigate();
    const { t, i18n} = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
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
        <AppBar position="static" sx={{ backgroundColor: '#8e44ad' }}>
            <Container>
                <Toolbar>
                    <FlightIcon sx={{ marginRight: '5px' }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {t('Flights scanner')}
                    </Typography>
                    <div sx={{ '@media (max-width: 600px)': { flexDirection: 'row' } }}>
                    <FormControl>
                        <Select
                            labelId="language-selector-label"
                            id="language-selector"
                            value={i18n.language}
                            onChange={handleChangeLanguage}
                            sx={{ border: '1px solid white', color: 'white', height: '36px',
                                '@media (max-width: 600px)': {
                                    width: '120px',
                                    marginLeft: '9px', marginTop: '10px'
                                },}}
                        >
                            <MenuItem value="en">{t('EN')}</MenuItem>
                            <MenuItem value="ba">{t('BS')}</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        color="inherit"
                        variant="outlined"
                        sx={{ border: '1px solid white', marginLeft: '8px',  '@media (max-width: 600px)': {
                                width: '120px', margin: '10px'
                            }, }}
                        onClick={handleHomeClick}
                    >
                        {t('Home')}
                    </Button>
                    </div>
                    <div sx = {{ '@media (max-width: 600px)': { flexDirection: 'row' } }}>
                    <Button
                        color="inherit"
                        variant="outlined"
                        sx={{ border: '1px solid white', marginLeft: '8px', '@media (max-width: 600px)': {
                                width: '120px', marginTop: '10px'
                            },  }}
                        onClick={handleLoginClick}
                    >
                        {t('Login')}
                    </Button>
                    <Button color="inherit" variant="outlined"
                            sx={{ border: '1px solid white' , marginLeft: '8px','@media (max-width: 600px)': {
                                    width: '120px', margin: '10px'
                                }, }}
                            onClick={handleSignupClick}>
                        {t('Signup')}
                    </Button>
                    </div>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default CustomAppBar;