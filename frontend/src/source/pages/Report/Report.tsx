import { setPageTitle } from '@/store/themeConfigSlice';
import { Tab } from '@headlessui/react';
import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import AQIReport from './Component/AQIReport/AQIReport';
import SensorReport from './Component/SensorReport/SensorReport';
import AlarmReport from './Component/AlarmReport/AlarmReport';
import ServerUtilizationReport from './Component/ServerUtilizationReport/ServerUtilizationReport';
import ApplicationVersionReport from './Component/ApplicationVersionReport/ApplicationVersionReport';
import FirmwareVersionReport from './Component/FirmwareVersionReport/FirmwareVersionReport';
import BumpTest from './Component/BumpTest/BumpTest';
import CalibrationReport from './Component/CalibrationReport/CalibrationReport';
import UserLog from './Component/UserLog/UserLog';
import { IRootState } from '@/store';
import LimitEditLogsReport from './Component/LimitEditLogsReport/LimitEditLogsReport';
import EventLogReport from './Component/EventLogReport/EventLogReport';

const Report = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Report'));
    });

    const allOption = () => {
        return {
            label: 'All',
            value: ''
        };
    };

    const storedUserDetails = useSelector((state: IRootState) => state.themeConfig).userDetails;
    const userDetails: any = storedUserDetails != null ? JSON.parse(storedUserDetails) : {};

    const storedLocations = localStorage.getItem('location');
    const storedBranches = localStorage.getItem('branch');
    const storedFacilities = localStorage.getItem('facility');
    const storedBuildings = localStorage.getItem('building');
    const storedFloors = localStorage.getItem('floor');
    const storedZones = localStorage.getItem('zone');
    const storedValue = localStorage.getItem('reportsValue');

    const Locations: Array<any> = storedLocations != null ? JSON.parse(storedLocations) : [];
    const Branches: Array<any> = storedBranches != null ? JSON.parse(storedBranches) : [];
    const Facilities: Array<any> = storedFacilities != null ? JSON.parse(storedFacilities) : [];
    const Buildings: Array<any> = storedBuildings != null ? JSON.parse(storedBuildings) : [];
    const Floors: Array<any> = storedFloors != null ? JSON.parse(storedFloors) : [];
    const Zones: Array<any> = storedZones != null ? JSON.parse(storedZones) : [];
    const [ReportsValue, setReportsValue] = useState<any>(storedValue != null ? JSON.parse(storedValue) : {});

    Locations.map((location) => {
        location.label = location.locationName;
        location.value = location.locationName;
    });
    Locations.unshift(allOption());

    Branches.map((branch) => {
        branch.label = branch.branchName;
        branch.value = branch.branchName;
    });
    Branches.unshift(allOption());

    Facilities.map((facility) => {
        facility.label = facility.facilityName;
        facility.value = facility.facilityName;
    });
    Facilities.unshift(allOption());

    Buildings.map((building) => {
        building.label = building.buildingName;
        building.value = building.buildingName;
    });
    Buildings.unshift(allOption());

    Floors.map((floor) => {
        floor.label = floor.floorName;
        floor.value = floor.floorName;
    });
    Floors.unshift(allOption());

    Zones.map((zone) => {
        zone.label = zone.zoneName;
        zone.value = zone.zoneName;
    });
    Zones.unshift(allOption());

    const [CurrentLocation, setCurrentLocation] = useState('');
    const [Location, setLocation] = useState('');
    const [Branch, setBranch] = useState('');
    const [Facility, setFacility] = useState('');
    const [Building, setBuilding] = useState('');
    const [Floor, setFloor] = useState('');
    const [Zone, setZone] = useState('');

    const [BranchesOptions, setBranchesOptions] = useState<Array<any>>([]);
    const [FacilitiesOptions, setFacilitiesOptions] = useState<Array<any>>([]);
    const [BuildingOptions, setBuildingOptions] = useState<Array<any>>([]);
    const [FloorOptions, setFloorOptions] = useState<Array<any>>([]);
    const [ZoneOptions, setZoneOptions] = useState<Array<any>>([]);

    const [Value, setValue] = useState<any>({});
    const [changeValue, setChangeValue] = useState<boolean>(false);

    const HandleLocationChange = (location: any) => {
        let val: any = {};
        let options = [];
        let currentLocation = '';

        if(location.value != ""){
            val['location'] = location;
            options = Branches.filter(branch =>
                branch.locationID == location.locationID
            );
            options.unshift(allOption());
            currentLocation = location;
        }

        setValue(val);
        setBranchesOptions(options);
        setCurrentLocation(currentLocation);
        setLocation(currentLocation);

        setFacilitiesOptions([]);
        setBuildingOptions([]);
        setFloorOptions([]);
        setZoneOptions([]);
        setBranch('');
        setFacility('');
        setBuilding('');
        setFloor('');
        setZone('');
    }

    const HandleBranchChange = (branch: any) => {
        let val: any = {};
        let options = [];
        let currentBranch = '';

        val['location'] = Value.location;

        if(branch.value != ""){
            val['branch'] = branch;
            options = Facilities.filter(facility =>
                facility.locationID == branch.locationID &&
                facility.branchID == branch.branchID
            );
            options.unshift(allOption());
            currentBranch = branch;
        }

        setValue(val);
        setBranch(currentBranch);
        setCurrentLocation(currentBranch);
        setFacilitiesOptions(options);

        setBuildingOptions([]);
        setFloorOptions([]);
        setZoneOptions([]);
        setFacility('');
        setBuilding('');
        setFloor('');
        setZone('');
    }

    const HandleFacilityChange = (facility: any) => {
        let val: any = {};
        let options = [];
        let currentFacility = '';

        val['location'] = Value.location;
        val['branch'] = Value.branch;

        if(facility.value != ""){
            val['facility'] = facility;
            options = Buildings.filter(building =>
                building.locationID == facility.locationID &&
                building.branchID == facility.branchID &&
                building.facilityID == facility.facilityID
            );
            options.unshift(allOption());
            currentFacility = facility;
        }

        setValue(val);
        setFacility(currentFacility);
        setCurrentLocation(currentFacility);
        setBuildingOptions(options);

        setFloorOptions([]);
        setZoneOptions([]);
        setBuilding('');
        setFloor('');
        setZone('');
    }

    const handleBuildingChange = (building: any) => {
        let val: any = {};
        let options = [];
        let currentBuilding = '';

        val['location'] = Value.location;
        val['branch'] = Value.branch;
        val['facility'] = Value.facility;

        if(building.value != ""){
            val['building'] = building;
            options = Floors.filter(floor =>
                floor.locationID == building.locationID &&
                floor.branchID == building.branchID &&
                floor.facilityID == building.facilityID &&
                floor.buildingID == building.buildingID
            );
            options.unshift(allOption());
            currentBuilding = building;
        }

        setValue(val);
        setBuilding(currentBuilding);
        setCurrentLocation(currentBuilding);
        setFloorOptions(options);

        setZoneOptions([]);
        setFloor('');
        setZone('');
    }

    const handleFloorChange = (floor: any) => {
        let val: any = {};
        let options = [];
        let currentFloor = '';

        val['location'] = Value.location;
        val['branch'] = Value.branch;
        val['facility'] = Value.facility;
        val['building'] = Value.building;

        if(floor.value != ""){
            val['floor'] = floor;
            options = Zones.filter(zone =>
                zone.locationID == floor.locationID &&
                zone.branchID == floor.branchID &&
                zone.facilityID == floor.facilityID &&
                zone.buildingID == floor.buildingID &&
                zone.floorID == floor.floorID
            );
            options.unshift(allOption());
            currentFloor = floor;
        }

        setValue(val);
        setFloor(currentFloor);
        setCurrentLocation(currentFloor);
        setZoneOptions(options);

        setZone('');
    }

    const handleZoneChange = (zone: any) => {
        let val: any = {};
        val['location'] = Value.location;
        val['branch'] = Value.branch;
        val['facility'] = Value.facility;
        val['building'] = Value.building;
        val['floor'] = Value.floor;
        val['zone'] = zone;
        setValue(val);

        setCurrentLocation(zone);
        setZone(zone);
    }

    const HandleSet = (remove: any) => {
        if(remove){
            localStorage.removeItem('reportsValue');
        } else {
            localStorage.setItem('reportsValue', JSON.stringify(Value));
        }
        setChangeValue(!changeValue);
    }

    useEffect(() => {
        let value = storedValue != null ? JSON.parse(storedValue) : {};
        setReportsValue(value)
    }, [changeValue])

    useEffect(() => {
        if(userDetails.locationID){
            HandleLocationChange(Locations.find(location => location.locationID == userDetails.locationID))
        } else {
            ReportsValue.hasOwnProperty('location') && HandleLocationChange(ReportsValue['location']);
        }
        if(userDetails.branchID){
            HandleBranchChange(Branches.find(branch => branch.branchID == userDetails.branchID))
        } else {
            ReportsValue.hasOwnProperty('branch') && HandleBranchChange(ReportsValue['branch']);
        }
        if(userDetails.facilityID){
            HandleFacilityChange(Facilities.find(facility => facility.facilityID == userDetails.facilityID))
        } else {
            ReportsValue.hasOwnProperty('facility') && HandleFacilityChange(ReportsValue['facility']);
        }
        if(userDetails.buildingID){
            handleBuildingChange(Buildings.find(building => building.buildingID == userDetails.buildingID))
        } else {
            ReportsValue.hasOwnProperty('building') && handleBuildingChange(ReportsValue['building']);
        }
        if(userDetails.floorID){
            handleFloorChange(Floors.find(floor => floor.floorID == userDetails.floorID))
        } else {
            ReportsValue.hasOwnProperty('floor') && handleFloorChange(ReportsValue['floor']);
        }
        if(userDetails.zoneID){
            handleZoneChange(Zones.find(zone => zone.zoneID == userDetails.zoneID))
        } else {
            ReportsValue.hasOwnProperty('zone') && handleZoneChange(ReportsValue['zone']);
        }
    }, [])

    return (
        <div className='h-full'>
            <div className="panel">
                <div className="flex gap-2 flex-col w-full">
                    <div className="flex gap-2 w-full">
                        <Select
                            name="location"
                            id="location"
                            className='location w-full dark:text-white'
                            placeholder="Location"
                            options={Locations}
                            isSearchable={true}
                            value={Location}
                            isDisabled={userDetails.locationID}
                            onChange={(e) => HandleLocationChange(e)}
                        />

                        <Select
                            name="branch"
                            id="branch"
                            className="branch w-full dark:text-white"
                            placeholder="Branch"
                            options={BranchesOptions}
                            isSearchable={true}
                            value={Branch}
                            isDisabled={userDetails.branchID}
                            onChange={(e) => HandleBranchChange(e)}
                        />

                        <Select
                            name="facility"
                            id="facility"
                            className="facility w-full dark:text-white"
                            placeholder="Facility"
                            options={FacilitiesOptions}
                            isSearchable={true}
                            value={Facility}
                            isDisabled={userDetails.facilityID}
                            onChange={(e) => HandleFacilityChange(e)}
                        />
                    </div>
                    <div className="flex gap-2 w-full">
                        <Select
                            name="building"
                            id="building"
                            className="building w-full dark:text-white"
                            placeholder="Building"
                            options={BuildingOptions}
                            isSearchable={true}
                            value={Building}
                            isDisabled={userDetails.buildingID}
                            onChange={(e) => handleBuildingChange(e)}
                        />

                        <Select
                            name="floor"
                            id="floor"
                            className="floor w-full dark:text-white"
                            placeholder="Floor"
                            options={FloorOptions}
                            isSearchable={true}
                            value={Floor}
                            isDisabled={userDetails.floorID}
                            onChange={(e) => handleFloorChange(e)}
                        />

                        <Select
                            name="zone"
                            id="zone"
                            className="zone w-full dark:text-white"
                            placeholder="Zone"
                            options={ZoneOptions}
                            isSearchable={true}
                            value={Zone}
                            isDisabled={userDetails.zoneID}
                            onChange={(e) => handleZoneChange(e)}
                        />
                    </div>
                    <div className='flex justify-end gap-2'>
                        <button className='btn btn-sm btn-primary' type='button' onClick={() => HandleSet(false)}>
                            Set
                        </button>
                        {Object.keys(ReportsValue).length > 0 && <button className='btn btn-sm btn-danger' type='button' onClick={() => HandleSet(true)}>
                            Re-set
                        </button>}
                    </div>
                </div>
            </div>

            <div className="panel mt-5">
                <Tab.Group>
                    <Tab.List className="flex overflow-x-auto overflow-y-hidden">
                        <Tab as={Fragment}>
                            {({ selected }) => <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                AIR QUALITY INDEX
                            </button>
                            }
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                SENSOR STATUS
                            </button>
                            }
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                ALARMS
                            </button>
                            }
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                LIMIT EDIT LOGS
                            </button>
                            }
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => <button className={`${selected ? 'bg-primary text-white !outline-none' : ''}  -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                BUMPTEST
                            </button>
                            }
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                CALIBRATION
                            </button>
                            }
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                EVENT LOG
                            </button>
                            }
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                USER LOG
                            </button>
                            }
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                SERVER UTILIZATION
                            </button>
                            }
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                APPLICATION VERSION
                            </button>
                            }
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                FIRMWARE VERSION
                            </button>
                            }
                        </Tab>
                    </Tab.List>
                    <hr className='mt-2' />
                    <Tab.Panels>
                        <Tab.Panel>
                            <AQIReport Zone={Zone} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <SensorReport Zone={CurrentLocation} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <AlarmReport Zone={CurrentLocation} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <LimitEditLogsReport Zone={CurrentLocation} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <BumpTest Zone={CurrentLocation} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <CalibrationReport Zone={CurrentLocation} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <EventLogReport Zone={CurrentLocation} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <UserLog Zone={CurrentLocation} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <ServerUtilizationReport Zone={CurrentLocation} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <ApplicationVersionReport Zone={CurrentLocation} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <FirmwareVersionReport Zone={CurrentLocation} />
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    );
};

export default Report;
