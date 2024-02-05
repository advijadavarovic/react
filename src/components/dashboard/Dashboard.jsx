import {Grid} from "@mui/material";
import 'firebase/firestore';
import {FlightProvider} from '../../context/FlightContext.jsx';
import MainTable from "../widget/MainTable";
import SearchFlights from "../widget/SearchFlights";
import FavoriteTable from "../widget/FavoriteFlights"
import LastedFlightsTable from "../widget/LastFlights";
import {AuthProvider} from '../../context/AuthContext';
import {SearchProvider} from "../../context/SearchContext";

function Dashboard() {
    return (
   <>
       <FlightProvider>
           <AuthProvider>
               <Grid container spacing={2}>
                   <Grid item xs={12} md={5} sx={{ marginTop: '5px',  position: 'fixed',marginLeft: '5px' }}>
                       <FavoriteTable />
                   </Grid>
                   <Grid item xs={12} md={7} sx={{ marginTop: '13px',  position: 'absolute', left: '520px' }}>
                       <SearchProvider>
                           <SearchFlights sx = {{zIndex: 1}}/>
                       </SearchProvider>
                   </Grid>
                   <Grid item xs={12} md={5} sx={{ marginTop: '13px',  position: 'fixed', top: '310px', marginLeft: '5px' }}>
                       <LastedFlightsTable />
                   </Grid>
                   <Grid item xs={12} md={7} sx={{ marginTop: '5px',  position: 'fixed', left: '520px', top: '190px'}}>
                       <MainTable />
                   </Grid>
               </Grid>
           </AuthProvider>
       </FlightProvider>
   </>
    );
}

export default Dashboard;