import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import { DownloadIcon, SendIcon } from '@/source/helpers/Icons';
import CustomToast from '@/helpers/CustomToast';
import { GetServerUtilization, DownloadServerUtilization, SendServerUtilization } from '@/source/service/ReportsService';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import IconCalendar from '@/components/Icon/IconCalendar';

const ServerUtilizationReport = ({ Zone }: any) => {

    const StoredDevices = localStorage.getItem('devices');
    const StoredSensors = localStorage.getItem('sensors');
    const StoredUser = localStorage.getItem('userDetails');
    const storedLocations = localStorage.getItem('location')
    const storedBranches = localStorage.getItem('branch')
    const storedFacilities = localStorage.getItem('facility')
    const storedBuildings = localStorage.getItem('building')
    const storedFloors = localStorage.getItem('floor')
    const storedZones = localStorage.getItem('zone');

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

    const [FromDate, setFromDate] = useState('');
    const [ToDate, setToDate] = useState('');

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
        }

        return isValid;
    }

    const HandleSubmit = async () => {
        let response = await GetServerUtilization({
            fromDate: moment(FromDate).format('YYYY-MM-DD'),
            toDate: moment(ToDate).format('YYYY-MM-DD'),
        })

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
            DownloadServerUtilization({
                fromDate: moment(FromDate).format('YYYY-MM-DD'),
                toDate: moment(ToDate).format('YYYY-MM-DD'),
                email: user.email
            });
        }
    }

    const HandleSend = async () => {
        let user = StoredUser != null ? JSON.parse(StoredUser) : '';

        if(user && user.email != ""){
            let response: any = await SendServerUtilization({
                fromDate: moment(FromDate).format('YYYY-MM-DD'),
                toDate: moment(ToDate).format('YYYY-MM-DD'),
                email: user.email
            });

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

    useEffect(() => {
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
                            render: ({ collectedTime }) => moment(collectedTime).format('DD-MM-YYYY HH:mm:ss'),
                            sortable: true
                        },
                        {
                            accessor: 'percMemoryUsage',
                            title: 'Physical Memory',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'diskUsage',
                            title: 'Disk Usage',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'avgCpuLoad',
                            title: 'Average CPU',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ avgCpuLoad }) => avgCpuLoad.includes('%') ? avgCpuLoad : `${avgCpuLoad} %`,
                            sortable: true
                        },
                        {
                            accessor: 'percServerLoad',
                            title: 'Server Load',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ percServerLoad }) =>  `${Number(percServerLoad).toFixed(2)} %`,
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
            </div>}
        </div>
    );
};

export default ServerUtilizationReport;
