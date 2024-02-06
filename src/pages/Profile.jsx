import ProfileForm from "../components/profile/ProfileForm";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {auth} from "../firebase";
import AuthentificatedAppBar from "../components/appBar/authenticatedAppBar";

function ProfilePage() {
    const navigate = useNavigate();
    useEffect(() => {
        const checkAuthState = () => {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                navigate('/login');
            }
        };
        const unsubscribe = auth.onAuthStateChanged(checkAuthState);
        checkAuthState();

        return () => unsubscribe();
    }, [navigate]);
    return (
        <>
            <AuthentificatedAppBar/>
            <ProfileForm />
        </>
    );
}

export default ProfilePage;
