import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Authentification = () => {
    const { loginWithRedirect } = useAuth0();

    return <button onClick={() => loginWithRedirect()}>Authentification</button>;
};

export default Authentification;