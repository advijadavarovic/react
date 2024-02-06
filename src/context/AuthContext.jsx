import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged} from 'firebase/auth';
import {auth} from "../firebase";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, [auth]);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuthContext = () => {
    return useContext(AuthContext);
};