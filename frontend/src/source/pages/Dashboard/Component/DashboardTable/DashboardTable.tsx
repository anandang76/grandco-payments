import { useEffect, useState } from 'react';

import "./DashboardTable.css";
import DataTables from '../DataTables/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentAlertLocation } from '@/store/themeConfigSlice';
import { useNavigate } from 'react-router-dom';
import { IRootState } from '@/store';
import { SetAQICategory } from '@/source/helpers/HelperFunctions';

const DashboardTable = ({ setMapDetails, setImage }: any) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let Breadcrumbs: Array<any> = useSelector((state: IRootState) => state.themeConfig.breadCrumb);
    let Alerts: Array<any> = useSelector((state: IRootState) => state.themeConfig.notifications);
    const storedUser = localStorage.getItem('userDetails')
    const storedLocations = localStorage.getItem('location')
    const storedBranches = localStorage.getItem('branch')
    const storedFacilities = localStorage.getItem('facility')
    const storedBuildings = localStorage.getItem('building')
    const storedFloors = localStorage.getItem('floor')
    const storedZones = localStorage.getItem('zone');

    const User: any = storedUser != null ? JSON.parse(storedUser) : {};
    const Locations: Array<any> = storedLocations != null ? JSON.parse(storedLocations) : [];
    const Branches: Array<any> = storedBranches != null ? JSON.parse(storedBranches) : [];
    const Facilities: Array<any> = storedFacilities != null ? JSON.parse(storedFacilities) : [];
    const Buildings: Array<any> = storedBuildings != null ? JSON.parse(storedBuildings) : [];
    const Floors: Array<any> = storedFloors != null ? JSON.parse(storedFloors) : [];
    const Zones: Array<any> = storedZones != null ? JSON.parse(storedZones) : [];

    const [loading, setloading] = useState(false);
    const [Data, setData] = useState<Array<any>>([]);
    const [SelectedData, setSelectedData] = useState<Array<any>>([]);
    const [Name, setName] = useState<any>({title: 'Location Name', accessor: 'locationName'});

    const HandleZone = (data: any) => {
        navigate(`/zone/${data.zoneID}`)
    }

    const Handledata = (data: any) => {

        dispatch(setCurrentAlertLocation(data))
        setloading(true);

        let newRecords: Array<any> = [];
        let accessors: {title: string, accessor: string} = {title: '', accessor: ''};

        if(data.locationName){
            newRecords = Branches.filter((branch: any) => branch.locationID === data.locationID);

            newRecords.map((record: any) =>{
                let currentLocationAQI = 0;
                let currentAQIArray: Array<number> = [];
                Facilities.map((facility: any) => {
                    if(facility.branchID == record.branchID){
                        let currentAQI = 0;
                        Zones.map(current => {
                            if(current.facilityID == facility.facilityID){
                                if(current.aqiValue && Number(current.aqiValue)){
                                    if(currentAQI < current.aqiValue){
                                        currentAQI = Number(current.aqiValue);
                                    }
                                }
                            }
                        })
                        currentAQI > 0 && currentAQIArray.push(currentAQI);
                    }
                })

                currentLocationAQI = currentAQIArray.reduce((total, current) => {
                    return total + current;
                }, 0);

                currentLocationAQI = Number(currentAQIArray) / currentAQIArray.length;

                record['aqiValue'] = currentLocationAQI;
                if(currentLocationAQI > 0) {
                    record['aqicategory'] = SetAQICategory(currentLocationAQI);
                }
            })
            accessors = {title: 'Branch Name', accessor: 'branchName'};
        } else if(data.branchName){
            newRecords = Facilities.filter((branch: any) => branch.branchID === data.branchID);

            // Calculating AQI
            newRecords.map((record: any) =>{
                let currentAQI = 0;

                Zones.map(current => {
                    if(current.facilityID == record.facilityID){
                        if(current.aqiValue && Number(current.aqiValue)){
                            if(currentAQI < current.aqiValue){
                                currentAQI = Number(current.aqiValue);
                            }
                        }
                    }
                })

                record['aqiValue'] = currentAQI;
                if(currentAQI > 0) {
                    record['aqicategory'] = SetAQICategory(Number(currentAQI));
                }
            })
            accessors = {title: 'Facility Name', accessor: 'facilityName'};
        } else if(data.facilityName){
            newRecords = Buildings.filter((branch: any) => branch.facilityID === data.facilityID);

            // Calculating AQI
            newRecords.map((record: any) =>{
                let currentAQI = 0;
                Zones.map(current => {
                    if(current.buildingID == record.buildingID){
                        if(current.aqiValue && Number(current.aqiValue)){
                            if(currentAQI < current.aqiValue){
                                currentAQI = Number(current.aqiValue);
                            }
                        }
                    }
                })

                record['aqiValue'] = currentAQI;
                if(currentAQI > 0) {
                    record['aqicategory'] = SetAQICategory(currentAQI);
                }
            })
            accessors = {title: 'Building Name', accessor: 'buildingName'};
        } else if(data.buildingName){
            newRecords = Floors.filter((branch: any) => branch.buildingID === data.buildingID);

            // Calculating AQI
            newRecords.map((record: any) => {
                let currentAQI = 0;
                Zones.map(current => {
                    if(current.floorID == record.floorID){
                        if(current.aqiValue && Number(current.aqiValue)){
                            if(currentAQI < current.aqiValue){
                                currentAQI = Number(current.aqiValue);
                            }
                        }
                    }
                })

                record['aqiValue'] = currentAQI;
                if(currentAQI > 0) {
                    record['aqicategory'] = SetAQICategory(currentAQI);
                }
            })
            accessors = {title: 'Floor Name', accessor: 'floorName'};
        } else if(data.floorName){
            newRecords = Zones.filter((branch: any) => branch.floorID === data.floorID);
            newRecords.map((record: any) => {
                if(Number(record.aqiValue) > 0) {
                    record['aqicategory'] = SetAQICategory(Number(record.aqiValue));
                }
            })
            accessors = {title: 'Zone Name', accessor: 'zoneName'};
        } else if(data.zoneName){
            HandleZone(data);
        } else {
            newRecords = Locations;
            newRecords.map((record: any) =>{
                let currentBranchAQI = 0;
                let currentAQIArray: Array<number> = [];
                Branches.map((branch: any) => {
                    if(branch.locationID == record.locationID){
                        Facilities.map((facility: any) => {
                            if(facility.branchID == branch.branchID){
                                let currentAQI = 0;
                                Zones.map(current => {
                                    if(current.facilityID == facility.facilityID){
                                        if(current.aqiValue && Number(current.aqiValue)){
                                            if(currentAQI < current.aqiValue){
                                                currentAQI = Number(current.aqiValue);
                                            }
                                        }
                                    }
                                })
                                currentAQI > 0 && currentAQIArray.push(currentAQI);
                            }
                        })
                        currentBranchAQI = currentAQIArray.reduce((total, current) => {
                            return total + current;
                        }, 0);

                        currentBranchAQI = Number(currentAQIArray) / currentAQIArray.length;

                        // record['aqiValue'] = currentBranchAQI;
                        record = {
                            ...record,
                            aqiValue: currentBranchAQI
                        };
                        if(currentBranchAQI > 0) {
                            record['aqicategory'] = SetAQICategory(currentBranchAQI);
                        }
                    }
                })
            })
            accessors = {title: 'Location Name', accessor: 'locationName'};
        }

        setData(newRecords);
        setName(accessors);

        setloading(false);
    }

    const ChangeLocation = (data: any, renderBreadCrumb: boolean=false) => {
        Handledata(data);

        if(renderBreadCrumb){
            let CurrentBreadCrumb: Array<any> = [];

            if(User.locationID){
                CurrentBreadCrumb.push(Locations.find(location => location.locationID == User.locationID));
            }

            if(User.branchID){
                CurrentBreadCrumb.push(Branches.find(branch => branch.locationID == User.locationID && branch.branchID == User.branchID));
            }

            if(User.facilityID){
                CurrentBreadCrumb.push(Facilities.find(facility => facility.locationID == User.locationID && facility.branchID == User.branchID && facility.facilityID == User.facilityID));
            }

            if(User.buildingID){
                CurrentBreadCrumb.push(Buildings.find(building => building.locationID == User.locationID && building.branchID == User.branchID && building.facilityID == User.facilityID && building.buildingID == User.buildingID));
            }

            if(User.floorID){
                CurrentBreadCrumb.push(Floors.find(floor => floor.locationID == User.locationID && floor.branchID == User.branchID && floor.facilityID == User.facilityID && floor.buildingID == User.buildingID && floor.floorID == User.floorID));
            }

            if(User.zoneID){
                CurrentBreadCrumb.push(Zones.find(zone => zone.locationID == User.locationID && zone.branchID == User.branchID && zone.facilityID == User.facilityID && zone.buildingID == User.buildingID && zone.floorID == User.floorID && zone.zoneID == User.zoneID));
            }

            CurrentBreadCrumb.map((breadCrumb, index) => {
                if(index != CurrentBreadCrumb.length-1){
                    breadCrumb['click'] = false;
                }
            });

            setSelectedData(CurrentBreadCrumb);
        } else {
            setSelectedData((prevData: any) => [
                ...prevData,
                data
            ]);
        }
    }

    const ChangeData = (data: any, index: any, breadcrumb: any="") => {
        Handledata(data);
        if(breadcrumb != ""){
            setSelectedData(breadcrumb);
        } else {
            setSelectedData(SelectedData.slice(0, index));
        }
    }

    useEffect(() => {
        // if(Data[0]?.floorName || Data[0]?.zoneName){
        //     let Image = Data.filter((data) => data.image && data.image != null && data.image != "");
        //     setImage({
        //         showImage: true,
        //         image: Image
        //     });
        // } else {
        //     let coordinates = Data.filter((data: any) => data.coordinates);
        //     setMapDetails(coordinates);
        //     setImage({
        //         showImage: false,
        //         image: []
        //     });
        // }
        let showImage = false;
        let image: Array<any> = [];
        let coordinates = [];
        if(SelectedData.length > 0){
            let currentImage = SelectedData[SelectedData.length - 1];
            if(currentImage.image && currentImage.image != null && currentImage.image != ""){
                showImage = true;
                image = [currentImage];
            }
        } else {
            coordinates = Data.filter((data: any) => data.coordinates)
        }

        setMapDetails(coordinates);
        setImage({
            showImage: showImage,
            image: image
        });
    // }, [Data])
    }, [Data, SelectedData])

    useEffect(() => {
        Handledata(SelectedData.length > 0 ? SelectedData[SelectedData?.length-1] : "location")
    }, [Alerts])

    useEffect(() => {
        if(User){
            if(User.zoneID){
                ChangeLocation(Zones.find(zone => zone.locationID == User.locationID && zone.branchID == User.branchID && zone.facilityID == User.facilityID && zone.buildingID == User.buildingID && zone.floorID == User.floorID && zone.zoneID == User.zoneID), true);
            } else if(User.floorID){
                ChangeLocation(Floors.find(floor => floor.locationID == User.locationID && floor.branchID == User.branchID && floor.facilityID == User.facilityID && floor.buildingID == User.buildingID && floor.floorID == User.floorID), true);
            } else if(User.buildingID){
                ChangeLocation(Buildings.find(building => building.locationID == User.locationID && building.branchID == User.branchID && building.facilityID == User.facilityID && building.buildingID == User.buildingID), true);
            } else if(User.facilityID){
                ChangeLocation(Facilities.find(facility => facility.locationID == User.locationID && facility.branchID == User.branchID && facility.facilityID == User.facilityID), true);
            } else if(User.branchID){
                ChangeLocation(Branches.find(branch => branch.locationID == User.locationID && branch.branchID == User.branchID), true);
            } else if(User.locationID){
                ChangeLocation(Locations.find(location => location.locationID == User.locationID), true);
            }
        } else {
            let newRecords = Locations;
            newRecords.map((record: any) =>{
                let currentBranchAQI = 0;
                let currentAQIArray: Array<number> = [];
                Branches.map((branch: any) => {
                    if(branch.locationID == record.locationID){
                        Facilities.map((facility: any) => {
                            if(facility.branchID == branch.branchID){
                                let currentAQI = 0;
                                Zones.map(current => {
                                    if(current.facilityID == facility.facilityID){
                                        if(current.aqiValue && Number(current.aqiValue)){
                                            if(currentAQI < current.aqiValue){
                                                currentAQI = Number(current.aqiValue);
                                            }
                                        }
                                    }
                                })
                                currentAQI > 0 && currentAQIArray.push(currentAQI);
                            }
                        })
                        currentBranchAQI = currentAQIArray.reduce((total, current) => {
                            return total + current;
                        }, 0);

                        currentBranchAQI = Number(currentAQIArray) / currentAQIArray.length;

                        record['aqiValue'] = currentBranchAQI;
                        if(currentBranchAQI > 0) {
                            record['aqicategory'] = SetAQICategory(currentBranchAQI);
                        }
                    }
                })
            });
            setData(newRecords);
        }
    }, [])

    useEffect(() => {
        if(Breadcrumbs.length > 0){
            let currentLocation = Breadcrumbs[Breadcrumbs.length-1]
            ChangeData(currentLocation, Breadcrumbs.length-1, Breadcrumbs);
        }
    }, [Breadcrumbs])

    return (
        <div className="panel h-full xl:col-span-2 !p-3 rounded-xl">
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li onClick={() => ChangeData('location', 0)} className={`text-black dark:text-white font-bold text-md hover:underline ${User.locationID ? 'pointer-events-none' : 'cursor-pointer'}`}>
                    <span>Location</span>
                </li>
                {SelectedData.map((selected, index) => <li key={index} onClick={() => ChangeData(selected, index+1)} className={`dark:text-white before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-black font-bold text-md hover:underline ${selected.click == false ? 'pointer-events-none' : 'cursor-pointer'}`}>
                    <span>{selected.locationName || selected.branchName || selected.facilityName || selected.buildingName || selected.floorName}</span>
                </li>)}
            </ul>
            <div className="relative">
                <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                        </div>
                    ) : (
                        <DataTables
                            records={Data}
                            columnTitle={Name}
                            ChangeData={ChangeLocation}
                        />
                    )}

                </div>
            </div>
        </div>
    )
};

export default DashboardTable;

