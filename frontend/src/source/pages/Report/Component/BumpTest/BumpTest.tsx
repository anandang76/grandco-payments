import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import { DownloadIcon, SendIcon } from '@/source/helpers/Icons';
import CustomToast from '@/helpers/CustomToast';
import { DownloadBumpTestReport, GetBumpTestReport, SendBumpTestReport } from '@/source/service/ReportsService';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import IconCalendar from '@/components/Icon/IconCalendar';
import Devices from '@/source/pages/Devices/Devices';

const BumpTest = ({ Zone }: any) => {

    const StoredDevices = localStorage.getItem('devices');
    const StoredSensors = localStorage.getItem('sensors');
    const StoredUser = localStorage.getItem('userDetails');
    const allDeviceOption = {
        deviceName: 'All Devices',
        deviceID: 'all',
        label: 'All Devices',
        value: 'all'
    };

    const AllDevices: Array<any> = StoredDevices != null ? JSON.parse(StoredDevices) : [];
    const AllSensors: Array<any> = StoredSensors != null ? JSON.parse(StoredSensors) : [];
    const Today = new Date();

    AllDevices.map((Devices) => {
        Devices.label = Devices.deviceName;
        Devices.value = Devices.deviceName;
    });
    AllDevices.unshift(allDeviceOption)

    const [FromDate, setFromDate] = useState('');
    const [ToDate, setToDate] = useState('');

    const [DevicesOptions, setDevicesOptions] = useState<Array<any>>([]);
    const [Device, setDevice] = useState<any>('');

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
        // } else if(Device == ''){
        //     CustomToast('Please select device', 'error');
        //     isValid = false;
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
        }

        let response = await GetBumpTestReport(data)

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
                email: user.email,
                locationID: Zone.locationID,
                branchID: Zone.branchID,
                facilityID: Zone.facilityID,
                buildingID: Zone.buildingID,
                floorID: Zone.floorID,
                zoneID: Zone.zoneID,
                deviceID: Device.deviceID
            }

            DownloadBumpTestReport(data);
        }
    }

    const HandleSend = async () => {
        let user = StoredUser != null ? JSON.parse(StoredUser) : '';

        if(user && user.email != ""){
            let data: any = {
                fromDate: moment(FromDate).format('YYYY-MM-DD'),
                toDate: moment(ToDate).format('YYYY-MM-DD'),
                email: user.email,
                locationID: Zone.locationID,
                branchID: Zone.branchID,
                facilityID: Zone.facilityID,
                buildingID: Zone.buildingID,
                floorID: Zone.floorID,
                zoneID: Zone.zoneID,
                deviceID: Device.deviceID
            }

            let response: any = await SendBumpTestReport(data);

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
    }, [Zone]);

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
                            render: (rowData) => moment(rowData.collectedTime.split(' ')[0]).format('DD-MM-YYYY'),
                            sortable: true
                        },
                        {
                            accessor: 'device',
                            title: 'Device',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({deviceID}) => AllDevices.find(device => device.id == deviceID)?.deviceName,
                            sortable: true
                        },
                        {
                            accessor: 'sensorID',
                            title: 'Sensor Name',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: (rowData) => AllSensors.find(sensor => sensor.sensorID == rowData.sensorID)?.sensorTag,
                            sortable: true
                        },
                        {
                            accessor: 'testType',
                            title: 'Test Type',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'deviation',
                            title: 'Deviation',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'result',
                            title: 'Result',
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

export default BumpTest;
