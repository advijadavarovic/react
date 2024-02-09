import {Grid} from "@mui/material";
import 'firebase/firestore';
import {FlightProvider} from '../../context/FlightContext.jsx';
import MainTabel from "../widget/MainTabel";
import SearchFlights from "../widget/SearchFlights";
import FavoriteTabel from "../widget/FavoriteFlights"
import LastedFlightsTabel from "../widget/LastFlights";
import {AuthProvider} from '../../context/AuthContext';
import {SearchProvider} from "../../context/SearchContext";
function Dashboard() {
    return (
   <>
       <FlightProvider>
           <AuthProvider>
               <Grid container spacing={1}>
                   <Grid item xs={12} sm={6} md={5} sx={{ marginTop: '5px' }}>
                       <FavoriteTabel />
                       <Grid sx = {{ marginTop: '5px'}}>
                           <LastedFlightsTabel />
                       </Grid>
                   </Grid>

                   <Grid item xs={12} sm={6} md={7} sx={{ marginTop: '13px' }}>
                       <SearchProvider>
                           <SearchFlights sx={{ zIndex: 1 }} />
                       </SearchProvider>
                       <Grid sx = {{ marginTop: '5px'}}>
                           <MainTabel/>
                       </Grid>
                   </Grid>
               </Grid>
           </AuthProvider>
       </FlightProvider>
   </>
    );
}

export default Dashboard;
