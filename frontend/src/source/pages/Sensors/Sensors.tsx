import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './Sensors.css';
import { useDispatch } from 'react-redux';
import { setBreadCrumb, setPageTitle } from '../../../store/themeConfigSlice';
import SensorComponent from './Component/SensorComponent/SensorComponent';

const Sensors = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Transactions'));
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
    const StoredSensors = localStorage.getItem('sensors');
    const StoredDevices = localStorage.getItem('devices');

    const User: any = storedUser != null ? JSON.parse(storedUser) : {};
    const Locations: Array<any> = storedLocations != null ? JSON.parse(storedLocations) : [];
    const Branches: Array<any> = storedBranches != null ? JSON.parse(storedBranches) : [];
    const Facilities: Array<any> = storedFacilities != null ? JSON.parse(storedFacilities) : [];
    const Buildings: Array<any> = storedBuildings != null ? JSON.parse(storedBuildings) : [];
    const Floors: Array<any> = storedFloors != null ? JSON.parse(storedFloors) : [];
    const Zones: Array<any> = storedZones != null ? JSON.parse(storedZones) : [];
    const AllSensors: Array<any> = StoredSensors != null ? JSON.parse(StoredSensors) : [];
    const AllDevices: Array<any> = StoredDevices != null ? JSON.parse(StoredDevices) : [];

    const ChangeData = (data: any, index: any) => {
        if(!data.deviceName){
            if(data.zoneName){
                navigate(`/zone/${data.zoneID}`)
            } else {
                dispatch(setBreadCrumb(Breadcrumbs.slice(0, index)));
                navigate('/dashboard');
            }
        }
    }

    useEffect(() => {
        let currentBreadCrumbs: Array<any> = [];
        let currentdevice = AllDevices.find(device => device.deviceID == params.deviceID);
        if(currentdevice){
            let currentzone = Zones.find(zone => zone.zoneID == currentdevice.zoneID);
            let currentfloor = Floors.find(floor => floor.floorID == currentdevice.floorID);
            let currentbuilding = Buildings.find(building => building.buildingID == currentdevice.buildingID);
            let currentfacility = Facilities.find(facility => facility.facilityID == currentdevice.facilityID);
            let currentbranch = Branches.find(branch => branch.branchID == currentdevice.branchID);
            let currentlocation = Locations.find(location => location.locationID == currentdevice.locationID);

            currentBreadCrumbs = [currentlocation, currentbranch, currentfacility, currentbuilding, currentfloor, currentzone, currentdevice];
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
                {Breadcrumbs?.map((selected, index) => <li key={index} onClick={() => ChangeData(selected, index+1)} className={`dark:text-white before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-black font-bold text-md hover:underline ${selected.click == false ? 'pointer-events-none' : 'cursor-pointer'}`}>
                    <span>{selected.locationName || selected.branchName || selected.facilityName || selected.buildingName || selected.floorName || selected.zoneName || selected.deviceName}</span>
                </li>)}
            </ul>

            <SensorComponent params={params} />
        </div>
    );
};

export default Sensors;
