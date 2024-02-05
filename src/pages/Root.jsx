import MainNavigation from '../components/navigation/MainNavigation';
import DefaultAppBar from "../components/appBar/defaultAppBar";

function RootLayout() {

    return (
        <>
            <DefaultAppBar/>
            <MainNavigation />
        </>
    );
}

export default RootLayout;
