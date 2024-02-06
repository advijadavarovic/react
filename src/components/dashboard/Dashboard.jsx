import {Grid} from "@mui/material";
import 'firebase/firestore';
import {FlightProvider} from '../../context/FlightContext.jsx';
import MainTabel from "../widget/MainTabel";
import SearchFlights from "../widget/SearchFlights";
import FavoriteTabel from "../widget/FavoriteFlights"
import LastedFlightsTabel from "../widget/LastFlights";
import {AuthProvider} from '../../context/AuthContext';
import {SearchProvider} from "../../context/SearchContext";
import "./styles.css";
function Dashboard() {
    return (
   <>
       <FlightProvider>
           <AuthProvider>
               <Grid container spacing={2}>
                   <Grid item xs={12} sm={6} md={5} className="favorite">
                       <FavoriteTabel />
                   </Grid>
                   <Grid item xs={12} sm={6} md={7}  className="search">
                       <SearchProvider>
                           <SearchFlights sx={{ zIndex: 1 }} />
                       </SearchProvider>
                   </Grid>
                   <Grid item xs={12} sm={6} md={5} className="last" >
                       <LastedFlightsTabel />
                   </Grid>
                   <Grid item xs={12} sm={6} md={7} className="main-table">
                       <MainTabel />
                   </Grid>
               </Grid>
           </AuthProvider>
       </FlightProvider>
   </>
    );
}

export default Dashboard;
