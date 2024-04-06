import React, { useState, useEffect } from 'react';
import "./Devices.css";
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setBreadCrumb, setPageTitle } from '../../../store/themeConfigSlice';
import DeviceComponent from './Components/DeviceComponent/DeviceComponent';


const Devices = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Devices'));
    });

    const navigate = useNavigate();
    const params = useParams();

    const [Breadcrumbs, setBreadcrumbs]  = useState<Array<any>>([]);
    const storedUser = localStorage.getItem('userDetails');
    const storedLocations = localStorage.getItem('location');
    const storedBranches = localStorage.getItem('branch');
    const storedFacilities = localStorage.getItem('facility');
    const storedBuildings = localStorage.getItem('building');
    const storedFloors = localStorage.getItem('floor');
    const storedZones = localStorage.getItem('zone');

    const User: any = storedUser != null ? JSON.parse(storedUser) : {};
    const Locations: Array<any> = storedLocations != null ? JSON.parse(storedLocations) : [];
    const Branches: Array<any> = storedBranches != null ? JSON.parse(storedBranches) : [];
    const Facilities: Array<any> = storedFacilities != null ? JSON.parse(storedFacilities) : [];
    const Buildings: Array<any> = storedBuildings != null ? JSON.parse(storedBuildings) : [];
    const Floors: Array<any> = storedFloors != null ? JSON.parse(storedFloors) : [];
    const Zones: Array<any> = storedZones != null ? JSON.parse(storedZones) : [];

    const ChangeData = (data: any, index: any) => {
        if(!data.zoneName){
            dispatch(setBreadCrumb(Breadcrumbs.slice(0, index)));
            navigate('/dashboard');
        }
    }

    useEffect(() => {
        let currentBreadCrumbs: Array<any> = [];
        let currentzone = Zones?.filter(zone => zone.zoneID == params.zoneID)[0];
        if(currentzone){
            let currentfloor = Floors?.filter(floor => floor.floorID == currentzone.floorID)[0];
            let currentbuilding = Buildings?.filter(building => building.buildingID == currentzone.buildingID)[0];
            let currentfacility = Facilities?.filter(facility => facility.facilityID == currentzone.facilityID)[0];
            let currentbranch = Branches?.filter(branch => branch.branchID == currentzone.branchID)[0];
            let currentlocation = Locations?.filter(location => location.locationID == currentzone.locationID)[0];

            currentBreadCrumbs = [currentlocation, currentbranch, currentfacility, currentbuilding, currentfloor, currentzone];
        }
        let currentindex = 0;

        if(User.zoneID){
            currentindex = 5;
        } else if(User.floorID) {
            currentindex = 4;
        } else if(User.buildingID){
            currentindex = 3;
        } else if(User.facilityID){
            currentindex = 2;
        } else if(User.branchID){
            currentindex = 1;
        } else if(User.locationID){
            currentindex = 0;
        }

        currentBreadCrumbs.map((breadCrumb, index) => {
            if(index < currentindex){
                breadCrumb['click'] = false;
            }
        })

        setBreadcrumbs(currentBreadCrumbs);
    }, [params])

    return (
        <div className="h-full">
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li onClick={() => ChangeData('location', 0)} className={`dark:text-white text-black font-bold text-md hover:underline ${User.locationID ? 'pointer-events-none' : 'cursor-pointer'}`}>
                    <span>Location</span>
                </li>
                {Breadcrumbs.map((selected, index) => <li key={index} onClick={() => ChangeData(selected, index+1)} className={`dark:text-white before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-black font-bold text-md hover:underline ${selected.click == false ? 'pointer-events-none' : 'cursor-pointer'}`}>
                    <span>{selected.locationName || selected.branchName || selected.facilityName || selected.buildingName || selected.floorName || selected.zoneName}</span>
                </li>)}
            </ul>

            <DeviceComponent params={params} />
        </div>
    );
};

export default Devices;
