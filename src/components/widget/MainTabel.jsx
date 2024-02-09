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
import {convertCurrency} from "../../utils/converting";
import useSort from "../../hooks/useSort";
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';


function MainTabel() {
    const { itineraries, favorites, setFavoritesData, setFavorites, loading, error} = useFlightContext();
    const [sortedData, setSortedData] = useState([]);
    const {sortOrder, sortColumn, setSortColumn, setSortOrder, sortData} = useSort();
    const user = useAuthContext();
    const { t } = useTranslation();
    const mainColumns = [
        { id: 'more', name: t(' '), sortable: false },
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
            flightsReturn: itinerary.displayCodeReturn,
            date: itinerary.date,
            dateReturn: itinerary.dateReturn,
            time: itinerary.departure + '-' + itinerary.arrival,
            timeReturn: itinerary.departureReturn + '-' + itinerary.arrivalReturn,
            duration: itinerary.duration,
            durationReturn: itinerary.durationReturn,
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
    const [expandedRow, setExpandedRow] = useState(null);

    const handleRowClick = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
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
            <TableContainer sx={{ maxHeight: 388, overflowY: 'auto' }}>
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
                                <TableCell  onClick={() => handleRowClick(itinerary.id)}>
                                    {expandedRow === itinerary.id ? '<' : '>'}
                                </TableCell>
                                <TableCell  align="center">
                                    <img src={itinerary.company} alt={itinerary.name}  style={{ width: '30px', height: '30px' }} />
                                    <div>
                                        {itinerary.name}
                                    </div>
                                </TableCell>
                                <TableCell align="center">
                                    {expandedRow === itinerary.id ? (
                                        <div>
                                            <div>
                                                <WestIcon />
                                            </div>
                                            <div>{itinerary.departureReturn}</div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div>
                                                <EastIcon />
                                            </div>
                                            <div>{itinerary.departure}</div>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell  align = "center">
                                    {expandedRow === itinerary.id ? (
                                        <div>
                                            <div>
                                                <WestIcon />
                                            </div>
                                            <div>{itinerary.arrivalReturn}</div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div>
                                                <EastIcon />
                                            </div>
                                            <div>{itinerary.arrival}</div>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell  align="center">
                                    {expandedRow === itinerary.id ? (
                                        <div>
                                            <div>{itinerary.durationReturn}</div>
                                            <div>{itinerary.displayCodeReturn}</div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div>{itinerary.duration}</div>
                                            <div>{itinerary.displayCode}</div>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell  align="center">{itinerary.direct === 0 ? 'Yes' : 'No'}</TableCell>
                                <TableCell  align="center">
                                    <div>
                                        {convertCurrency(itinerary.price, 'USD', 'BAM')}{''}{'BAM'}
                                    </div>
                                    <div>
                                        <SyncAltIcon/>
                                    </div>
                                </TableCell>
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

export default MainTabel;