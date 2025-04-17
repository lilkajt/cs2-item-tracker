import useAuthStore from "@/store/useAuthStore";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type AuthGuardProps = {
    children: ReactNode;
    redirectAuthenticatedTo: string;
}

function AuthGuard({children, redirectAuthenticatedTo}: AuthGuardProps) {
    const {isLoggedIn} = useAuthStore();
    const navigate = useNavigate();

    useEffect(()=> {
        if (isLoggedIn){
            navigate(redirectAuthenticatedTo);
        }
    }, [isLoggedIn, navigate, redirectAuthenticatedTo]);
    return isLoggedIn? null :<>{children}</>;
}

export default AuthGuard;