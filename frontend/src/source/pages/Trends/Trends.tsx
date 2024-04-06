import { setPageTitle } from '@/store/themeConfigSlice';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import DeviceComponent from './Component/DeviceComponent/DeviceComponent';
import SensorComponent from './Component/SensorComponent/SensorComponent';
import { IRootState } from '@/store';

const Trends = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Trends'));
    });

    const allOption = () => {
        return {
            label: 'All',
            value: ''
        };
    };

    const storedUserDetails = useSelector((state: IRootState) => state.themeConfig).userDetails;
    const userDetails: any = storedUserDetails != null ? JSON.parse(storedUserDetails) : {};

    const storedLocations = localStorage.getItem('location')
    const storedBranches = localStorage.getItem('branch')
    const storedFacilities = localStorage.getItem('facility')
    const storedBuildings = localStorage.getItem('building')
    const storedFloors = localStorage.getItem('floor')
    const storedZones = localStorage.getItem('zone');
    const storedDevices = localStorage.getItem('devices');
    const storedValue = localStorage.getItem('trendsValue');

    const Locations: Array<any> = storedLocations != null ? JSON.parse(storedLocations) : [];
    const Branches: Array<any> = storedBranches != null ? JSON.parse(storedBranches) : [];
    const Facilities: Array<any> = storedFacilities != null ? JSON.parse(storedFacilities) : [];
    const Buildings: Array<any> = storedBuildings != null ? JSON.parse(storedBuildings) : [];
    const Floors: Array<any> = storedFloors != null ? JSON.parse(storedFloors) : [];
    const Zones: Array<any> = storedZones != null ? JSON.parse(storedZones) : [];
    const Devices: Array<any> = storedDevices != null ? JSON.parse(storedDevices) : [];
    const [TrendsValue, setTrendsValue] = useState<any>(storedValue != null ? JSON.parse(storedValue) : {});

    Locations.map((location) => {
        location.label = location.locationName;
        location.value = location.id;
    });
    // Locations.unshift(allOption());

    Branches.map((branch) => {
        branch.label = branch.branchName;
        branch.value = branch.id;
    });
    // Branches.unshift(allOption());

    Facilities.map((facility) => {
        facility.label = facility.facilityName;
        facility.value = facility.id;
    });
    // Facilities.unshift(allOption());

    Buildings.map((building) => {
        building.label = building.buildingName;
        building.value = building.id;
    });
    // Buildings.unshift(allOption());

    Floors.map((floor) => {
        floor.label = floor.floorName;
        floor.value = floor.id;
    });
    // Floors.unshift(allOption());

    Zones.map((zone) => {
        zone.label = zone.zoneName;
        zone.value = zone.id;
    });
    // Zones.unshift(allOption());

    Devices.map((device) => {
        device.label = device.deviceName;
        device.value = device.id;
    });
    // Zones.unshift(allOption());

    const [Location, setLocation] = useState('');
    const [Branch, setBranch] = useState('');
    const [Facility, setFacility] = useState('');
    const [Building, setBuilding] = useState('');
    const [Floor, setFloor] = useState('');
    const [Zone, setZone] = useState('');
    const [Device, setDevice] = useState('');
    const [ShowDevice, setShowDevice] = useState(false);
    const [Sensors, setSensors] = useState(false);
    const [DeviceDetails, setDeviceDetails] = useState('');

    const [BranchesOptions, setBranchesOptions] = useState<Array<any>>([]);
    const [FacilitiesOptions, setFacilitiesOptions] = useState<Array<any>>([]);
    const [BuildingOptions, setBuildingOptions] = useState<Array<any>>([]);
    const [FloorOptions, setFloorOptions] = useState<Array<any>>([]);
    const [ZoneOptions, setZoneOptions] = useState<Array<any>>([]);
    const [DeviceOptions, setDeviceOptions] = useState<Array<any>>(Devices);

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
            // options.unshift(allOption());
            currentLocation = location;
            setDeviceOptions(Devices.filter(device => device.locationID == location.locationID));
        }

        setValue(val);
        setBranchesOptions(options);
        setLocation(location);

        setShowDevice(false);
        setSensors(false);
        setFacilitiesOptions([]);
        setBuildingOptions([]);
        setFloorOptions([]);
        setZoneOptions([]);
        setBranch('');
        setFacility('');
        setBuilding('');
        setFloor('');
        setZone('');
        setDevice('');
        setDeviceDetails('');
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
            // options.unshift(allOption());
            currentBranch = branch;
            setDeviceOptions(Devices.filter(device =>
                device.locationID == branch.locationID &&
                device.branchID == branch.branchID
            ));
        }

        setValue(val);
        setBranch(currentBranch);
        setFacilitiesOptions(options);

        setShowDevice(false);
        setSensors(false);
        setBuildingOptions([]);
        setFloorOptions([]);
        setZoneOptions([]);
        setFacility('');
        setBuilding('');
        setFloor('');
        setZone('');
        setDevice('');
        setDeviceDetails('');
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
            // options.unshift(allOption());
            currentFacility = facility;
            setDeviceOptions(Devices.filter(device =>
                device.locationID == facility.locationID &&
                device.branchID == facility.branchID &&
                device.facilityID == facility.facilityID
            ));
        }

        setValue(currentFacility);
        setFacility(facility);
        setBuildingOptions(options);

        setShowDevice(false);
        setSensors(false);
        setFloorOptions([]);
        setZoneOptions([]);
        setBuilding('');
        setFloor('');
        setZone('');
        setDevice('');
        setDeviceDetails('');
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
            // options.unshift(allOption());
            currentBuilding = building;
            setDeviceOptions(Devices.filter(device =>
                device.locationID == building.locationID &&
                device.branchID == building.branchID &&
                device.facilityID == building.facilityID &&
                device.buildingID == building.buildingID
            ));
        }

        setValue(val);
        setBuilding(currentBuilding);
        setFloorOptions(options);

        setShowDevice(false);
        setSensors(false);
        setZoneOptions([]);
        setFloor('');
        setZone('');
        setDevice('');
        setDeviceDetails('');
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
            // options.unshift(allOption());
            currentFloor = floor;
            setDeviceOptions(Devices.filter(device =>
                device.locationID == floor.locationID &&
                device.branchID == floor.branchID &&
                device.facilityID == floor.facilityID &&
                device.buildingID == floor.buildingID &&
                device.floorID == floor.floorID
            ));
        }

        setValue(val);
        setFloor(currentFloor);
        setZoneOptions(options);

        setShowDevice(false);
        setSensors(false);
        setZone('');
        setDevice('');
        setDeviceDetails('');
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

        setZone(zone);
        setDeviceOptions(Devices.filter(device =>
            device.locationID == zone.locationID &&
            device.branchID == zone.branchID &&
            device.facilityID == zone.facilityID &&
            device.buildingID == zone.buildingID &&
            device.floorID == zone.floorID &&
            device.zoneID == zone.zoneID
        ));

        setShowDevice(true);
        setSensors(false);
        setDevice('');
        setDeviceDetails('');
    }

    const HandleDeviceChange = (device: any) => {
        let val: any = {};
        val['location'] = Value.location;
        val['branch'] = Value.branch;
        val['facility'] = Value.facility;
        val['building'] = Value.building;
        val['floor'] = Value.floor;
        val['zone'] = Value.zone;
        val['device'] = device;
        setValue(val);

        setDevice(device);

        setShowDevice(false);
        setSensors(true);
        setDeviceDetails(device);
    }

    const HandleSet = (remove: any) => {
        if(remove){
            localStorage.removeItem('trendsValue');
        } else {
            localStorage.setItem('trendsValue', JSON.stringify(Value));
        }
        setChangeValue(!changeValue);
    }

    useEffect(() => {
        let value = storedValue != null ? JSON.parse(storedValue) : {};
        setTrendsValue(value)
    }, [changeValue])

    useEffect(() => {
        Sensors && setShowDevice(false);
    }, [Sensors])

    useEffect(() => {
        if(userDetails.locationID){
            HandleLocationChange(Locations.find(location => location.locationID == userDetails.locationID))
        } else {
            TrendsValue.hasOwnProperty('location') && HandleLocationChange(TrendsValue['location']);
        }
        if(userDetails.branchID){
            HandleBranchChange(Branches.find(branch => branch.branchID == userDetails.branchID))
        } else {
            TrendsValue.hasOwnProperty('branch') && HandleBranchChange(TrendsValue['branch']);
        }
        if(userDetails.facilityID){
            HandleFacilityChange(Facilities.find(facility => facility.facilityID == userDetails.facilityID))
        } else {
            TrendsValue.hasOwnProperty('facility') && HandleFacilityChange(TrendsValue['facility']);
        }
        if(userDetails.buildingID){
            handleBuildingChange(Buildings.find(building => building.buildingID == userDetails.buildingID))
        } else {
            TrendsValue.hasOwnProperty('building') && handleBuildingChange(TrendsValue['building']);
        }
        if(userDetails.floorID){
            handleFloorChange(Floors.find(floor => floor.floorID == userDetails.floorID))
        } else {
            TrendsValue.hasOwnProperty('floor') && handleFloorChange(TrendsValue['floor']);
        }
        if(userDetails.zoneID){
            handleZoneChange(Zones.find(zone => zone.zoneID == userDetails.zoneID))
        } else {
            TrendsValue.hasOwnProperty('zone') && handleZoneChange(TrendsValue['zone']);
        }
    }, [])

    return (
        <div className='h-full flex flex-col gap-4'>
            <div className="panel pb-2">
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

                        <Select
                            name="device"
                            id="device"
                            className="device w-full dark:text-white"
                            placeholder="Device"
                            options={DeviceOptions}
                            isSearchable={true}
                            value={Device}
                            onChange={(e) => HandleDeviceChange(e)}
                        />
                    </div>
                    <div className='flex justify-end gap-2'>
                        <button className='btn btn-sm btn-primary' type='button' onClick={() => HandleSet(false)}>
                            Set
                        </button>
                        {Object.keys(TrendsValue).length > 0 && <button className='btn btn-sm btn-danger' type='button' onClick={() => HandleSet(true)}>
                            Re-set
                        </button>}
                    </div>
                </div>
            </div>

            {ShowDevice && <DeviceComponent zone={Zone} setSensors={setSensors} setDeviceDetails={setDeviceDetails} setDevice={setDevice} />}
            {Sensors && <SensorComponent Device={DeviceDetails} />}
        </div>
    );
};

export default Trends;
