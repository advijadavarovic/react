import {TableContainer, Table, TableHead,TableRow, TableBody, TableCell, Paper, IconButton, Typography} from '@mui/material';
import { useFlightContext } from '../../context/FlightContext';
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {useEffect, useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import {db} from "../../firebase";
import {useAuthContext} from "../../context/AuthContext";
import {collection, doc, deleteDoc, query, getDocs, where} from "firebase/firestore";
import {useTranslation} from 'react-i18next';
import {convertCurrency} from "../../translate/i18n";
import useSort from "../../hooks/useSort";
import i18n from 'i18next';
const FavoriteTable = () => {
    const {setFavorites,setFavoritesData, favoritesData} = useFlightContext();
    const [sortedFavData, setSortedFavData] = useState([]);
    const {sortOrder, sortColumn, setSortColumn, setSortOrder, sortData} = useSort();
    const user = useAuthContext();
    const {t, i18n} = useTranslation();
    const columns = [
        { id: 'flights', name: t('Flights'), sortable: false },
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
    return (
        <Paper sx={{ width: '525px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h10" sx = {{marginLeft: '5px', color: '#8e44ad'}}>Favorite flights</Typography>
                <TableContainer sx={{ maxHeight: 240, overflowY: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} onClick={() => handleSort(column.id)} align="center">
                                        {column.name}  {column.sortable && sortColumn === column.id && (sortOrder === 'asc' ? < ArrowDropUpIcon /> : <ArrowDropDownIcon/>)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(sortedFavData.length > 0 ? sortedFavData : favoritesData)
                                .map((itinerary) => (
                                    <TableRow key={itinerary.id}>
                                        <TableCell  align="center">{itinerary.flights}</TableCell>
                                        <TableCell  align="center">{itinerary.time}</TableCell>
                                        <TableCell  align="center">{itinerary.duration}</TableCell>
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

export default FavoriteTable;