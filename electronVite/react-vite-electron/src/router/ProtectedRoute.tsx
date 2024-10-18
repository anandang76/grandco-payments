import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {

    if(!localStorage.getItem('customer_id')){
        return <Navigate to ="/auth/login" />
    }

    return children;
}

export default ProtectedRoute;