import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./home.css"


function NotAuthenticated() {

    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            // console.log("settimeout")
            navigate("/");
        }, 6000);
    })

    return (
        <div className="background">
            <div className="error-redirect">
                <h1>It looks like you don't have permission to access this page.</h1> 
                <h1>Redirecting in 6 seconds...</h1>
            </div>
            
        </div>
    )

}


export default NotAuthenticated;