import React, { useState, useEffect } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { DeleteIcon, EditIcon } from '@/source/helpers/Icons';
import { DeleteSensor, GetSensor } from '@/source/service/DeviceConfigService';
import IconPlus from '@/components/Icon/IconPlus';
import Swal from "sweetalert2";
import CustomToast from '@/helpers/CustomToast';
import { useNavigate, useParams } from 'react-router-dom';
import IconSettings from '@/components/Icon/IconSettings';
import SensorSettings from './Component/SensorSettings';
import './Sensor.css';
import { IRootState } from '@/store';

const Sensor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const { locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID } = params;

    useEffect(() => {
        dispatch(setPageTitle('Device config - Sensor'));
    });

    const storedUserDetails = useSelector((state: IRootState) => state.themeConfig).userDetails;
    const userDetails: any = storedUserDetails != null ? JSON.parse(storedUserDetails) : {};

    const [loading, setLoading] = useState<boolean>(false);

    const [Image, setImage] = useState<any>({});

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [5, 10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<Array<any>>([]);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'sensorNameUnit', direction: 'asc' });
    const [BreadCrumb, setBreadCrumb] = useState<Array<any>>([]);

    const [sensorSettingsForm, setSensorSettingsForm] = useState<boolean>(false);
    const [sensorSettingsDefaultData, setSensorSettingsDefaultData] = useState<any>({
        edit: false
    });
    const [OnSuccess, setOnSuccess] = useState<boolean>(false);

    const HandleNavigate = () => {
        navigate('/device-config');
    }

    const HandleBreadCrumb = (location: any) => {
        let { locationID, branchID, facilityID, buildingID, floorID, id } = location;

        let url = '/device-config';
        if(location.deviceName){
            return;
        }
        if(location.zoneName){
            url = `${url}/${locationID}/${branchID}/${facilityID}/${buildingID}/${floorID}/${id}`;
        }
        if(location.floorName){
            url = `${url}/${locationID}/${branchID}/${facilityID}/${buildingID}/${id}`;
        }
        if(location.buildingName){
            url = `${url}/${locationID}/${branchID}/${facilityID}/${id}`;
        }
        if(location.facilityName){
            url = `${url}/${locationID}/${branchID}/${id}`;
        }
        if(location.branchName){
            url = `${url}/${locationID}/${id}`;
        }
        if(location.locationName){
            url = `${url}/${id}`;
        }

        navigate(url);
    }

    const GetData = async () => {
        setLoading(true);
        let response = await GetSensor({
            id: 'all',
            locationID: locationID,
            branchID: branchID,
            facilityID: facilityID,
            buildingID: buildingID,
            floorID: floorID,
            zoneID: zoneID,
            deviceID: deviceID
        });

        if(response.data?.status == "success"){
            response = response.data;
            setBreadCrumb(response.data.locationDetails);
            setInitialRecords(sortBy(response.data.data, 'sensorNameUnit'));
            let Image = response.data.locationDetails.filter((data: any) => data.image && data.image != null && data.image != "");
            setImage({
                showImage: true,
                image: Image
            });
        } else {
            CustomToast('Unable to fetch sensor', 'error');
        }

        setLoading(false);
    }

    const HandleAdd = () => {
        navigate(`/sensor/${locationID}/${branchID}/${facilityID}/${buildingID}/${floorID}/${zoneID}/${deviceID}`);
    }

    const HandleEdit = (id: number) => {
        navigate(`/sensor/${locationID}/${branchID}/${facilityID}/${buildingID}/${floorID}/${zoneID}/${deviceID}/${id}`);
    }

    const Delete = async (id: number) => {
        let message: string = 'Unable to delete sensor';
        let status: string = 'error';

        let response = await DeleteSensor({
            id: id
        });

        if(response?.data?.status == "success"){
            message = response.data.message;
            status = response.data.status;
            setOnSuccess(true);
        }

        CustomToast(message, status);
    }

    const HandleDelete = (id: number) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure, you want to delete this sensor?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result:any) => {
            if (result.value) {
                Delete(id);
            }
        });
    }

    const handleSettings = (id: number, sensorTag: string) => {
        setOnSuccess(false);
        setSensorSettingsDefaultData({
            id: id,
            sensorTag: sensorTag
        });
        setSensorSettingsForm(true);
    }

    useEffect(() => {
        if(OnSuccess){
            setOnSuccess(false);
            GetData();
        }
    }, [OnSuccess])

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    useEffect(() => {
        GetData();
    }, [params])

    return (
        // <div className='grid xl:grid-cols-3 md:grid-cols-2 gap-6 mb-6'>
        <div className='grid gap-6 mb-6'>
            {/* <div className="panel h-full xl:col-span-2 !p-3 rounded-xl"> */}
            <div className="panel h-full !p-3 rounded-xl">
                <div className='flex flex-row justify-between pb-2'>
                    <ul className="flex space-x-2 rtl:space-x-reverse text-lg px-2">
                        <li className="dark:text-white-light text-black font-bold text-md hover:underline cursor-pointer" onClick={HandleNavigate}>
                            <span>Location</span>
                        </li>
                        {BreadCrumb.map((selected, index) => <li key={index} className={`dark:text-white-light before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-black font-bold text-md hover:underline ${selected.click == false ? 'pointer-events-none' : 'cursor-pointer'}`} onClick={() => HandleBreadCrumb(selected)}>
                            <span>{selected.locationName || selected.branchName || selected.facilityName || selected.buildingName || selected.floorName || selected.zoneName || selected.deviceName}</span>
                        </li>)}
                    </ul>
                    {userDetails?.userRole == "systemSpecialist" && <div className='flex flex-row gap-2'>
                        <button className='btn btn-primary bg-[#133c81] gap-2 shadow-none border-none' type="button" onClick={HandleAdd}>
                            <IconPlus />
                            Add Sensor
                        </button>
                    </div>}
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className='whitespace-nowrap table-hover'
                        records={recordsData}
                        columns={[
                            {
                                accessor: 'sensorName',
                                titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                cellsClassName: '!text-center !px-1 dark:text-white',
                                title: 'Sensor Name',
                                sortable: true,
                            },
                            {
                                accessor: 'sensorTag',
                                titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                cellsClassName: '!text-center !px-1 dark:text-white',
                                title: 'Sensor Tag',
                                sortable: true
                            },
                            {
                                accessor: 'slotID',
                                titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                cellsClassName: '!text-center !px-1 dark:text-white',
                                title: 'Slot ID',
                                sortable: true
                            },
                            {
                                accessor: 'sensorOutput',
                                titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                cellsClassName: '!text-center !px-1 dark:text-white',
                                title: 'Output Type',
                                sortable: true
                            },
                            {
                                accessor: 'units',
                                titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                cellsClassName: '!text-center !px-1 dark:text-white',
                                title: 'Units',
                                sortable: true
                            },
                            {
                                accessor: 'actions',
                                titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                cellsClassName: '!text-center !px-1 dark:text-white',
                                title: 'Actions',
                                render: ({ id, sensorTag }: any) => <div className='flex gap-1 justify-center'>
                                    <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => HandleEdit(id)}>
                                        <EditIcon fill="rgb(67 97 238 / 1)" />
                                    </button>
                                    {userDetails?.userRole == "systemSpecialist" && <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => HandleDelete(id)}>
                                        <DeleteIcon fill="rgb(255 0 15)" />
                                    </button>}
                                    <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => handleSettings(id, sensorTag)}>
                                        <IconSettings />
                                    </button>
                                </div>,
                                sortable: true
                            }
                        ]}
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => <div className="dark:text-white">{`Showing  ${from} to ${to} of ${totalRecords} entries`}</div>}
                    />
                </div>
            </div>
            <SensorSettings
                openModal={sensorSettingsForm}
                setOpenModal={setSensorSettingsForm}
                defaultData={sensorSettingsDefaultData}
                onSuccess={setOnSuccess}
            />
        </div>
    );
};

export default Sensor;
