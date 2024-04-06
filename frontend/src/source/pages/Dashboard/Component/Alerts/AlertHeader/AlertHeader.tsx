import { useEffect, useState } from 'react';
import Dropdown from '../../../../../../components/Dropdown';
import IconBellBing from '../../../../../../components/Icon/IconBellBing';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../../../../store';
import IconInfoCircle from '../../../../../../components/Icon/IconInfoCircle';
import { GetAlerts, GetUpdateAlerts } from '@/source/service/DashboardService';
import CustomToast from '@/helpers/CustomToast';
import { setNotifications, setResetAlert } from '../../../../../../store/themeConfigSlice';
import { useNavigate } from 'react-router-dom';
import sortBy from 'lodash/sortBy';
import moment from 'moment';

export const AlertHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const resetAlert: any = useSelector((state: IRootState) => state.themeConfig.resetAlert);

    const storedLocations = localStorage.getItem('location')
    const storedBranches = localStorage.getItem('branch')
    const storedFacilities = localStorage.getItem('facility')
    const storedBuildings = localStorage.getItem('building')
    const storedFloors = localStorage.getItem('floor')
    const storedZones = localStorage.getItem('zone');
    const StoredDevices = localStorage.getItem('devices');

    const Locations: Array<any> = storedLocations != null ? JSON.parse(storedLocations) : [];
    const Branches: Array<any> = storedBranches != null ? JSON.parse(storedBranches) : [];
    const Facilities: Array<any> = storedFacilities != null ? JSON.parse(storedFacilities) : [];
    const Buildings: Array<any> = storedBuildings != null ? JSON.parse(storedBuildings) : [];
    const Floors: Array<any> = storedFloors != null ? JSON.parse(storedFloors) : [];
    const Zones: Array<any> = storedZones != null ? JSON.parse(storedZones) : [];
    const Devices: Array<any> = StoredDevices != null ? JSON.parse(StoredDevices) : [];

    const [Alerts, setAlerts] = useState<Array<any>>([]);
    const [callAlerts, setCallAlerts] = useState<Boolean>(false);

    const removeNotification = (value: number) => {
        setAlerts(Alerts.filter((user: any) => user.id !== value));
    };

    const getUniqueRecentSensorData = (jsonArray: any) => {
        // Create an object to store the most recent data for each sensorID
        const sensorDataMap: any = {};

        // Iterate through the JSON array
        jsonArray.forEach((data: any) => {
            const sensorID = data.sensorID;
            const collectedTime = moment(data.collectedTime);

            // Check if sensorID already exists in the map
            if (sensorDataMap[sensorID]) {
                // If collectedTime is more recent, update the entry
                if (collectedTime.isAfter(moment(sensorDataMap[sensorID].collectedTime))) {
                    sensorDataMap[sensorID] = data;
                }
            } else {
                // If sensorID doesn't exist in the map, add it
                sensorDataMap[sensorID] = data;
            }
        });

        // Convert the sensorDataMap object to an array of values
        const uniqueRecentSensorData = Object.values(sensorDataMap);
        return uniqueRecentSensorData;
    }

    const GetAlertsData = async () => {
        let response = await GetUpdateAlerts();

        if(response?.data?.status == "success"){
            response = response.data;
            if(response.aqiData){
                Zones.map((zone: any) => {
                    response.aqiData?.map((aqi: any) => {
                        if(aqi.zoneID == zone.zoneID){
                            zone.aqiValue = aqi.aqiValue;
                        }
                    })
                })
                localStorage.setItem('zone', JSON.stringify(Zones));
            }
            dispatch(setNotifications(response.alertData.reverse()));
            // setAlerts(response.alertData?.filter((alert: any) => !alert.notificationShow));

            let responseAlerts: Array<any> = response.alertData;

            let uniqueAlerts: Array<any> = [];

            if(responseAlerts.length > 0){
                let groupedAlerts: Array<any> = []; // group alerts based on deviceID
                let sensorAlerts: Array<any> = []; // alerts with sensorID
                let filteredAlerts: Array<any> = []; // alerts without sensorID and with deviceID

                responseAlerts.map((alert: any) => {
                    // checking for the deviceID
                    if(groupedAlerts[alert.deviceID]){
                        // if the array with deviceID is present pushing the alert to the deviceID
                        groupedAlerts[alert.deviceID].push(alert);
                    } else {
                        // creating a new array with deviceID
                        groupedAlerts[alert.deviceID] = [alert];
                    }
                })

                groupedAlerts.map((group: any) => {
                    // sorting alerts with id by desc
                    group.sort((a: any, b: any) => b.id - a.id);

                    // checking for disconnected devices
                    if(group[0].alertType.replaceAll(' ', '').toLowerCase() == 'devicedisconnected'){
                        // if recent alert for the device is disconnected pushing it to filteredAlerts and removing other alerts
                        filteredAlerts.push(group[0]);
                    } else {
                        // pushing the all alerts to sensorAlerts
                        group.map((alert: any) => {
                            sensorAlerts.push(alert);
                        })
                    }
                })

                // getting unique and recent sensorID alerts
                uniqueAlerts = getUniqueRecentSensorData(sensorAlerts).concat(filteredAlerts);
                // sorting the alerts based on id
                uniqueAlerts.sort((a: any, b: any) => b.id - a.id);

                // const uniqueAlerts = responseAlerts.reduce((accumulator, current) => {
                //     const { id, deviceID } = current;
                //     const existingObject = accumulator.get(deviceID);
                //     if(!existingObject || id > existingObject.id){
                //         accumulator.set(deviceID, current);
                //     }
                //     return accumulator;
                // }, new Map());

                // const resultAlerts = sortBy(Array.from(uniqueAlerts.values()), 'collectedTime');

            }
            setAlerts(uniqueAlerts);
        } else {
            CustomToast('Something went wrong', 'error');
        }
    }

    const HandleClick = (zone: any) => {
        let url = `/zone/${zone.zoneID}`;

        if(zone.msg.toLowerCase().includes('disconnect')){
            url = `/zone/${zone.zoneID}`;
        }else if(zone.deviceID){
            url = `/device/${zone.deviceID}`;
        }
        navigate(url);
    }

    const runAtNextFifthSecond = () => {
        const now = moment();
        const nextMinute = moment(now).startOf('minute').add(1, 'minute').add(5, 'seconds');
        const delay = nextMinute.diff(now);

        setTimeout(() => {
            console.log(`Alerts: ${moment().format('DD-MM-YYYY HH:mm:ss')}`)
            setCallAlerts(true);
        }, delay);
    };

    useEffect(() => {
        if(resetAlert){
            GetAlertsData();
            dispatch(setResetAlert(false));
        }
    }, [resetAlert])

    useEffect(() => {
        if(callAlerts){
            GetAlertsData();
            runAtNextFifthSecond();
            setCallAlerts(false);
        }
    }, [callAlerts])

    useEffect(() => {
        GetAlertsData();
        runAtNextFifthSecond();
    }, [])

    return (
        <Dropdown
            offset={[0, 8]}
            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
            btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
            button={
                <span>
                    <IconBellBing />
                    <span className="absolute w-5 h-5 top-[-6px] right-[-6px] rounded-2xl bg-red-400 text-white">{Alerts.length}</span>
                </span>
            }
        >
            <ul className="!py-0 text-dark dark:text-white-dark w-[300px] sm:w-[350px] h-[300px] overflow-auto divide-y dark:divide-white/10">
                {Alerts.length > 0 ? (
                    <>
                        {Alerts.map((notification: any, index: any) => {
                            let device = Devices?.filter((currentDevice: any) => currentDevice.branchID == notification.branchID && currentDevice.buildingID == notification.buildingID && currentDevice.facilityID == notification.facilityID && currentDevice.floorID == notification.floorID && currentDevice.locationID == notification.locationID && currentDevice.zoneID == notification.zoneID && currentDevice.deviceID == notification.deviceID)[0]
                            let zone = Zones?.filter((currentZone: any) => currentZone.branchID == notification.branchID && currentZone.buildingID == notification.buildingID && currentZone.facilityID == notification.facilityID && currentZone.floorID == notification.floorID && currentZone.locationID == notification.locationID && currentZone.zoneID == notification.zoneID)[0];
                            let floor = Floors?.filter((currentFloor: any) => currentFloor.branchID == notification.branchID && currentFloor.buildingID == notification.buildingID && currentFloor.facilityID == notification.facilityID && currentFloor.floorID == notification.floorID && currentFloor.locationID == notification.locationID)[0];
                            let building = Buildings?.filter((currentBuilding: any) => currentBuilding.branchID == notification.branchID && currentBuilding.buildingID == notification.buildingID && currentBuilding.facilityID == notification.facilityID && currentBuilding.locationID == notification.locationID)[0];
                            let facility = Facilities?.filter((currentFacility: any) => currentFacility.branchID == notification.branchID && currentFacility.facilityID == notification.facilityID && currentFacility.locationID == notification.locationID)[0];
                            let branch = Branches?.filter((currentBranch: any) => currentBranch.branchID == notification.branchID && currentBranch.locationID == notification.locationID)[0];
                            let location = Locations?.filter((currentLocation: any) => currentLocation.locationID == notification.locationID)[0];
                            let AlertType = notification.alertType;
                            AlertType = AlertType.toLowerCase();
                            let style = "text-black-500 border-black-500";

                            if(AlertType == "critical"){
                                style = "text-red-500 border-red-500";
                            } else if(AlertType == "out of range" || AlertType == "out ofrange" || AlertType == "outof range" || AlertType == "outofrange"){
                                style = 'text-[#9c27b0] border-[#9c27b0]';
                            } else if (AlertType == "warning" || AlertType == "twa"){
                                style = "text-yellow-500 border-yellow-500"
                            } else if(AlertType == "stel"){
                                style = 'text-red-500 border-red-500';
                            } else if(AlertType == "devicedisconnected" || AlertType == "device disconnected"){
                                style = 'text-gray-500 border-gray-500';
                            }

                            return (
                                <li key={index} className="dark:text-white-light/90 cursor-pointer" onClick={() => HandleClick(notification)}>
                                    <div className="group flex items-center px-4 py-2">
                                        <div className="grid place-content-center rounded">
                                            <div className={`w-6 h-6 relative flex justify-center items-center font-bold border-2 rounded-xl ${style}`}>
                                                <span className='absolute'>!</span>
                                            </div>
                                        </div>
                                        <div className="ltr:pl-3 rtl:pr-3 flex">
                                            <ul className='!shadow-none'>
                                                <li className='font-bold dark:text-white'>{AlertType == "devicedisconnected" || AlertType == "device disconnected" ? `Device Name: ${device?.deviceName}` : `Sensor Name: ${notification.sensorTag}`}</li>
                                                <li className='dark:text-white'>Date: {moment(notification.collectedTime.split(' ')[0]).format("DD/MM/YYYY")}</li>
                                                <li className='dark:text-white'>Time: {notification.collectedTime.split(' ')[1]}</li>
                                                <li className='dark:text-white'>Message: {notification.msg}</li>
                                                {!(AlertType == "devicedisconnected" || AlertType == "device disconnected") && <li className='dark:text-white'>Device: {device?.deviceName}</li>}
                                                <li className='dark:text-white'>Zone: {zone?.zoneName}</li>
                                                <li className='dark:text-white'>Floor: {floor?.floorName}</li>
                                                <li className='dark:text-white'>Building: {building?.buildingName}</li>
                                                <li className='dark:text-white'>Facility: {facility?.facilityName}</li>
                                                <li className='dark:text-white'>Branch: {branch?.branchName}</li>
                                                <li className='dark:text-white'>State: {location?.locationName}</li>
                                            </ul>
                                            {/* <button
                                                type="button"
                                                className="ltr:ml-auto rtl:mr-auto text-neutral-300 hover:text-danger opacity-0 group-hover:opacity-100"
                                                onClick={() => removeNotification(notification.id)}
                                            >
                                                <IconXCircle />
                                            </button> */}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </>
                ) : (
                    <li onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="!grid place-content-center hover:!bg-transparent text-lg min-h-[200px]">
                            <div className="mx-auto ring-4 ring-primary/30 rounded-full mb-4 text-primary">
                                <IconInfoCircle fill={true} className="w-10 h-10" />
                            </div>
                            No data available.
                        </button>
                    </li>
                )}
            </ul>
        </Dropdown>
    );
};

