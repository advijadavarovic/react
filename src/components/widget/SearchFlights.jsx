import {Paper, Grid, Autocomplete, TextField, Button } from '@mui/material';
import {top10Airports} from '../constants/constants.js';
import axios from "axios";
import {addDoc, collection, getDocs, doc} from "firebase/firestore";
import {db} from "../../firebase";
import {parseSkyScrapperResponse} from '../parse/parsing.js';
import {useFlightContext} from "../../context/FlightContext";
import {AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {useAuthContext } from "../../context/AuthContext";
import {useSearchContext} from "../../context/SearchContext";
import {useTranslation} from "react-i18next";
import { v4 as uuidv4 } from 'uuid';
const SearchForm = () => {
    const {setItineraries, setPreviousSearchResults, setLoading,setError} = useFlightContext();
    const {fromValue, setFromValue, toValue, setToValue, departureValue, setDepartureValue,
           returnValue, setReturnValue, travelers, setTravelers} = useSearchContext();
    const user = useAuthContext();
    const { t } = useTranslation();
    const handleFromChange = (event, newValue) => {
        setFromValue(newValue);
    };
    const handleToChange = (event, newValue) => {
        setToValue(newValue);
    };
    const handleDepartureChange = (newValue) => {
        setDepartureValue(newValue);
    };
    const handleReturnChange = (newValue) => {
        setReturnValue(newValue);
    };
    const handleTravelersChange = (event) => {
        const newValue = event.target.value;
        setTravelers(newValue);
    };

    const refreshLastData = async () => {
        try {
            const userCollectionRef = collection(db, 'user-data');
            const userDocRef = doc(userCollectionRef, user.uid);
            const lastFlightsCollectionRef = collection(userDocRef, 'lastFlights');
            const lastSnapshot = await getDocs(lastFlightsCollectionRef);
            const userLastFlights = lastSnapshot.docs.map((doc) => doc.data());
            setPreviousSearchResults(userLastFlights);
        } catch (error) {
            console.error('Error refreshing user favorites:', error);
        }
    };
    const addFlightToCollection = async (flightsCollectionRef, parsedResult) => {
        try {
            await addDoc(flightsCollectionRef, {
                ...parsedResult,
            });
            console.log('Data added to main flights collection:', parsedResult);
        } catch (error) {
            console.error('Error adding data to main flights collection:', error);
        }
    };
    const addLastFlightToCollection = async (lastFlightsCollectionRef, parsedResult) => {
        try {
            await addDoc(lastFlightsCollectionRef, {
                ...parsedResult,
            });
            console.log('Data added to "last flights" collection:', parsedResult);
        } catch (error) {
            console.error('Error adding data to "last flights" collection:', error);
        }
    };
    const handleSearch = async () => {
        try {
            const fromDestination = fromValue.code;
            const toDestination = toValue.code;
            const userCollectionRef = collection(db, 'user-data');
            const userDocRef = doc(userCollectionRef, user.uid);
            const flightsCollectionRef = collection(userDocRef, 'flights');
            const lastFlightsCollectionRef = collection(userDocRef, 'lastFlights');
            const flightsSnapshot = await getDocs(flightsCollectionRef);
            let matchingFlightsFound = false;
            const newFlight = {
                id: uuidv4(),
                from: fromDestination,
                to: toDestination,
                departure: dayjs(departureValue).format('YYYY-MM-DD'),
                returnDate: dayjs(returnValue).format('YYYY-MM-DD'),
                travelers: travelers
            };
            await addLastFlightToCollection(lastFlightsCollectionRef, newFlight);
            if (flightsSnapshot.size > 0) {
                const flightsData = flightsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                const matchingFlights = findMatchingFlights(flightsData, fromDestination, toDestination);
                if (matchingFlights.length > 0) {
                    handleMatchingFlights(matchingFlights);
                    matchingFlightsFound = true;
                } else {
                    console.log('No matching flights in main flights collection.');
                }
            }
            if (!matchingFlightsFound) {
                console.log('Performing additional steps...');
                const response = await fetchExternalApiData(fromValue, toValue, departureValue, travelers);
                const parsedResult = parseSkyScrapperResponse(response.data);
                await addFlightToCollection(flightsCollectionRef, parsedResult);
                setItineraries(parsedResult.itineraries);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        refreshLastData();
    };
    const findMatchingFlights = (flightsData, fromDestination, toDestination) => {
        return flightsData.filter((flight) => {
            if (!flight.itineraries[0]) return false;
            return (
                flight.itineraries[0]?.origin === fromDestination &&
                flight.itineraries[0]?.destination === toDestination
            );
        });
    };
    const handleMatchingFlights = (matchingFlights) => {
        console.log('Using data from Firestore:', matchingFlights);
        const firstMatchingFlight = matchingFlights[0];
        const itineraries = firstMatchingFlight.itineraries;
        setItineraries(itineraries);
    };
    const fetchExternalApiData = async (fromValue, toValue, departureValue, travelers) => {
        setLoading(true);
        setError(null);
        try {
                const response = await axios.request({
                    method: 'GET',
                    url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
                    params: {
                        originSkyId: fromValue.code,
                        destinationSkyId: toValue.code,
                        originEntityId: fromValue.entityId,
                        destinationEntityId: toValue.entityId,
                        adults: travelers,
                        date: dayjs(departureValue).format('YYYY-MM-DD'),
                        returnDate: dayjs(returnValue).format('YYYY-MM-DD')
                    },
                    headers: {
                        'X-RapidAPI-Key': 'a46967745dmsh5ebefb243949953p10ec49jsnc5fdf9940886',
                        'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
                    },
                });
            if (response.data && response.data.length === 0) {
                setError('There is not available flights.');
                return null;
            }
            return response;
        } catch (error) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Paper sx={{boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
            <Grid container spacing={1}>
                <Grid item xs={4} md={4}>
                    <Autocomplete
                        disablePortal
                        id="from-combo-box"
                        options={top10Airports}
                        value={fromValue}
                        onChange={handleFromChange}
                        sx={{ marginLeft: '3%'}}
                        renderInput={(params) => <TextField {...params}  label={t('From')} />}
                    />
                </Grid>
                <Grid item xs={4} md={4}>
                    <Autocomplete
                        disablePortal
                        id="to-combo-box"
                        options={top10Airports}
                        value={toValue}
                        onChange={handleToChange}
                        renderInput={(params) => <TextField {...params}  label={t('To')}/>}
                    />
                </Grid>
                <Grid item xs={4} md={4}>
                    <TextField label = {t('Travelers')} type= "number"  value = {travelers}
                               inputProps={{min: 1}} onChange = {handleTravelersChange}/>
                </Grid>
                <Grid item xs={4} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker  label={t('Departure')}
                                             value={departureValue}
                                             format="YYYY-MM-DD"
                                             sx = {{marginLeft: '3%', marginBottom: '3%'}}
                                             onChange={(date) => handleDepartureChange(date)}
                                             renderInput={(params) => <TextField{...params} />}/>
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={4} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker  label="Return"
                                             value={returnValue}
                                             format="YYYY-MM-DD"
                                             onChange={(date) => handleReturnChange(date)}
                                             renderInput={(params) => <TextField{...params} />}/>
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Button onClick={handleSearch} variant="contained" sx = {{width: '50%', background: '#8e44ad'}}>
                        {t('Search')}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default SearchForm;