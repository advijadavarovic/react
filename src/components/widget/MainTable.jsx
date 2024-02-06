import React, {useState} from 'react';
import {Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, IconButton, CircularProgress, Box} from "@mui/material";
import {useFlightContext} from '../../context/FlightContext';
import ArrowDownwardSharpIcon from '@mui/icons-material/ArrowDownwardSharp';
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import {addDoc, collection, doc, getDocs} from "firebase/firestore";
import {db} from "../../firebase";
import {useAuthContext} from "../../context/AuthContext";
import {useTranslation} from "react-i18next";
import {convertCurrency} from "../../translate/i18n";
import useSort from "../../hooks/useSort";
function MainTable() {
    const { itineraries, favorites, setFavoritesData, setFavorites, loading, error} = useFlightContext();
    const [sortedData, setSortedData] = useState([]);
    const {sortOrder, sortColumn, setSortColumn, setSortOrder, sortData} = useSort();
    const user = useAuthContext();
    const { t } = useTranslation();
    const mainColumns = [
        { id: 'company', name: t('Company'), sortable: false },
        { id: 'departure', name: t('Departure'), sortable: false },
        { id: 'arrival', name: t('Arrival'), sortable: false },
        { id: 'duration', name: t('Duration'), sortable: true },
        { id: 'direct', name: t('Direct'), sortable: true },
        { id: 'price', name: t('Price'), sortable: true },
        { id: 'favorite', name: ' ' },
    ];
    const handleSort = (columnId) => {
        setSortColumn(columnId);
        const newSortOrder = sortData(itineraries, columnId, sortOrder, setSortedData);
        setSortOrder(newSortOrder);
    };
    const refreshFavoritesData = async () => {
        try {
            const userCollectionRef = collection(db, 'user-data');
            const userDocRef = doc(userCollectionRef, user.uid);
            const favoritesCollectionRef = collection(userDocRef, 'favorites');
            const favoritesSnapshot = await getDocs(favoritesCollectionRef);
            const userFavorites = favoritesSnapshot.docs.map((doc) => doc.data());
            setFavoritesData(userFavorites);
            console.log(userFavorites);
        } catch (error) {
            console.error('Error refreshing user favorites:', error);
        }
    };
    const handleToggleFavorite = async (itineraryId) => {
        const userCollectionRef = collection(db, 'user-data');
        const userDocRef = doc(userCollectionRef, user.uid);
        const favoritesCollectionRef = collection(userDocRef, 'favorites');
        const itinerary = itineraries.find((itinerary) => itinerary.id === itineraryId);
        if (favorites.includes(itineraryId)) {
            return;
        }
        const newFavoritesData = {
            id: itinerary.id,
            flights: itinerary.displayCode,
            time: itinerary.departure + '-' + itinerary.arrival,
            duration: itinerary.duration,
            price: itinerary.price,
        };
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(itineraryId)) {
                return prevFavorites;
            } else {
                return [...prevFavorites, itineraryId];
            }
        });
            await addDoc(favoritesCollectionRef, {
                ...newFavoritesData,
            });
        refreshFavoritesData();
    };
    return (
        <Paper sx = {{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress color = "secondary"/>
                </Box>
            ) :  error ? (
                <Box textAlign="center" p={2}>
                    {error}
                </Box>
            ):(
            <TableContainer sx={{ maxHeight: 385, overflowY: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {mainColumns.map((column)=> (
                                <TableCell key = {column.id} onClick={() => handleSort(column.id)}  align="center">
                                    {column.name} {column.sortable && sortColumn === column.id && (sortOrder === 'asc' ?
                                    <  ArrowUpwardSharpIcon sx={{ fontSize: '15px' }}  /> : <ArrowDownwardSharpIcon sx={{ fontSize: '15px' }}/>)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(sortedData.length > 0 ? sortedData : itineraries).map((itinerary) => (
                            <TableRow key = {itinerary.id}>
                                <TableCell  align="center">
                                    <img src={itinerary.company} alt={itinerary.name}  style={{ width: '30px', height: '30px' }} />
                                    <div>
                                        {itinerary.name}
                                    </div>
                                </TableCell>
                                <TableCell  align="center">{itinerary.departure}</TableCell>
                                <TableCell  align="center">{itinerary.arrival}</TableCell>
                                <TableCell  align="center">
                                    <div>
                                        {itinerary.duration}
                                    </div>
                                    <div>
                                        {itinerary.displayCode}
                                    </div>
                                </TableCell>
                                <TableCell  align="center">{itinerary.direct === 0 ? 'Yes' : 'No'}</TableCell>
                                <TableCell  align="center">{convertCurrency(itinerary.price, 'USD', 'BAM')}{''}{'BAM'}</TableCell>
                                <TableCell  align="center">
                                    <IconButton onClick={() => handleToggleFavorite(itinerary.id)}>
                                        {favorites.includes(itinerary.id) ? <ThumbUpAltIcon color="secondary" /> : <ThumbUpOffAltIcon />}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
                )}
        </Paper>
    );
}

export default MainTable;