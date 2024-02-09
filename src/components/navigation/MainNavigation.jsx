import {Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
function MainNavigation() {
    const {t} = useTranslation();
    return (
        <> <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', overflow: 'hidden'}}>
            <img
                src="https://get.pxhere.com/photo/wing-cloud-sky-sunrise-sunset-atmosphere-airplane-plane-aircraft-vehicle-airline-aviation-flight-airliner-jet-aircraft-air-travel-atmosphere-of-earth-narrow-body-aircraft-107966.jpg"
                alt="Background"
                style={{   width: '100vw', height: '150vh', objectFit: 'cover', }}
            />
            <Typography variant="h3" component="div" color="white" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                {t('Find the next place to visit!')}
            </Typography>
            <Typography variant="body1" component="div" color="white" style={{ position: 'absolute', top: '65%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}} >
                {t('Discover amazing places at exclusive deals!')}
            </Typography>
        </div>

        </>
    );
}

export default MainNavigation;
