import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import { DownloadIcon, SendIcon } from '@/source/helpers/Icons';
import CustomToast from '@/helpers/CustomToast';
import { GetAlarmReport, DownloadAlarmReport, SendAlarmReport } from '@/source/service/ReportsService';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import IconCalendar from '@/components/Icon/IconCalendar';
import { GetAlertPriorityStatus } from '@/source/helpers/HelperFunctions';

const AlarmReport = ({ Zone }: any) => {

    const StoredDevices = localStorage.getItem('devices');
    const StoredSensors = localStorage.getItem('sensors');
    const StoredUser = localStorage.getItem('userDetails');
    const storedLocations = localStorage.getItem('location')
    const storedBranches = localStorage.getItem('branch')
    const storedFacilities = localStorage.getItem('facility')
    const storedBuildings = localStorage.getItem('building')
    const storedFloors = localStorage.getItem('floor')
    const storedZones = localStorage.getItem('zone');
    const allDeviceOption = {
        deviceName: 'All Devices',
        deviceID: 'all',
        label: 'All Devices',
        value: 'all'
    };

    const AllDevices: Array<any> = StoredDevices != null ? JSON.parse(StoredDevices) : [];
    const AllSensors: Array<any> = StoredSensors != null ? JSON.parse(StoredSensors) : [];
    const Locations: Array<any> = storedLocations != null ? JSON.parse(storedLocations) : [];
    const Branches: Array<any> = storedBranches != null ? JSON.parse(storedBranches) : [];
    const Facilities: Array<any> = storedFacilities != null ? JSON.parse(storedFacilities) : [];
    const Buildings: Array<any> = storedBuildings != null ? JSON.parse(storedBuildings) : [];
    const Floors: Array<any> = storedFloors != null ? JSON.parse(storedFloors) : [];
    const Zones: Array<any> = storedZones != null ? JSON.parse(storedZones) : [];
    const Today = new Date();

    AllDevices.map((Devices) => {
        Devices.label = Devices.deviceName;
        Devices.value = Devices.deviceName;
    });
    AllDevices.unshift(allDeviceOption);

    const [FromDate, setFromDate] = useState('');
    const [ToDate, setToDate] = useState('');

    const [DevicesOptions, setDevicesOptions] = useState<Array<any>>([]);
    const [Device, setDevice] = useState<any>({
        label: 'All Devices',
        value: 'all'
    });

    const [rowData, setRowData] = useState<Array<any>>([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [5, 10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[4]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'collectedTime'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'collectedTime', direction: 'asc' });

    const HandleValidate = () => {
        let isValid = true;

        if(FromDate == ''){
            CustomToast('From date is required', 'error');
            isValid = false;
        } else if(ToDate == ''){
            CustomToast('To date is required', 'error');
            isValid = false;
        } else if(Device == ''){
            CustomToast('Please select device', 'error');
            isValid = false;
        }

        return isValid;
    }

    const HandleSubmit = async () => {
        let data: any = {
            fromDate: moment(FromDate).format('YYYY-MM-DD'),
            toDate: moment(ToDate).format('YYYY-MM-DD'),
            locationID: Zone.locationID,
            branchID: Zone.branchID,
            facilityID: Zone.facilityID,
            buildingID: Zone.buildingID,
            floorID: Zone.floorID,
            zoneID: Zone.zoneID,
            deviceID: Device.deviceID
        };

        let response = await GetAlarmReport(data);

        if(response?.data?.status == "success"){
            response = response.data.data;

            if(response.length > 0){
                setRowData(response);
                setInitialRecords(sortBy(response, 'collectedTime').reverse());
            } else {
                CustomToast('No data found', '');
            }
        } else {
            CustomToast('Something went wrong', 'error');
        }
    }

    const HandleDownload = async () => {
        let user = StoredUser != null ? JSON.parse(StoredUser) : '';
        if(user && user.email != ""){
            let data: any = {
                fromDate: moment(FromDate).format('YYYY-MM-DD'),
                toDate: moment(ToDate).format('YYYY-MM-DD'),
                locationID: Zone.locationID,
                branchID: Zone.branchID,
                facilityID: Zone.facilityID,
                buildingID: Zone.buildingID,
                floorID: Zone.floorID,
                zoneID: Zone.zoneID,
                deviceID: Device.deviceID,
                email: user.email
            };

            DownloadAlarmReport(data);
        }
    }

    const HandleSend = async () => {
        let user = StoredUser != null ? JSON.parse(StoredUser) : '';

        if(user && user.email != ""){
            let data: any = {
                fromDate: moment(FromDate).format('YYYY-MM-DD'),
                toDate: moment(ToDate).format('YYYY-MM-DD'),
                locationID: Zone.locationID,
                branchID: Zone.branchID,
                facilityID: Zone.facilityID,
                buildingID: Zone.buildingID,
                floorID: Zone.floorID,
                zoneID: Zone.zoneID,
                deviceID: Device.deviceID,
                email: user.email
            };

            let response: any = await SendAlarmReport(data);

            let message = "Something went wrong";
            let status = "error";
            if(response?.data?.status == "success"){
                message = response?.data?.Msg;
                status = response?.data?.status;
            }

            CustomToast(message, status);
        }
    }

    const HandleButton = async (e: any) => {
        e.preventDefault();

        const type = e.target.name;

        if(HandleValidate()){
            switch (type) {
                case 'submit':
                    HandleSubmit();
                    break;

                case 'download':
                    HandleDownload();
                    break;

                case 'send':
                    HandleSend();
                    break;

                default:
                    break;
            }
        }
    }

    const HandleDeviceChange = (device: any) => {
        setRowData([]);
        setInitialRecords([]);
        setDevice(device);
    }

    useEffect(() => {
        let currentDevice = AllDevices;
        if(Zone != ""){
            if(Zone.zoneID){
                currentDevice = AllDevices.filter(device =>
                    Zone.locationID == device.locationID &&
                    Zone.branchID == device.branchID &&
                    Zone.facilityID == device.facilityID &&
                    Zone.buildingID == device.buildingID &&
                    Zone.floorID == device.floorID &&
                    Zone.zoneID == device.zoneID
                )
            } else if(Zone.floorID) {
                currentDevice = AllDevices.filter(device =>
                    Zone.locationID == device.locationID &&
                    Zone.branchID == device.branchID &&
                    Zone.facilityID == device.facilityID &&
                    Zone.buildingID == device.buildingID &&
                    Zone.floorID == device.floorID
                );
            } else if(Zone.buildingID){
                currentDevice = AllDevices.filter(device =>
                    Zone.locationID == device.locationID &&
                    Zone.branchID == device.branchID &&
                    Zone.facilityID == device.facilityID &&
                    Zone.buildingID == device.buildingID
                );
            } else if(Zone.facilityID){
                currentDevice = AllDevices.filter(device =>
                    Zone.locationID == device.locationID &&
                    Zone.branchID == device.branchID &&
                    Zone.facilityID == device.facilityID
                );
            } else if(Zone.branchID){
                currentDevice = AllDevices.filter(device =>
                    Zone.locationID == device.locationID &&
                    Zone.branchID == device.branchID
                );
            } else if(Zone.locationID){
                currentDevice = AllDevices.filter(device =>
                    Zone.locationID == device.locationID
                );
            }
            currentDevice.unshift(allDeviceOption);
        }
        setDevicesOptions(currentDevice);
        setDevice(currentDevice[0])
        setRowData([]);
        setInitialRecords([]);
    }, [Zone])

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);

    return (
        <div className="active pt-5">
            <div className='flex flex-row gap-2 w-full'>
                <div className='w-full'>
                    <label htmlFor='fromDate' className="dark:text-white">From Date *</label>
                    <div className='relative'>
                        <Flatpickr
                            placeholder='dd/mm/yyyy'
                            value={FromDate}
                            options={{
                                maxDate: Today,
                                dateFormat: 'd/m/Y',
                            }}
                            className="form-input dark:text-white"
                            onChange={(date: any) => {
                                setFromDate(date[0])
                            }}
                        />
                        <IconCalendar className='absolute right-2 top-2 pointer-events-none dark:text-white' />
                    </div>
                </div>
                <div className='w-full'>
                    <label htmlFor='toDate' className="dark:text-white">To Date *</label>
                    <div className='relative'>
                        <Flatpickr
                            placeholder='dd/mm/yyyy'
                            value={ToDate}
                            options={{
                                minDate: FromDate,
                                maxDate: Today,
                                dateFormat: 'd/m/Y',
                            }}
                            className="form-input dark:text-white"
                            onChange={(date: any) => {
                                setToDate(date[0])
                            }}
                        />
                        <IconCalendar className='absolute right-2 top-2 pointer-events-none dark:text-white' />
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor='devices' className="dark:text-white">Devices</label>
                    <Select
                        name="device"
                        id="device"
                        className="device w-full dark:text-white"
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 3 }) }}
                        placeholder="Devices"
                        options={DevicesOptions}
                        isSearchable={true}
                        value={Device}
                        defaultValue={{
                            label: 'All Devices',
                            value: 'all'
                        }}
                        onChange={(e) => HandleDeviceChange(e)}
                    />
                </div>
            </div>
            <div className='flex flex-row gap-2 w-full my-4'>
                <div className='w-full' onClick={HandleButton}>
                    <button className='btn w-full text-white bg-[#78350F] shadow-[#78350F] border-[#78350F]' type='button' name="submit">
                        SUBMIT
                    </button>
                </div>
                <div className='w-full' onClick={HandleButton}>
                    <button className='btn btn-primary w-full gap-2 items-center' type='button' name="download">
                        <DownloadIcon fill="white" />
                        DOWNLOAD
                    </button>
                </div>
                <div className='w-full' onClick={HandleButton}>
                    <button className='btn btn-primary w-full gap-2 items-center' type='button' name="send">
                        SEND
                        <SendIcon fill='white' />
                    </button>
                </div>
            </div>
            {rowData.length > 0 && <div className="datatables">
                <DataTable
                    highlightOnHover
                    className='whitespace-nowrap table-hover'
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'collectedTime',
                            title: 'Date',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({collectedTime}) => moment(collectedTime).format('DD-MM-YYYY HH:mm:ss'),
                            sortable: true
                        },
                        {
                            accessor: 'deviceID',
                            title: 'Devices',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID }) => AllDevices.find(device => device.locationID == locationID && device.branchID == branchID && device.facilityID == facilityID && device.buildingID == buildingID && device.floorID == floorID && device.zoneID == zoneID && device.deviceID == deviceID)?.deviceName,
                            sortable: true
                        },
                        {
                            accessor: 'sensorID',
                            title: 'Sensor',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, sensorID }) => AllSensors.find(sensor => sensor.locationID == locationID && sensor.branchID == branchID && sensor.facilityID == facilityID && sensor.buildingID == buildingID && sensor.floorID == floorID && sensor.zoneID == zoneID && sensor.deviceID == deviceID && sensor.sensorID == sensorID)?.sensorName,
                            sortable: true
                        },
                        {
                            accessor: 'value',
                            title: 'Value',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ value }) => Number(value) == 0 ? 'NA' : Number(value).toFixed(2),
                            sortable: true
                        },
                        {
                            accessor: 'alertType',
                            title: 'Alarm Type',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ((current: any) => {
                                let currentAlert = GetAlertPriorityStatus(current.alertType);
                                let bgColor = currentAlert.color;
                                let btnName = currentAlert.label;

                                return <button type="button" className={`p-1 rounded-3xl btn-sm w-28 cursor-default font-bold status-btn border text-white  border-gray-400 text-sm dark:text-white`}style={{ backgroundColor: bgColor, border: bgColor }}>
                                    {btnName}
                                </button>
                            }),
                            sortable: true
                        },
                        {
                            accessor: 'msg',
                            title: 'Message',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'statusMessage',
                            title: 'Reason',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'locationID',
                            title: 'Location',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ locationID }) => Locations.find(location => location.locationID == locationID)?.locationName,
                            sortable: true
                        },
                        {
                            accessor: 'branchID',
                            title: 'Branch',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ locationID, branchID }) => Branches.find(branch => branch.locationID == locationID && branch.branchID == branchID)?.branchName,
                            sortable: true
                        },
                        {
                            accessor: 'facilityID',
                            title: 'Facility',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ locationID, branchID, facilityID }) => Facilities.find(facility => facility.locationID == locationID && facility.branchID == branchID && facility.facilityID == facilityID)?.facilityName,
                            sortable: true
                        },
                        {
                            accessor: 'buildingID',
                            title: 'Building',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ locationID, branchID, facilityID, buildingID }) => Buildings.find(building => building.locationID == locationID && building.branchID == branchID && building.facilityID == facilityID && building.buildingID == buildingID)?.buildingName,
                            sortable: true
                        },
                        {
                            accessor: 'floorID',
                            title: 'Floor',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ locationID, branchID, facilityID, buildingID, floorID }) => Floors.find(floor => floor.locationID == locationID && floor.branchID == branchID && floor.facilityID == facilityID && floor.buildingID == buildingID && floor.floorID == floorID)?.floorName,
                            sortable: true
                        },
                        {
                            accessor: 'zoneID',
                            title: 'Zone',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ locationID, branchID, facilityID, buildingID, floorID, zoneID }) => Zones.find(zone => zone.locationID == locationID && zone.branchID == branchID && zone.facilityID == facilityID && zone.buildingID == buildingID && zone.floorID == floorID && zone.zoneID == zoneID)?.zoneName,
                            sortable: true
                        },
                        {
                            accessor: 'alarmClearedUser',
                            title: 'Alarm Cleared User',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
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
            </div>}
        </div>
    );
};

export default AlarmReport;
