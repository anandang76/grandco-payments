import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

const ProtectedRoute = ({children, routeName}: any) => {
    const navigate = useNavigate();

    if(!sessionStorage.getItem('accessToken')){
        return <Navigate to ="/login" />
    } else {
        const storedUserDetails = useSelector((state: IRootState) => state.themeConfig).userDetails;
        // const userDetails: any = localStorage.getItem('userDetails');
        const userDetails: any = storedUserDetails != null ? JSON.parse(storedUserDetails) : {};
        let userRole = "";

        if(userDetails){
            userRole = userDetails?.userRole.replaceAll(' ', '').toLowerCase();
        }

        if((userRole == 'admin') && routeName == 'device-management'){
            navigate('/dashboard');
            return;
        }

        if(userRole == 'user' && (routeName == 'user' || routeName == 'report' || routeName == 'device-management' || routeName.includes('device-config') || routeName == 'email-config' || routeName.includes('sensor'))){
            navigate('/dashboard');
            return;
        }

        if(userRole != 'systemspecialist' && (routeName == "sensor/:locationID/:branchID/:facilityID/:buildingID/:floorID/:zoneID/:deviceID")){
            navigate('/dashboard');
            return;
        }

        if(userRole != "user"){
            if(routeName == 'device-config'){
                let targetRoute = '/device-config';
                if(userDetails.zoneID){
                    navigate(`${targetRoute}/${userDetails.locationID}/${userDetails.branchID}/${userDetails.facilityID}/${userDetails.buildingID}/${userDetails.floorID}/${userDetails.zoneID}`);
                } else if(userDetails.floorID){
                    navigate(`${targetRoute}/${userDetails.locationID}/${userDetails.branchID}/${userDetails.facilityID}/${userDetails.buildingID}/${userDetails.floorID}`);
                } else if(userDetails.buildingID){
                    navigate(`${targetRoute}/${userDetails.locationID}/${userDetails.branchID}/${userDetails.facilityID}/${userDetails.buildingID}`);
                } else if(userDetails.facilityID){
                    navigate(`${targetRoute}/${userDetails.locationID}/${userDetails.branchID}/${userDetails.facilityID}`);
                } else if(userDetails.branchID){
                    navigate(`${targetRoute}/${userDetails.locationID}/${userDetails.branchID}`);
                } else if(userDetails.locationID){
                    navigate(`${targetRoute}/${userDetails.locationID}`);
                }
            }

            if(routeName == 'device-config/:locationID'){
                let targetRoute = `/device-config/${userDetails.locationID}`;
                if(userDetails.zoneID){
                    navigate(`${targetRoute}/${userDetails.branchID}/${userDetails.facilityID}/${userDetails.buildingID}/${userDetails.floorID}/${userDetails.zoneID}`);
                } else if(userDetails.floorID){
                    navigate(`${targetRoute}/${userDetails.branchID}/${userDetails.facilityID}/${userDetails.buildingID}/${userDetails.floorID}`);
                } else if(userDetails.buildingID){
                    navigate(`${targetRoute}/${userDetails.branchID}/${userDetails.facilityID}/${userDetails.buildingID}`);
                } else if(userDetails.facilityID){
                    navigate(`${targetRoute}/${userDetails.branchID}/${userDetails.facilityID}`);
                } else if(userDetails.branchID){
                    navigate(`${targetRoute}/${userDetails.branchID}`);
                }
            }

            if(routeName == 'device-config/:locationID/:branchID'){
                let targetRoute = `/device-config/${userDetails.locationID}/${userDetails.branchID}`;
                if(userDetails.zoneID){
                    navigate(`${targetRoute}/${userDetails.facilityID}/${userDetails.buildingID}/${userDetails.floorID}/${userDetails.zoneID}`);
                } else if(userDetails.floorID){
                    navigate(`${targetRoute}/${userDetails.facilityID}/${userDetails.buildingID}/${userDetails.floorID}`);
                } else if(userDetails.buildingID){
                    navigate(`${targetRoute}/${userDetails.facilityID}/${userDetails.buildingID}`);
                } else if(userDetails.facilityID){
                    navigate(`${targetRoute}/${userDetails.facilityID}`);
                }
            }

            if(routeName == 'device-config/:locationID/:branchID/:facilityID'){
                let targetRoute = `/device-config/${userDetails.locationID}/${userDetails.branchID}/${userDetails.facilityID}`;
                if(userDetails.zoneID){
                    navigate(`${targetRoute}/${userDetails.buildingID}/${userDetails.floorID}/${userDetails.zoneID}`);
                } else if(userDetails.floorID){
                    navigate(`${targetRoute}/${userDetails.buildingID}/${userDetails.floorID}`);
                } else if(userDetails.buildingID){
                    navigate(`${targetRoute}/${userDetails.buildingID}`);
                }
            }

            if(routeName == 'device-config/:locationID/:branchID/:facilityID/:buildingID'){
                let targetRoute = `/device-config/${userDetails.locationID}/${userDetails.branchID}/${userDetails.facilityID}/${userDetails.buildingID}`;
                if(userDetails.zoneID){
                    navigate(`${targetRoute}/${userDetails.floorID}/${userDetails.zoneID}`);
                } else if(userDetails.floorID){
                    navigate(`${targetRoute}/${userDetails.floorID}`);
                }
            }

            if(routeName == 'device-config/:locationID/:branchID/:facilityID/:buildingID/:floorID'){
                let targetRoute = `/device-config/${userDetails.locationID}/${userDetails.branchID}/${userDetails.facilityID}/${userDetails.buildingID}/${userDetails.floorID}`;
                if(userDetails.zoneID){
                    navigate(`${targetRoute}/${userDetails.zoneID}`);
                }
            }
        }
    }

    return children;
}

export default ProtectedRoute;
