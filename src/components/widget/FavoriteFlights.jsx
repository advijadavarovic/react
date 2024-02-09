import {TableContainer, Table, TableHead,TableRow, TableBody, TableCell, Paper, IconButton, Typography} from '@mui/material';
import { useFlightContext } from '../../context/FlightContext';
import ArrowDownwardSharpIcon from '@mui/icons-material/ArrowDownwardSharp';
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp';
import React, {useEffect, useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import {db} from "../../firebase";
import {useAuthContext} from "../../context/AuthContext";
import {collection, doc, deleteDoc, query, getDocs, where} from "firebase/firestore";
import {useTranslation} from 'react-i18next';
import {convertCurrency} from "../../utils/converting";
import useSort from "../../hooks/useSort";

const FavoriteTabel = () => {
    const {setFavorites,setFavoritesData, favoritesData} = useFlightContext();
    const [sortedFavData, setSortedFavData] = useState([]);
    const {sortOrder, sortColumn, setSortColumn, setSortOrder, sortData} = useSort();
    const user = useAuthContext();
    const {t} = useTranslation();
    const columns = [
        { id: 'more', name: ' ', sortable: false },
        { id: 'flights', name: t('Flights'), sortable: false },
        { id: 'date', name: t('Date'), sortable: false },
        { id: 'time', name: t('Time'), sortable: false },
        { id: 'duration', name: t('Duration'), sortable: true },
        { id: 'price', name: t('Price'), sortable: true },
        { id: 'trash', name: ' ' }
    ];
    const handleSort = (columnId) => {
        setSortColumn(columnId);
        const newSortOrder = sortData(favoritesData, columnId, sortOrder, setSortedFavData);
        setSortOrder(newSortOrder);
    };
    const handleDeleteFavorite = async (itineraryId) => {
        try {
            const userCollectionRef = collection(db, 'user-data');
            const userDocRef = doc(userCollectionRef, user.uid);
            const favoritesCollectionRef = collection(userDocRef, 'favorites');
            const q = query(favoritesCollectionRef, where('id', '==', itineraryId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== itineraryId));
            setFavoritesData((prevFavoritesData) => prevFavoritesData.filter((item) => item.id !== itineraryId));
            console.log('Favorite(s) with ID ' + itineraryId + ' deleted successfully.');
        } catch (error) {
            console.error('Error deleting favorite(s):', error);
        }
    };
    const loadUserFavorites = async () => {
        try {
            const userCollectionRef = collection(db, 'user-data');
            const userDocRef = doc(userCollectionRef, user.uid);
            const favoritesCollectionRef = collection(userDocRef, 'favorites');
            const favoritesSnapshot = await getDocs(favoritesCollectionRef);
            const userFavorites = favoritesSnapshot.docs.map((doc) => doc.data());
            setFavoritesData(userFavorites);
        } catch (error) {
            console.error('Error loading user favorites:', error);
        }
    };
    useEffect(() => {
        if (user) {
            loadUserFavorites();
        }
    }, [user]);

    const [expandedRow, setExpandedRow] = useState(null);
    const handleRowClick = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };
    return (
        <Paper sx={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}>
            <Typography variant="h10" sx = {{marginLeft: '5px', color: '#8e44ad'}}>{t('Favorite flights')}</Typography>
                <TableContainer sx={{ maxHeight: 240, overflowY: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} onClick={() => handleSort(column.id)} align="center">
                                        {column.name}  {column.sortable && sortColumn === column.id && (sortOrder === 'asc' ? <  ArrowUpwardSharpIcon sx={{ fontSize: '15px' }}  /> : <ArrowDownwardSharpIcon sx={{ fontSize: '15px' }} />)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(sortedFavData.length > 0 ? sortedFavData : favoritesData)
                                .map((itinerary) => (
                                    <TableRow key={itinerary.id}>
                                        <TableCell  onClick={() => handleRowClick(itinerary.id)}>
                                            {expandedRow === itinerary.id ? '<' : '>'}
                                        </TableCell>
                                        <TableCell  align="center">
                                            {expandedRow === itinerary.id ?
                                                (<div>{itinerary.flightsReturn}</div>) :
                                                (<div>{itinerary.flights}</div>)}
                                        </TableCell>
                                        <TableCell  align="center">
                                            {expandedRow === itinerary.id ?
                                                (<div>{itinerary.dateReturn}</div>) :
                                                (<div>{itinerary.date}</div>)}
                                        </TableCell>
                                        <TableCell  align="center">
                                            {expandedRow === itinerary.id ?
                                                (<div>{itinerary.timeReturn}</div>) :
                                                (<div>{itinerary.time}</div>)}
                                        </TableCell>
                                        <TableCell  align="center">
                                            {expandedRow === itinerary.id ?
                                                (<div>{itinerary.durationReturn}</div>) :
                                                (<div>{itinerary.duration}</div>)}
                                        </TableCell>
                                        <TableCell  align="center">{convertCurrency(itinerary.price, 'USD', 'BAM')}{''}{'BAM'}</TableCell>
                                        <TableCell  align="center">
                                            <IconButton onClick = {() => handleDeleteFavorite(itinerary.id)}>
                                               <DeleteIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
        </Paper>
    );
};

export default FavoriteTabel;