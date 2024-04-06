import React, { Fragment, useEffect, useState } from 'react';
import IconX from '@/components/Icon/IconX';
import { Transition, Dialog } from '@headlessui/react';
import CustomToast from '@/helpers/CustomToast';
import themeConfig from '@/theme.config';
import Select from 'react-select';
import { AddNewUser, GetUser, UpdatedUser } from '@/source/service/UserService';
import { IRootState } from '@/store';
import { useSelector } from 'react-redux';

const AddUser = ({ OpenModal, setOpenModal, LocationData, OnSuccess }: any) => {
    const BackendURL = themeConfig.apiURL.slice(0, -4);

    const storedUserDetails = useSelector((state: IRootState) => state.themeConfig).userDetails;
    const userDetails: any = storedUserDetails != null ? JSON.parse(storedUserDetails) : {};

    const allOptions = (key: string) => {
        let data: any = {
            label: 'All',
            value: 'all'
        };
        data[key] = 'all';
        return data;
    };

    const storedLocations = localStorage.getItem('location')
    const storedBranches = localStorage.getItem('branch')
    const storedFacilities = localStorage.getItem('facility')
    const storedBuildings = localStorage.getItem('building')
    const storedFloors = localStorage.getItem('floor')
    const storedZones = localStorage.getItem('zone');

    const Locations: Array<any> = storedLocations != null ? JSON.parse(storedLocations) : [];
    const Branches: Array<any> = storedBranches != null ? JSON.parse(storedBranches) : [];
    const Facilities: Array<any> = storedFacilities != null ? JSON.parse(storedFacilities) : [];
    const Buildings: Array<any> = storedBuildings != null ? JSON.parse(storedBuildings) : [];
    const Floors: Array<any> = storedFloors != null ? JSON.parse(storedFloors) : [];
    const Zones: Array<any> = storedZones != null ? JSON.parse(storedZones) : [];
    const UserRoles: Array<any> = [
        {
            label: 'User',
            value: 'User'
        },
        {
            label: 'Manager',
            value: 'Manager'
        },
        {
            label: 'Admin',
            value: 'Admin'
        },
        {
            label: 'System Specialist',
            value: 'systemSpecialist'
        }
    ];
    const emailNotificationOptions: Array<any> = [
        {
            label: 'None',
            value: 'NONE'
        },
        {
            label: 'Instant',
            value: 'INSTANT'
        },
        {
            label: 'Daily',
            value: 'DAILY'
        },
        {
            label: 'Instant Daily',
            value: 'INSTANT_DAILY'
        }
    ];
    const smsNotificationOptions: Array<any> = [
        {
            label: 'None',
            value: 'NONE'
        },
        {
            label: 'Instant',
            value: 'INSTANT'
        }
    ];

    Locations.map((location) => {
        location.label = location.locationName;
        location.value = location.locationName;
    });
    Locations.unshift(allOptions('locationID'));

    Branches.map((branch) => {
        branch.label = branch.branchName;
        branch.value = branch.branchName;
    });
    Branches.unshift(allOptions('branchID'));

    Facilities.map((facility) => {
        facility.label = facility.facilityName;
        facility.value = facility.facilityName;
    });
    Facilities.unshift(allOptions('facilityID'));

    Buildings.map((building) => {
        building.label = building.buildingName;
        building.value = building.buildingName;
    });
    Buildings.unshift(allOptions('buildingID'));

    Floors.map((floor) => {
        floor.label = floor.floorName;
        floor.value = floor.floorName;
    });
    Floors.unshift(allOptions('floorID'));

    Zones.map((zone) => {
        zone.label = zone.zoneName;
        zone.value = zone.zoneName;
    });
    Zones.unshift(allOptions('zoneID'));

    const [Location, setLocation] = useState<any>(allOptions('locationID'));
    const [Branch, setBranch] = useState<any>(allOptions('branchID'));
    const [Facility, setFacility] = useState<any>(allOptions('facilityID'));
    const [Building, setBuilding] = useState<any>(allOptions('buildingID'));
    const [Floor, setFloor] = useState<any>(allOptions('floorID'));
    const [Zone, setZone] = useState<any>(allOptions('zoneID'));
    const [UserRole, setUserRole] = useState<any>('');

    const [BranchesOptions, setBranchesOptions] = useState<Array<any>>([]);
    const [FacilitiesOptions, setFacilitiesOptions] = useState<Array<any>>([]);
    const [BuildingOptions, setBuildingOptions] = useState<Array<any>>([]);
    const [FloorOptions, setFloorOptions] = useState<Array<any>>([]);
    const [ZoneOptions, setZoneOptions] = useState<Array<any>>([]);

    const [modal, setModal] = useState<boolean>(false);
    const [Title, setTitle] = useState<string>('Location');

    const [formData, setFormData] = useState<any>({
        employeeID: '',
        email: '',
        mobileNumber: '',
        name: '',
        emailNotification: emailNotificationOptions[0],
        smsNotification: smsNotificationOptions[0]
    });
    const [formError, setFormError] = useState<any>({});

    const HandleClose = () => {
        setModal(false);
        setOpenModal(false);
    }

    const HandleLocationChange = (location: any) => {
        let branchesOptions = [];

        if(location.value != 'all'){
            branchesOptions = Branches.filter(branch =>
                branch.locationID == location.locationID
            );
            branchesOptions.unshift(allOptions('branchID'));
        }

        setBranchesOptions(branchesOptions);
        setLocation(location);

        setFacilitiesOptions([]);
        setBuildingOptions([]);
        setFloorOptions([]);
        setZoneOptions([]);
        setBranch(allOptions('branchID'));
        setFacility(allOptions('facilityID'));
        setBuilding(allOptions('buildingID'));
        setFloor(allOptions('floorID'));
        setZone(allOptions('zoneID'));
    }

    const HandleBranchChange = (branch: any) => {
        let facilityOptions = [];

        if(branch.value != 'all'){
            facilityOptions = Facilities.filter(facility =>
                facility.locationID == branch.locationID &&
                facility.branchID == branch.branchID
            );
            facilityOptions.unshift(allOptions('facilityID'));
        }

        setFacilitiesOptions(facilityOptions);
        setBranch(branch);

        setBuildingOptions([]);
        setFloorOptions([]);
        setZoneOptions([]);
        setFacility(allOptions('facilityID'));
        setBuilding(allOptions('buildingID'));
        setFloor(allOptions('floorID'));
        setZone(allOptions('zoneID'));
    }

    const HandleFacilityChange = (facility: any) => {
        let buildingOptions = [];

        if(facility.value != 'all'){
            buildingOptions = Buildings.filter(building =>
                building.locationID == facility.locationID &&
                building.branchID == facility.branchID &&
                building.facilityID == facility.facilityID
            );
            buildingOptions.unshift(allOptions('buildingID'));
        }

        setBuildingOptions(buildingOptions);
        setFacility(facility);

        setFloorOptions([]);
        setZoneOptions([]);
        setBuilding(allOptions('buildingID'));
        setFloor(allOptions('floorID'));
        setZone(allOptions('zoneID'));
    }

    const handleBuildingChange = (building: any) => {
        let floorOptions = [];

        if(building.value != 'all'){
            floorOptions = Floors.filter(floor =>
                floor.locationID == building.locationID &&
                floor.branchID == building.branchID &&
                floor.facilityID == building.facilityID &&
                floor.buildingID == building.buildingID
            );
            floorOptions.unshift(allOptions('floorID'));
        }

        setFloorOptions(floorOptions);
        setBuilding(building);

        setZoneOptions([]);
        setFloor(allOptions('floorID'));
        setZone(allOptions('zoneID'));
    }

    const handleFloorChange = (floor: any) => {
        let zoneOptions = [];

        if(floor.value != 'all'){
            zoneOptions = Zones.filter(zone =>
                zone.locationID == floor.locationID &&
                zone.branchID == floor.branchID &&
                zone.facilityID == floor.facilityID &&
                zone.buildingID == floor.buildingID &&
                zone.floorID == floor.floorID
            );
            zoneOptions.unshift(allOptions('zoneID'));
        }

        setZoneOptions(zoneOptions);
        setFloor(floor);

        setZone(allOptions('zoneID'));
    }

    const handleZoneChange = (zone: any) => {
        setZone(zone);
    }

    const HandleUserRoleChange = (userRole: any) => {
        setUserRole(userRole);
    }

    const handleChange = (e: any, type:string="string") => {
        let { name, value } = e.target;

        if(type == "number"){
            value = value.replace(/[^\d-]/g, '')
        }

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value
        }))
    };

    const handleSelectChange = (e: any, name: string) => {
        setFormData((prevData: any) => ({
            ...prevData,
            [name]: e
        }))
    }

    const HandleValid = () => {
        let isValid: boolean = true;
        let error: any = {};

        if(formData.employeeID){
            if(formData.employeeID == "" || String(formData.employeeID).trim() == ""){
                error['employeeID'] = "Employee ID is required";
                isValid = false;
            }
        } else {
            error['employeeID'] = "Employee ID is required";
            isValid = false;
        }

        if(formData.email){
            if(formData.email == "" || formData.email.trim() == ""){
                error['email'] = "Email is required";
                isValid = false;
            }
        } else {
            error['email'] = "Email is required";
            isValid = false;
        }

        if(formData.mobileNumber){
            if(formData.mobileNumber == "" || formData.mobileNumber.trim() == ""){
                error['mobileNumber'] = "Mobile Number is required";
                isValid = false;
            }
        } else {
            error['mobileNumber'] = "Mobile Number is required";
            isValid = false;
        }

        if(formData.name){
            if(formData.name == "" || formData.name.trim() == ""){
                error['name'] = "Full Name is required";
                isValid = false;
            }
        } else {
            error['name'] = "Full Name is required";
            isValid = false;
        }

        if(UserRole == ''){
            error['userRole'] = "User Role is required";
            isValid = false;
        }

        setFormError(error);

        return isValid;
    }

    const HandleAddLocation = async () => {
        if(HandleValid()){
            let Data = {...formData};

            if(Location.locationID == 'all'){
                Data['locationID'] = 'all';
                Data['branchID'] = 'all';
                Data['facilityID'] = 'all';
                Data['buildingID'] = 'all';
                Data['floorID'] = 'all';
                Data['zoneID'] = 'all';
            } else if(Branch.branchID == 'all'){
                Data['locationID'] = Location.locationID;
                Data['branchID'] = 'all';
                Data['facilityID'] = 'all';
                Data['buildingID'] = 'all';
                Data['floorID'] = 'all';
                Data['zoneID'] = 'all';
            } else if(Facility.facilityID == 'all'){
                Data['locationID'] = Location.locationID;
                Data['branchID'] = Branch.branchID;
                Data['facilityID'] = 'all';
                Data['buildingID'] = 'all';
                Data['floorID'] = 'all';
                Data['zoneID'] = 'all';
            } else if(Building.buildingID == 'all'){
                Data['locationID'] = Location.locationID;
                Data['branchID'] = Branch.branchID;
                Data['facilityID'] = Facility.facilityID;
                Data['buildingID'] = 'all';
                Data['floorID'] = 'all';
                Data['zoneID'] = 'all';
            } else if(Floor.floorID == 'all'){
                Data['locationID'] = Location.locationID;
                Data['branchID'] = Branch.branchID;
                Data['facilityID'] = Facility.facilityID;
                Data['buildingID'] = Building.buildingID;
                Data['floorID'] = 'all';
                Data['zoneID'] = 'all';
            } else if(Zone.zoneID == 'all'){
                Data['locationID'] = Location.locationID;
                Data['branchID'] = Branch.branchID;
                Data['facilityID'] = Facility.facilityID;
                Data['buildingID'] = Building.buildingID;
                Data['floorID'] = Floor.floorID ;
                Data['zoneID'] = 'all';
            } else {
                Data['locationID'] = Location.locationID;
                Data['branchID'] = Branch.branchID;
                Data['facilityID'] = Facility.facilityID;
                Data['buildingID'] = Building.buildingID;
                Data['floorID'] = Floor.floorID ;
                Data['zoneID'] = Zone.zoneID;
            }

            Data['userRole'] = UserRole.value;
            Data['emailNotification'] = formData.emailNotification.value;
            Data['smsNotification'] = formData.smsNotification.value;

            let message: string = "Something went wrong, unable to add";
            let status: string = "error";

            let response: any;

            if(LocationData.edit){
                message = "Something went wrong, unable to update";
                Data['id'] = LocationData.id;
                response = await UpdatedUser(Data)
            } else {
                response = await AddNewUser(Data);
            }

            if(response.data?.status == "success"){
                message = response.data.message;
                status = response.data.status;
                OnSuccess(true);
                HandleClose();
            } else if(response?.response?.status == 409){
                message = response?.response.data.message;
                status = response?.response.data.status;
            }

            CustomToast(message, status);
        }
    };

    const GetData = async () => {
        let response = await GetUser({
            id: LocationData.id
        });

        if(response.data?.status == "success"){
            let { id, employeeID, email, mobileNumber, name, locationID, branchID, facilityID, buildingID, floorID, zoneID, emailNotification, smsNotification, userRole } = response.data.data;

            if(locationID){
                let location = Locations.find(location => location.locationID == locationID);
                HandleLocationChange(location);
            }

            if(branchID){
                let branch = Branches.find(branch => branch.locationID == locationID && branch.branchID == branchID);
                HandleBranchChange(branch);
            }

            if(facilityID){
                let facility = Facilities.find(facility => facility.locationID == locationID && facility.branchID == branchID && facility.facilityID == facilityID);
                HandleFacilityChange(facility);
            }

            if(buildingID){
                let building = Buildings.find(building => building.locationID == locationID && building.branchID == branchID && building.facilityID == facilityID && building.buildingID == buildingID);
                handleBuildingChange(building);
            }

            if(floorID){
                let floor = Floors.find(floor => floor.locationID == locationID && floor.branchID == branchID && floor.facilityID == facilityID && floor.buildingID == buildingID && floor.floorID == floorID);
                handleFloorChange(floor);
            }

            if(zoneID){
                let zone = Zones.find(zone => zone.locationID == locationID && zone.branchID == branchID && zone.facilityID == facilityID && zone.buildingID == buildingID && zone.floorID == floorID && zone.zoneID == zoneID);
                handleZoneChange(zone);
            }

            HandleUserRoleChange(UserRoles.find(role => role.value == userRole));

            setFormData({
                id: id,
                employeeID: employeeID,
                email: email,
                mobileNumber: mobileNumber,
                name: name,
                emailNotification: emailNotificationOptions.find((notification) => notification.value.toLowerCase() === emailNotification.toLowerCase()),
                smsNotification: smsNotificationOptions.find((notification) => notification.value.toLowerCase() === smsNotification.toLowerCase()),
            })
        } else {
            CustomToast('User not found','error');
            HandleClose();
        }
    }

    useEffect(() => {
        if(OpenModal){
            setModal(OpenModal);
            setFormError({});
            if(LocationData.edit){
                GetData();
                setTitle('Edit User');
            } else {
                setTitle('Add User');
                setFormData({
                    employeeID: '',
                    email: '',
                    mobileNumber: '',
                    name: '',
                    emailNotification: emailNotificationOptions[0],
                    smsNotification: smsNotificationOptions[0]
                })
                setUserRole('');

                if(userDetails?.locationID){
                    let location = Locations.find(location => location.locationID == userDetails?.locationID);
                    HandleLocationChange(location);

                    if(userDetails?.branchID){
                        let branch = Branches.find(branch => branch.locationID == userDetails?.locationID && branch.branchID == userDetails?.branchID);
                        HandleBranchChange(branch);

                        if(userDetails?.facilityID){
                            let facility = Facilities.find(facility => facility.locationID == userDetails?.locationID && facility.branchID == userDetails?.branchID && facility.facilityID == userDetails?.facilityID);
                            HandleFacilityChange(facility);

                            if(userDetails?.buildingID){
                                let building = Buildings.find(building => building.locationID == userDetails?.locationID && building.branchID == userDetails?.branchID && building.facilityID == userDetails?.facilityID && building.buildingID == userDetails?.buildingID);
                                handleBuildingChange(building);

                                if(userDetails?.floorID){
                                    let floor = Floors.find(floor => floor.locationID == userDetails?.locationID && floor.branchID == userDetails?.branchID && floor.facilityID == userDetails?.facilityID && floor.buildingID == userDetails?.buildingID && floor.floorID == userDetails?.floorID);
                                    handleFloorChange(floor);

                                    if(userDetails?.zoneID){
                                        let zone = Zones.find(zone => zone.locationID == userDetails?.locationID && zone.branchID == userDetails?.branchID && zone.facilityID == userDetails?.facilityID && zone.buildingID == userDetails?.buildingID && zone.floorID == userDetails?.floorID && zone.zoneID == userDetails?.zoneID);
                                        handleZoneChange(zone);
                                    } else {
                                        setZone('');
                                        setZoneOptions([]);
                                    }
                                } else {
                                    setFloor('');
                                    setZone('');
                                    setZoneOptions([]);
                                }
                            } else {
                                setZoneOptions([]);
                                setFloorOptions([]);
                                setBuilding('');
                                setFloor('');
                                setZone('');
                            }
                        } else {
                            setFloorOptions([]);
                            setBuildingOptions([]);
                            setZoneOptions([]);
                            setFacility('');
                            setBuilding('');
                            setFloor('');
                            setZone('');
                        }
                    } else {
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
                } else {
                    setBranchesOptions([]);
                    setFacilitiesOptions([]);
                    setBuildingOptions([]);
                    setFloorOptions([]);
                    setZoneOptions([]);
                    setLocation(allOptions('locationID'));
                    setBranch(allOptions('branchID'));
                    setFacility(allOptions('facilityID'));
                    setBuilding(allOptions('buildingID'));
                    setFloor(allOptions('floorID'));
                    setZone(allOptions('zoneID'));
                }
            }
        }
    }, [OpenModal])

    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" open={modal} onClose={HandleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0" />
                </Transition.Child>
                <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-center justify-center px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel as="div" className="panel my-8 w-full max-w-5xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold dark:text-white">{Title}</h5>
                                    <button type="button" className="text-white-dark hover:text-dark dark:text-white" onClick={HandleClose}>
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-col items-center">
                                        <form className="flex flex-col gap-8 w-full">
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <Select
                                                        name="location"
                                                        id="location"
                                                        className='location w-full dark:text-white'
                                                        placeholder="Location"
                                                        options={Locations}
                                                        isSearchable={true}
                                                        value={Location}
                                                        onChange={(e) => HandleLocationChange(e)}
                                                        isDisabled={userDetails?.locationID != null ? true : false}
                                                    />
                                                </div>
                                                <div className='w-full'>
                                                    <Select
                                                        name="branch"
                                                        id="branch"
                                                        className="branch w-full dark:text-white"
                                                        placeholder="Branch"
                                                        options={BranchesOptions}
                                                        isSearchable={true}
                                                        value={Branch}
                                                        onChange={(e) => HandleBranchChange(e)}
                                                        isDisabled={userDetails?.branchID != null ? true : false}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <Select
                                                        name="facility"
                                                        id="facility"
                                                        className="facility w-full dark:text-white"
                                                        placeholder="Facility"
                                                        options={FacilitiesOptions}
                                                        isSearchable={true}
                                                        value={Facility}
                                                        onChange={(e) => HandleFacilityChange(e)}
                                                        isDisabled={userDetails?.facilityID != null ? true : false}
                                                    />
                                                </div>
                                                <div className='w-full'>
                                                    <Select
                                                        name="building"
                                                        id="building"
                                                        className="building w-full dark:text-white"
                                                        placeholder="Building"
                                                        options={BuildingOptions}
                                                        isSearchable={true}
                                                        value={Building}
                                                        onChange={(e) => handleBuildingChange(e)}
                                                        isDisabled={userDetails?.buildingID != null ? true : false}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <Select
                                                        name="floor"
                                                        id="floor"
                                                        className="floor w-full dark:text-white"
                                                        placeholder="Floor"
                                                        options={FloorOptions}
                                                        isSearchable={true}
                                                        value={Floor}
                                                        onChange={(e) => handleFloorChange(e)}
                                                        isDisabled={userDetails?.floorID != null ? true : false}
                                                    />
                                                </div>
                                                <div className='w-full'>
                                                    <Select
                                                        name="zone"
                                                        id="zone"
                                                        className="zone w-full dark:text-white"
                                                        placeholder="Zone"
                                                        options={ZoneOptions}
                                                        isSearchable={true}
                                                        value={Zone}
                                                        onChange={(e) => handleZoneChange(e)}
                                                        isDisabled={userDetails?.zoneID != null ? true : false}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="employeeID" className="dark:text-white">Employee ID *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="employeeID"
                                                        onChange={handleChange}
                                                        value={formData.employeeID}
                                                    />
                                                    {formError.employeeID && <div className='text-sm text-danger'>{formError.employeeID}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="email" className='dark:text-white'>Email *</label>
                                                    <input
                                                        type="email"
                                                        className='form-input dark:text-white'
                                                        name="email"
                                                        onChange={handleChange}
                                                        value={formData.email}
                                                    />
                                                    {formError.email && <div className='text-sm text-danger'>{formError.email}</div>}
                                                </div>
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="mobileNumber" className="dark:text-white">Mobile Number *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="mobileNumber"
                                                        onChange={(e) => handleChange(e, 'number')}
                                                        value={formData.mobileNumber}
                                                    />
                                                    {formError.mobileNumber && <div className='text-sm text-danger'>{formError.mobileNumber}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="name" className='dark:text-white'>Full Name *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="name"
                                                        onChange={handleChange}
                                                        value={formData.name}
                                                    />
                                                    {formError.name && <div className='text-sm text-danger'>{formError.name}</div>}
                                                </div>
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="emailNotification" className="dark:text-white">Email Notification</label>
                                                    <Select
                                                        name="emailNotification"
                                                        id="emailNotification"
                                                        className='emailNotification w-full dark:text-white'
                                                        placeholder="Select Email Notification"
                                                        options={emailNotificationOptions}
                                                        isSearchable={true}
                                                        value={formData.emailNotification}
                                                        onChange={(e) => handleSelectChange(e, 'emailNotification')}
                                                    />
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="smsNotification" className="dark:text-white">SMS Notification</label>
                                                    <Select
                                                        name="smsNotification"
                                                        id="smsNotification"
                                                        className="smsNotification w-full dark:text-white"
                                                        placeholder="Select SMS Notification"
                                                        options={smsNotificationOptions}
                                                        isSearchable={true}
                                                        value={formData.smsNotification}
                                                        onChange={(e) => handleSelectChange(e, 'smsNotification')}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="userRole" className="dark:text-white">User Role *</label>
                                                    <Select
                                                        name="userRole"
                                                        id="userRole"
                                                        className='userRole w-full dark:text-white'
                                                        placeholder="Select User Role"
                                                        options={userDetails?.userRole == "Admin" ? UserRoles.slice(0, 3) : userDetails?.userRole == "Manager" ? UserRoles.slice(0, 2) : UserRoles}
                                                        isSearchable={true}
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                        value={UserRole}
                                                        onChange={(e) => HandleUserRoleChange(e)}
                                                    />
                                                    {formError.userRole && <div className='text-sm text-danger'>{formError.userRole}</div>}
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-primary" onClick={HandleAddLocation}>
                                            {LocationData.edit ? 'Update' : 'Add'}
                                        </button>
                                        <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={HandleClose}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AddUser  ;
