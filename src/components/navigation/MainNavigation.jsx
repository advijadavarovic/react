import {Typography} from "@mui/material";
import './MainNavigation.module.css'
function MainNavigation() {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <img
                    src="https://get.pxhere.com/photo/wing-cloud-sky-sunrise-sunset-atmosphere-airplane-plane-aircraft-vehicle-airline-aviation-flight-airliner-jet-aircraft-air-travel-atmosphere-of-earth-narrow-body-aircraft-107966.jpg"
                    alt="Background"
                    style={{ width: '100%', margin: 'auto' }}
                />
                <Typography variant="h3" component="div" color="white" style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', fontSize: '4vw' }}>
                    Find the next place to visit!
                </Typography>
                <Typography variant="body1" component="div" color="white" style={{ position: 'absolute', top: '80%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', fontSize: '2vw' }} >
                    Discover amazing places at exclusive deals!
                </Typography>
            </div>
        </>
    );
}

export default MainNavigation;
