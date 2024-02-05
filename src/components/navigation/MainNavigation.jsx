import {Typography} from "@mui/material";
import './MainNavigation.module.css'
function MainNavigation() {
    return (
        <>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                    src="https://get.pxhere.com/photo/wing-cloud-sky-sunrise-sunset-atmosphere-airplane-plane-aircraft-vehicle-airline-aviation-flight-airliner-jet-aircraft-air-travel-atmosphere-of-earth-narrow-body-aircraft-107966.jpg"
                    alt="Background"
                    style={{ width: '100%', height: 'auto' }}
                />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white' }}>
                    <Typography variant="h3" component="div">
                        Find the next place to visit!
                    </Typography>
                    <Typography variant="body1" component="div">
                        Discover amazing places at exclusive deals!
                    </Typography>
                </div>
            </div>
        </>
    );
}

export default MainNavigation;
