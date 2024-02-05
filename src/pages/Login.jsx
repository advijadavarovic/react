import LoginForm from "../components/login/LoginForm";
import DefaultAppBar from "../components/appBar/defaultAppBar";
import '../translate/i18n';
export default function SignIn() {

    return (
        <>
            <DefaultAppBar/>
            <LoginForm />
        </>
    );
}