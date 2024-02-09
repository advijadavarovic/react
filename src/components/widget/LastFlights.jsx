import {TableContainer, Table, TableHead,TableRow, TableBody, TableCell, Paper, Typography} from '@mui/material';
import { useFlightContext } from '../../context/FlightContext';
import {useEffect, useState} from "react";
import ArrowDownwardSharpIcon from '@mui/icons-material/ArrowDownwardSharp';
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp';
import {collection, doc, getDocs} from "firebase/firestore";
import {db} from "../../firebase";
import {useAuthContext} from "../../context/AuthContext";
import { useTranslation } from 'react-i18next';
import useSort from "../../hooks/useSort";
const LastedFlightsTabel= () => {
    const {previousSearchResults, setPreviousSearchResults} = useFlightContext();
    const [sortedLastData, setSortedLastData] = useState([]);
    const {sortOrder, sortColumn, setSortColumn, setSortOrder, sortData} = useSort();
    const user = useAuthContext();
    const { t, i18n } = useTranslation();
    const columns = () =>
        [
            {id: 'from', name: t('From'), sortable: false},
            {id: 'to', name: t('To'), sortable: false},
            {id: 'departure', name: t('Departure'), sortable: true},
            {id: 'returnDate', name: t('Return'), sortable: true},
            {id: 'travelers', name: t('Travelers')}
        ];
    const handleSort = (columnId) => {
        setSortColumn(columnId);
        const newSortOrder = sortData(previousSearchResults, columnId, sortOrder, setSortedLastData);
        setSortOrder(newSortOrder);
    };
        useEffect(() => {
        const loadLastSearches = async () => {
            try {
                const userCollectionRef = collection(db, 'user-data');
                const userDocRef = doc(userCollectionRef, user.uid);
                const lastFlightsCollectionRef = collection(userDocRef, 'lastFlights');
                const lastFlightsSnapshot = await getDocs(lastFlightsCollectionRef);
                const lastSearchResults = lastFlightsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
                setPreviousSearchResults(lastSearchResults);
            } catch (error) {
                console.error('Error loading last searches:', error);
            }
        };
        if (user) {
            loadLastSearches();
        }
    }, [user]);
    return (
        <Paper sx={{boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
            <Typography variant="h10" sx = {{marginLeft: '5px', color: '#8e44ad'}}>{t('Last searched flights')}</Typography>
            <TableContainer sx={{ maxHeight: 240, overflowY: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns().map((column) => (
                                <TableCell key={column.id} onClick={() => handleSort(column.id)} align="center">
                                    {column.name}  {column.sortable && sortColumn === column.id && (sortOrder === 'asc' ?
                                    <  ArrowUpwardSharpIcon sx={{ fontSize: '15px' }}  /> : <ArrowDownwardSharpIcon sx={{ fontSize: '15px' }}/>)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(sortedLastData.length > 0 ? sortedLastData : previousSearchResults).map((itinerary) => (
                            <TableRow key={itinerary.id}>
                                <TableCell align="center">{itinerary.from}</TableCell>
                                <TableCell align="center">{itinerary.to}</TableCell>
                                <TableCell align="center">{itinerary.departure}</TableCell>
                                <TableCell align="center">{itinerary.returnDate}</TableCell>
                                <TableCell align="center">{itinerary.travelers}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
export default LastedFlightsTabel;