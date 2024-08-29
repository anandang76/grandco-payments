import React, { useState, useEffect } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { AppSettingIcon, DeleteIcon, EditIcon } from '@/source/helpers/Icons';
import { DeleteDevice, GetDevice, ChangeDeviceMode } from '@/source/service/DeviceConfigService';
import IconPlus from '@/components/Icon/IconPlus';
import Map from '../../Dashboard/Component/Map/Map';
import themeConfig from '@/theme.config';
import AddDevice from './Component/AddDevice';
import Swal from "sweetalert2";
import CustomToast from '@/helpers/CustomToast';
import { useNavigate, useParams } from 'react-router-dom';
import "./Device.css";
import Select from 'react-select';
import AddCommuConfig from './Component/AddCommuConfig';
import CalibrationForm from './Component/CalibrationForm';
import BumpTestForm from './Component/BumpTestForm';
import { IRootState } from '@/store';
import FirmwareUpgradationForm from './Component/FirmwareUpgradationForm';
import DebugForm from './Component/DebugForm';
import ConfigurationForm from './Component/ConfigurationForm';
import EventLogForm from './Component/EventLogForm';

const Device = () => {
    const ApiURL = themeConfig.apiURL;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const { locationID, branchID, facilityID, buildingID, floorID, zoneID } = params;
    const DeviceModeArray: Array<any> = [
        {
            label: 'Disabled',
            value: 'disabled'
        },
        {
            label: 'Enabled',
            value: 'enabled'
        },
        {
            label: 'Bump Test',
            value: 'bumpTest'
        },
        {
            label: 'Calibration',
            value: 'calibration'
        },
        {
            label: 'Firmware Upgradation',
            value: 'firmwareUpgradation'
        },
        {
            label: 'Configuration',
            value: 'config'
        },
        {
            label: 'Debug',
            value: 'debug'
        },
        {
            label: 'Event Log',
            value: 'eventLog'
        }
    ];

    useEffect(() => {
        dispatch(setPageTitle('Device config - Device'));
    });

    const storedUserDetails = useSelector((state: IRootState) => state.themeConfig).userDetails;
    const userDetails: any = storedUserDetails != null ? JSON.parse(storedUserDetails) : {};

    const [loading, setLoading] = useState<boolean>(false);

    const [MapDetails, setMapDetails] = useState<Array<any>>([]);
    const [Image, setImage] = useState<any>({});

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [5, 10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(20);
    const [initialRecords, setInitialRecords] = useState<Array<any>>([]);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'deviceName', direction: 'asc' });
    const [BreadCrumb, setBreadCrumb] = useState<Array<any>>([]);

    const [deviceCommunForm, setDeviceCommunForm] = useState<boolean>(false);
    const [DeviceForm, setDeviceForm] = useState<boolean>(false);
    const [DeviceData, setDeviceData] = useState<any>({
        edit: false
    });
    const [OnSuccess, setOnSuccess] = useState<boolean>(false);

    const [calibrationForm, setCalibrationForm] = useState<boolean>(false);
    const [calibrationDefaultData, setCalibrationDefaultData] = useState<any>({});

    const [bumpTestForm, setBumpTestForm] = useState<boolean>(false);
    const [bumpTestDefaultData, setBumpTestDefaultData] = useState<any>({});

    const [firmwareUpgradationForm, setFirmwareUpgradationForm] = useState<boolean>(false);
    const [firmwareUpgradationDefaultData, setFirmwareUpgradationDefaultData] = useState<any>({});

    const [debugForm, setDebugForm] = useState<boolean>(false);
    const [debugDefaultData, setDebugDefaultData] = useState<any>({});

    const [configForm, setConfigForm] = useState<boolean>(false);
    const [configDefaultData, setConfigDefaultData] = useState<any>({});

    const [eventLogForm, setEventLogForm] = useState<boolean>(false);
    const [eventLogDefaultData, setEventLogDefaultData] = useState<any>({});

    const handleNavigate = () => {
        if (userDetails?.locationID) {
            return;
        }
        navigate('/device-config');
    }

    const HandleBreadCrumb = (location: any) => {
        let { locationID, branchID, facilityID, buildingID, id } = location;
        let url = '/device-config';
        if (location.zoneName || (location.floorName && userDetails?.floorID) || (location.buildingName && userDetails?.buildingID) || (location.facilityName && userDetails?.facilityID) || (location.branchName && userDetails?.branchID) || (location.locationName && userDetails?.locationID)) {
            return;
        }
        if (location.floorName) {
            url = `${url}/${locationID}/${branchID}/${facilityID}/${buildingID}/${id}`;
        }
        if (location.buildingName) {
            url = `${url}/${locationID}/${branchID}/${facilityID}/${id}`;
        }
        if (location.facilityName) {
            url = `${url}/${locationID}/${branchID}/${id}`;
        }
        if (location.branchName) {
            url = `${url}/${locationID}/${id}`;
        }
        if (location.locationName) {
            url = `${url}/${id}`;
        }

        navigate(url);
    }

    const HandleDevice = (device: any) => {
        let { locationID, branchID, facilityID, buildingID, floorID, zoneID, id } = device;
        // navigate(`/device-config/${locationID}/${branchID}/${facilityID}/${buildingID}/${floorID}/${zoneID}/${id}`);
    }

    const GetData = async () => {
        setLoading(true);
        let response = await GetDevice({
            id: 'all',
            locationID: locationID,
            branchID: branchID,
            facilityID: facilityID,
            buildingID: buildingID,
            floorID: floorID,
            zoneID: zoneID
        });

        if (response.data?.status == "success") {
            response = response.data;
            setBreadCrumb(response.data.locationDetails);
            setInitialRecords(sortBy(response.data.data, 'deviceName'));
            let Image = response.data.locationDetails[response.data.locationDetails.length - 1];
            setImage({
                showImage: true,
                image: [Image]
            });
        } else {
            CustomToast('Unable to fetch devices', 'error');
        }

        setLoading(false);
    }

    const getDeviceMode = async (data: any) => {
        let response = await GetDevice({
            locationID: locationID,
            branchID: branchID,
            facilityID: facilityID,
            buildingID: buildingID,
            floorID: floorID,
            zoneID: zoneID,
            id: data.deviceID
        });

        if (response?.data?.status == "success") {
            let { disconnectionStatus } = response.data.data;

            if (disconnectionStatus == "0") {
                setFirmwareUpgradationDefaultData(data);
                setFirmwareUpgradationForm(true);
            } else {
                CustomToast("Device is not connected", "error");
            }
        }
    }

    const HandleAdd = () => {
        setOnSuccess(false);
        setDeviceData({
            edit: false,
            locationID: locationID,
            branchID: branchID,
            facilityID: facilityID,
            buildingID: buildingID,
            floorID: floorID,
            zoneID: zoneID
        })
        setDeviceForm(true);
    }

    const HandleEdit = (id: number) => {
        setOnSuccess(false);
        setDeviceData({
            edit: true,
            locationID: locationID,
            branchID: branchID,
            facilityID: facilityID,
            buildingID: buildingID,
            floorID: floorID,
            zoneID: zoneID,
            id: id
        })
        setDeviceForm(true);
    }

    const Delete = async (id: number) => {
        let message: string = 'Unable to delete device';
        let status: string = 'error';

        let response = await DeleteDevice({
            id: id
        });

        if (response?.data?.status == "success") {
            message = response.data.message;
            status = response.data.status;
            setOnSuccess(true);
        }

        CustomToast(message, status);
    }

    const HandleDelete = (id: number) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure, you want to delete this device?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result: any) => {
            if (result.value) {
                Delete(id);
            }
        });
    }

    const changeDeviceMode = async (device: any, value: string, fromModal = false) => {
        let data: any = params;
        data['deviceID'] = device.id;

        if (!fromModal && value == "firmwareUpgradation") {
            getDeviceMode(data);
            return;
        }
        let response = await ChangeDeviceMode(device.id, {
            deviceMode: value
        });

        let message: string = `Unable to ${value} device`;
        let status: string = 'error';

        if (response?.data?.status == "success") {
            message = response.data.message;
            status = response.data.status;

            if (value == 'calibration') {
                setCalibrationDefaultData(data);
                setCalibrationForm(true);
            }

            if (value == "bumpTest") {
                setBumpTestDefaultData(data);
                setBumpTestForm(true);
            }

            if (value == "debug") {
                setDebugDefaultData(data);
                setDebugForm(true);
            }

            if (value == "config") {
                setConfigDefaultData(data);
                setConfigForm(true);
            }

            if (value == "eventLog") {
                setEventLogDefaultData(data);
                setEventLogForm(true);
            }

            setOnSuccess(true);
        } else if (response?.response?.status == 412) {
            message = response.response.data.message;
            status = response.response.data.status;
            setOnSuccess(true);
        }

        CustomToast(message, status);
    }

    const handleDeviceModeChange = (e: any, device: any) => {
        let { label, value } = e;
        Swal.fire({
            icon: 'warning',
            title: `Are you sure, you want to change the device mode to ${label}?`,
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Yes, continue',
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result: any) => {
            if (result.value) {
                changeDeviceMode(device, value);
            }
        });
    }

    const handleCommuConfig = (id: number, connectionInfo: any) => {
        setOnSuccess(false);
        setDeviceData({
            locationID: locationID,
            branchID: branchID,
            facilityID: facilityID,
            buildingID: buildingID,
            floorID: floorID,
            zoneID: zoneID,
            id: id,
            connectionInfo: connectionInfo
        });
        setDeviceCommunForm(true);
    }

    useEffect(() => {
        if (OnSuccess) {
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
        <div className='grid xl:grid-cols-3 md:grid-cols-2 gap-6 mb-6'>
            <div className="panel h-full xl:col-span-2 !p-3 rounded-xl">
                <div className='flex flex-row justify-between pb-2'>
                    <ul className="flex space-x-2 rtl:space-x-reverse text-lg px-2">
                        <li className="dark:text-white text-black font-bold text-md hover:underline cursor-pointer" onClick={handleNavigate}>
                            <span>Location</span>
                        </li>
                        {BreadCrumb.map((selected, index) => <li key={index} className={`dark:text-white before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-black font-bold text-md hover:underline ${selected.click == false ? 'pointer-events-none' : 'cursor-pointer'}`} onClick={() => HandleBreadCrumb(selected)}>
                            <span>{selected.locationName || selected.branchName || selected.facilityName || selected.buildingName || selected.floorName || selected.zoneName}</span>
                        </li>)}
                    </ul>
                    {userDetails?.userRole == "systemSpecialist" && <div className='flex flex-row gap-2'>
                        <button className='btn btn-primary bg-[#133c81] gap-2 shadow-none border-none dark:text-white' type="button" onClick={HandleAdd}>
                            <IconPlus />
                            Add Device
                        </button>
                    </div>}
                </div>
                <div className="datatables">
                    <DataTable
                        rowClassName={({ deviceMode }) => {
                            let color = '!bg-[#A5D6A7]'; // enabled
                            switch (deviceMode) {
                                case 'calibration':
                                    color = '!bg-[#FAE8FA] ';
                                    break;
                                case 'firmwareUpgradation':
                                    color = '!bg-[#9fa8da]';
                                    break;
                                case 'disabled':
                                    color = '!bg-[#ffcdd2]';
                                    break;
                                case 'bumpTest':
                                    color = '!bg-[#FFFCE3]';
                                    break;
                                case 'config':
                                    color = '!bg-[#F2FFF2]';
                                    break;
                                default:
                                    color = '!bg-[#A5D6A7]';
                                    break;
                            }

                            return color;
                        }}
                        highlightOnHover
                        className='whitespace-nowrap table-hover'
                        records={recordsData}
                        columns={[
                            {
                                accessor: 'deviceName',
                                titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                cellsClassName: '!text-center !px-1 dark:text-white font-bold',
                                title: 'Device Name',
                                render: (current) => <div className='cursor-pointer' onClick={() => HandleDevice(current)}>{current.deviceName}</div>,
                                sortable: true
                            },
                            {
                                accessor: 'deviceCategory',
                                titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                cellsClassName: '!text-center !px-1 dark:text-white font-bold',
                                title: 'Device Category',
                                sortable: true
                            },
                            {
                                accessor: 'deviceAuthID',
                                titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                cellsClassName: '!text-center !px-1 dark:text-white font-bold',
                                title: 'Device Auth ID',
                                sortable: true
                            },
                            {
                                accessor: 'actions',
                                titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                cellsClassName: '!text-center !px-1 dark:text-white font-bold',
                                title: 'Actions',
                                render: ({ id, connectionInfo }: any) => <div className='flex gap-1'>
                                    <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => HandleEdit(id)}>
                                        <EditIcon fill="rgb(67 97 238 / 1)" />
                                    </button>
                                    {userDetails?.userRole == "systemSpecialist" && <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => HandleDelete(id)}>
                                        <DeleteIcon fill="rgb(255 0 15)" />
                                    </button>}
                                    <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => handleCommuConfig(id, connectionInfo)}>
                                        <AppSettingIcon />
                                    </button>
                                </div>,
                                sortable: true
                            },
                            {
                                accessor: 'deviceMode',
                                titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                cellsClassName: '!text-center !px-1 dark:text-white font-bold',
                                title: 'Mode',
                                render: rowData => {
                                    let currentDeviceMode = DeviceModeArray.find(device => device.value == rowData.deviceMode);
                                    return <div className="w-36">
                                        <Select
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    backgroundColor: 'transparent',
                                                    borderColor: 'transparent'
                                                }),
                                            }}
                                            className="w-full select-box dark:text-white font-bold"
                                            menuPortalTarget={document.body}
                                            value={currentDeviceMode}
                                            options={DeviceModeArray}
                                            isSearchable={false}
                                            onChange={(e) => handleDeviceModeChange(e, rowData)}
                                        />
                                    </div>
                                },
                                sortable: true
                            },
                            {
                                accessor: 'firmwareVersion',
                                titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                cellsClassName: '!text-center !px-1 dark:text-white font-bold',
                                title: 'Firmware',
                                sortable: true
                            },
                            {
                                accessor: 'hardwareModelVersion',
                                titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                cellsClassName: '!text-center !px-1 dark:text-white font-bold',
                                title: 'H/W Model No.',
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
                        paginationText={({ from, to, totalRecords }) => <div className='dark:text-white'>{`Showing  ${from} to ${to} of ${totalRecords} entries`}</div>}
                    />
                </div>
            </div>
            <div className="panel h-full !p-0 rounded-xl">
                <div className="bg-white dark:bg-black rounded-xl">
                    {loading ? (
                        <div className="min-h-[350px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                        </div>
                    ) : <Map markers={MapDetails} />}
                    {Image.showImage && <div className="g-white dark:bg-black rounded-lg absolute top-0 h-full w-full">
                        <div className="bg-white h-full w-full">
                            <img src={`${ApiURL.split('api/')[0]}${Image.image[0]?.image}`} className='w-full h-full' />
                        </div>
                    </div>}
                </div>
            </div>

            <AddDevice
                OpenModal={DeviceForm}
                setOpenModal={setDeviceForm}
                LocationData={DeviceData}
                OnSuccess={setOnSuccess}
            />

            <AddCommuConfig
                openModal={deviceCommunForm}
                setOpenModal={setDeviceCommunForm}
                defaultData={DeviceData}
                onSuccess={setOnSuccess}
            />

            <CalibrationForm
                openModal={calibrationForm}
                setOpenModal={setCalibrationForm}
                defaultData={calibrationDefaultData}
                enableDevice={changeDeviceMode}
            />

            <BumpTestForm
                openModal={bumpTestForm}
                setOpenModal={setBumpTestForm}
                defaultData={bumpTestDefaultData}
                enableDevice={changeDeviceMode}
            />

            <FirmwareUpgradationForm
                openModal={firmwareUpgradationForm}
                setOpenModal={setFirmwareUpgradationForm}
                defaultData={firmwareUpgradationDefaultData}
                enableDevice={changeDeviceMode}
                onSuccess={setOnSuccess}
            />

            <DebugForm
                openModal={debugForm}
                setOpenModal={setDebugForm}
                defaultData={debugDefaultData}
                enableDevice={changeDeviceMode}
            />

            <ConfigurationForm
                openModal={configForm}
                setOpenModal={setConfigForm}
                defaultData={configDefaultData}
                onSuccess={setOnSuccess}
            />

            <EventLogForm
                openModal={eventLogForm}
                setOpenModal={setEventLogForm}
                defaultData={eventLogDefaultData}
                onSuccess={setOnSuccess}
            />
        </div>
    );
};

export default Device;
