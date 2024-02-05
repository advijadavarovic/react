import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase";
export const onSubmit = (data) => {
    const { email, password } = data;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential);
            window.location.href = '/dashboard';
        }).catch((error) => {
        console.log(error);
    });
    console.log(data);
};