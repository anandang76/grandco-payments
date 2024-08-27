import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import { DownloadIcon, SendIcon } from '@/source/helpers/Icons';
import CustomToast from '@/helpers/CustomToast';
import { GetUserLogReport, DownloadUserLogReport, SendUserLogReport } from '@/source/service/ReportsService';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import IconCalendar from '@/components/Icon/IconCalendar';
import { GetAllUsers } from '@/source/service/UserService';

const UserLog = ({ Zone }: any) => {

    const storedUser = localStorage.getItem('userDetails');
    const today = new Date();
    const allUserOption = {
        deviceName: 'All Users',
        deviceID: 'all',
        label: 'All Users',
        value: 'all',
        id: 'all'
    };

    const [rowData, setRowData] = useState<Array<any>>([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [5, 10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[4]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'collectedTime'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'collectedTime', direction: 'asc' });

    const [fromDate, setFromDate] = useState<any>('');
    const [toDate, setToDate] = useState<any>('');
    const [allUsers, setAllUsers] = useState<Array<any>>([]);
    const [usersOptions, setUserOptions] = useState<Array<any>>([]);
    const [user, setUser] = useState<any>('');

    const getData = async () => {
        let response = await GetAllUsers();

        if(response.data?.status == "success"){
            const { users } = response.data.data;
            users.map((user: any) => {
                user.label = user.name,
                user.value = user.id
            });
            users.unshift(allUserOption);

            setAllUsers(users);
            setUserOptions(users);
            setUser(users[0])
        } else {
            CustomToast('Unable to fetch users', 'error');
        }
    }

    const handleSubmit = async () => {
        let data: any = {
            fromDate: moment(fromDate).format('YYYY-MM-DD'),
            toDate: moment(toDate).format('YYYY-MM-DD'),
        };
        if(user){
            data['userID'] = user.id;
        }
        let response = await GetUserLogReport(data)

        if(response?.data?.status == "success"){
            response = response.data.data;

            if(response.length == 0){
                CustomToast('No data found', '');
            } else {
                setRowData(response);
                setInitialRecords(sortBy(response, 'collectedTime'));
            }
        } else {
            CustomToast('Something went wrong', 'error');
        }
    }

    const handleDownload = async () => {
        let currentUser = storedUser != null ? JSON.parse(storedUser) : '';
        // if(user && user.email != ""){
            let data: any = {
                fromDate: moment(fromDate).format('YYYY-MM-DD'),
                toDate: moment(toDate).format('YYYY-MM-DD'),
                email: currentUser.email
            };
            if(user){
                data['userID'] = user.id;
            }
            DownloadUserLogReport(data);
        // }
    }

    const handleSend = async () => {
        let currentUser = storedUser != null ? JSON.parse(storedUser) : '';

        // if(user && user.email != ""){
            let data: any = {
                fromDate: moment(fromDate).format('YYYY-MM-DD'),
                toDate: moment(toDate).format('YYYY-MM-DD'),
                email: currentUser.email
            };
            if(user){
                data['userID'] = user.id;
            }
            let response: any = await SendUserLogReport(data);

            let message = "Something went wrong";
            let status = "error";
            console.log(response)
            if(response?.data?.status == "success"){
                message = response?.data?.Msg;
                status = response?.data?.status;
            } else if(response?.data?.msg == 'No data available'){
                message = response?.data?.msg;
                status = response?.data?.status;
            }

            CustomToast(message, status);
        // }
    }

    const isValid = () => {
        let valid = true;
        if(fromDate == ''){
            CustomToast('From date is required', 'error');
            valid = false;
        } else if(toDate == ''){
            CustomToast('To date is required', 'error');
            valid = false;
        // } else if(!user || user == ''){
        //     CustomToast('Please select user', 'error');
        //     valid = false;
        }

        return valid;
    }

    const handleButton = async (e: any) => {
        e.preventDefault();

        if(isValid()){
            const type = e.target.name;

            switch (type) {
                case 'submit':
                    handleSubmit();
                    break;

                case 'download':
                    handleDownload();
                    break;

                case 'send':
                    handleSend();
                    break;

                default:
                    break;
            }
        }
    }

    const handleUserChange = (e: any) => {
        setUser(e);
    }

    useEffect(() => {
        let currentUser = allUsers;
        if(Zone != ""){
            if(Zone.zoneID){
                currentUser = allUsers.filter(user =>
                    Zone.locationID == user.locationID &&
                    Zone.branchID == user.branchID &&
                    Zone.facilityID == user.facilityID &&
                    Zone.buildingID == user.buildingID &&
                    Zone.floorID == user.floorID &&
                    Zone.zoneID == user.zoneID
                )
            } else if(Zone.floorID) {
                currentUser = allUsers.filter(user =>
                    Zone.locationID == user.locationID &&
                    Zone.branchID == user.branchID &&
                    Zone.facilityID == user.facilityID &&
                    Zone.buildingID == user.buildingID &&
                    Zone.floorID == user.floorID
                );
            } else if(Zone.buildingID){
                currentUser = allUsers.filter(user =>
                    Zone.locationID == user.locationID &&
                    Zone.branchID == user.branchID &&
                    Zone.facilityID == user.facilityID &&
                    Zone.buildingID == user.buildingID
                );
            } else if(Zone.facilityID){
                currentUser = allUsers.filter(user =>
                    Zone.locationID == user.locationID &&
                    Zone.branchID == user.branchID &&
                    Zone.facilityID == user.facilityID
                );
            } else if(Zone.branchID){
                currentUser = allUsers.filter(user =>
                    Zone.locationID == user.locationID &&
                    Zone.branchID == user.branchID
                );
            } else if(Zone.locationID){
                currentUser = allUsers.filter(user =>
                    Zone.locationID == user.locationID
                );
            }
            currentUser.unshift(allUserOption);
        }
        setUserOptions(currentUser);
        setUser(currentUser[0]);
        setRowData([]);
        setInitialRecords([]);
    }, [Zone])

    useEffect(() => {
        getData();
    }, [])

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
                            value={fromDate}
                            options={{
                                maxDate: today,
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
                            value={toDate}
                            options={{
                                minDate: fromDate,
                                maxDate: today,
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
                    <label htmlFor='user' className="dark:text-white">Users</label>
                    <Select
                        name="user"
                        id="user"
                        className="user w-full dark:text-white"
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 3 }) }}
                        placeholder="Select User"
                        options={usersOptions}
                        isSearchable={true}
                        value={user}
                        onChange={(e) => handleUserChange(e)}
                    />
                </div>
            </div>
            <div className='flex flex-row gap-2 w-full my-4 pb-5'>
                <div className='w-full' onClick={handleButton}>
                    <button className='btn w-full text-white bg-[#78350F] shadow-[#78350F] border-[#78350F]' type='button' name="submit">
                        SUBMIT
                    </button>
                </div>
                <div className='w-full' onClick={handleButton}>
                    <button className='btn btn-primary w-full gap-2 items-center' type='button' name="download">
                        <DownloadIcon fill="white" />
                        DOWNLOAD
                    </button>
                </div>
                <div className='w-full' onClick={handleButton}>
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
                            accessor: 'createdAt',
                            title: 'Date',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ createdAt }) => moment(createdAt).format('DD-MM-YYYY HH:mm:ss'),
                            sortable: true
                        },
                        {
                            accessor: 'userEmail',
                            title: 'Email',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'action',
                            title: 'Action',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
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

export default UserLog;
