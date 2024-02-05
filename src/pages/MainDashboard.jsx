import Dashboard from "../components/dashboard/Dashboard";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {auth} from "../firebase";
import AuthentificatedAppBar from "../components/appBar/authenticatedAppBar";

function DashboardPage() {

    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (!currentUser) {
                navigate('/login');
            } else {
                navigate('/dashboard');
            }
        });

        return () => unsubscribe();
    }, [navigate]);
    return (
        <>
                <AuthentificatedAppBar/>
                <Dashboard />
        </>

    );
}

export default DashboardPage;
