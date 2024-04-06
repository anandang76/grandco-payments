import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import { DownloadIcon, SendIcon } from '@/source/helpers/Icons';
import CustomToast from '@/helpers/CustomToast';
import { DownloadEventLogReport, GetEventLogReport, SendEventLogReport } from '@/source/service/ReportsService';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import IconCalendar from '@/components/Icon/IconCalendar';
import './EventLogReport.css';

const EventLogReport = ({ Zone }: any) => {

    const StoredUser = localStorage.getItem('userDetails');

    const Today = new Date();

    const EventsOptions: Array<any> = [
        {
            label: 'All',
            value: 'all'
        },
        {
            label: 'Location Details',
            value: 'Location Details'
        },
        {
            label: 'Branch Details',
            value: 'Branch Details'
        },
        {
            label: 'Facility Details',
            value: 'Facility Details'
        },
        {
            label: 'Building Details',
            value: 'Building Details'
        },
        {
            label: 'Floor Details',
            value: 'Floor Details'
        },
        {
            label: 'Zone Details',
            value: 'Zone Details'
        },
        {
            label: 'Device Config',
            value: 'Device Config'
        },
        {
            label: 'Sensor Config',
            value: 'Sensor Config'
        },
        {
            label: 'Email Config',
            value: 'Email Config'
        },
        {
            label: 'User',
            value: 'User'
        },
        {
            label: 'Change Password',
            value: 'Change Password'
        }
    ];

    const [FromDate, setFromDate] = useState('');
    const [ToDate, setToDate] = useState('');
    const [defaultData, setDefaultData] = useState<any>({});

    const [Event, setEvent] = useState<any>('');

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
        }

        return isValid;
    }

    const HandleSubmit = async () => {
        let data: any = defaultData

        data['fromDate'] = moment(FromDate).format('YYYY-MM-DD');
        data['toDate'] = moment(ToDate).format('YYYY-MM-DD');

        if(Event != ""){
            data['eventName'] = Event.value;
        } else {
            data['eventName'] = 'all';
        }

        let response = await GetEventLogReport(data)

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
                email: user.email
            }

            if(Event != ""){
                data['eventName'] = Event.value;
            }

            DownloadEventLogReport(data);
        }
    }

    const HandleSend = async () => {
        let user = StoredUser != null ? JSON.parse(StoredUser) : '';

        if(user && user.email != ""){
            let data: any = {
                fromDate: moment(FromDate).format('YYYY-MM-DD'),
                toDate: moment(ToDate).format('YYYY-MM-DD'),
                email: user.email
            }

            if(Event != ""){
                data['eventName'] = Event.value;
            }

            let response: any = await SendEventLogReport(data);

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
        setEvent(device);
    }

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

    useEffect(() => {
        setDefaultData({
            locationID: Zone.locationID,
            branchID: Zone.branchID,
            facilityID: Zone.facilityID,
            buildingID: Zone.buildingID,
            floorID: Zone.floorID,
            zoneID: Zone.zoneID
        })
    }, [Zone])

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
                    <label htmlFor='events' className="dark:text-white">Events</label>
                    <Select
                        name="events"
                        id="events"
                        className="events w-full dark:text-white"
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 3 }) }}
                        placeholder="Events"
                        options={EventsOptions}
                        isSearchable={true}
                        value={Event}
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
                            accessor: 'collectedDate',
                            title: 'Date',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({collectedDate}) => moment(collectedDate.split(' ')[0]).format('DD-MM-YYYY'),
                            sortable: true
                        },
                        {
                            accessor: 'userEmail',
                            title: 'User',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        // {
                        //     accessor: 'locationID',
                        //     title: 'Location',
                        //     render: ({ locationID }) => Locations.find(location => location.locationID == locationID)?.locationName,
                        //     sortable: true
                        // },
                        // {
                        //     accessor: 'branchID',
                        //     title: 'Branch',
                        //     render: ({ locationID, branchID }) => Branches.find(branch => branch.locationID == locationID && branch.branchID == branchID)?.branchName,
                        //     sortable: true
                        // },
                        // {
                        //     accessor: 'facilityID',
                        //     title: 'Facility',
                        //     render: ({ locationID, branchID, facilityID }) => Facilities.find(facility => facility.locationID == locationID && facility.branchID == branchID && facility.facilityID == facilityID)?.facilityName,
                        //     sortable: true
                        // },
                        // {
                        //     accessor: 'buildingID',
                        //     title: 'Building',
                        //     render: ({ locationID, branchID, facilityID, buildingID }) => Buildings.find(building => building.locationID == locationID && building.branchID == branchID && building.facilityID == facilityID && building.buildingID == buildingID)?.buildingName,
                        //     sortable: true
                        // },
                        // {
                        //     accessor: 'floorID',
                        //     title: 'Floor',
                        //     render: ({ locationID, branchID, facilityID, buildingID, floorID }) => Floors.find(floor => floor.locationID == locationID && floor.branchID == branchID && floor.facilityID == facilityID && floor.buildingID == buildingID && floor.floorID == floorID)?.floorName,
                        //     sortable: true
                        // },
                        // {
                        //     accessor: 'zoneID',
                        //     title: 'Zone',
                        //     render: ({ locationID, branchID, facilityID, buildingID, floorID, zoneID }) => Zones.find(zone => zone.locationID == locationID && zone.branchID == branchID && zone.facilityID == facilityID && zone.buildingID == buildingID && zone.floorID == floorID && zone.zoneID == zoneID)?.zoneName,
                        //     sortable: true
                        // },
                        // {
                        //     accessor: 'deviceID',
                        //     title: 'Devices',
                        //     render: ({ locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID }) => AllDevices.find(device => device.locationID == locationID && device.branchID == branchID && device.facilityID == facilityID && device.buildingID == buildingID && device.floorID == floorID && device.zoneID == zoneID && device.deviceID == deviceID)?.deviceName,
                        //     sortable: true
                        // },
                        // {
                        //     accessor: 'sensorID',
                        //     title: 'Sensor',
                        //     render: ({ locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, sensorID }) => AllSensors.find(sensor => sensor.locationID == locationID && sensor.branchID == branchID && sensor.facilityID == facilityID && sensor.buildingID == buildingID && sensor.floorID == floorID && sensor.zoneID == zoneID && sensor.deviceID == deviceID && sensor.sensorID == sensorID)?.sensorName,
                        //     sortable: true
                        // },
                        {
                            accessor: 'eventName',
                            title: 'Event Name',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                        },
                        {
                            accessor: 'eventDetails',
                            title: 'Event Details',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'description dark:text-white',
                            render: ({ eventDetails }) => typeof eventDetails == "object" ? JSON.parse(eventDetails) : eventDetails
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
            </div>}
        </div>
    );
};

export default EventLogReport;
