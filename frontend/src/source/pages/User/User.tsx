import { DeleteUser, GetAllUsers, resetUserPassword } from '@/source/service/UserService';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CustomToast from '@/helpers/CustomToast';
import { IRootState } from '@/store';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { DeleteIcon, EditIcon } from '@/source/helpers/Icons';
import IconPlus from '@/components/Icon/IconPlus';
import AddUser from './Component/AddUser/AddUser';
import Swal from "sweetalert2";
import { setLocalStorageData } from '@/source/service/DashboardService';
import IconRestore from '@/components/Icon/IconRestore';
import Tippy from '@tippyjs/react';

const User = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('User'));
    });

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const storedUserDetails = useSelector((state: IRootState) => state.themeConfig).userDetails;
    const userDetails: any = storedUserDetails != null ? JSON.parse(storedUserDetails) : {};

    const [rowData, setRowData] = useState<Array<any>>([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'employeeID'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'employeeID', direction: 'asc' });

    const [UserForm, setUserForm] = useState<boolean>(false);
    const [UserData, setUserData] = useState<any>({
        edit: false
    });
    const [OnSuccess, setOnSuccess] = useState<boolean>(false);

    const GetData = async () => {
        let response = await GetAllUsers();

        if(response?.data?.status == "success"){
            let responseData = response.data.data.users
            setRowData(responseData);
            setInitialRecords(sortBy(responseData, 'employeeID') )
        } else {
            CustomToast('Something went wrong', 'error');
        }

        await setLocalStorageData();
    }

    const HandleAdd = () => {
        setUserData({
            edit: false
        });
        setOnSuccess(false);
        setUserForm(true);
    }

    const HandleEdit = (userID: number) => {
        setUserData({
            edit: true,
            id: userID
        });
        setOnSuccess(false);
        setUserForm(true);
    }

    const HandleDeleteUser = async (userID: number) => {
        let message: string = 'Unable to delete device';
        let status: string = 'error';

        let response = await DeleteUser({
            id: userID
        });

        if(response?.data?.status == "success"){
            message = response.data.message;
            status = response.data.status;
            setOnSuccess(true);
        }

        CustomToast(message, status);
    }

    const HandleDelete = (userID: number) => {
        setOnSuccess(false);
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure, you want to delete this user?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result:any) => {
            if (result.value) {
                HandleDeleteUser(userID);
            }
        });
    }

    const resetPassword = async (user: any) => {
        let message: string = 'Unable to reset password';
        let status: string = 'error';

        let response = await resetUserPassword({
            email: user.email
        });

        if(response?.data?.status == "success"){
            message = response.data.message;
            status = response.data.status;
            setOnSuccess(true);
        } else if(response?.response?.data?.status == "error"){
            message = response.response.data.message;
            status = response.response.data.status;
        }

        CustomToast(message, status);
    }

    const handleResendPassword = (user: any) => {
        setOnSuccess(false);
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure, you want to reset password for this user?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Reset',
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result:any) => {
            if (result.value) {
                resetPassword(user);
            }
        });
    }

    useEffect(() => {
        OnSuccess && GetData();
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
        setInitialRecords(() => {
            return rowData.filter((item) => {
                return (
                    item.employeeID.toString().includes(search.toLowerCase()) ||
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.email.toLowerCase().includes(search.toLowerCase()) ||
                    item.mobileNumber.toLowerCase().includes(search.toLowerCase()) ||
                    item.userRole.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    useEffect(() => {
        GetData();
    }, [])

    return (
        <div className="h-full">
            <div className="panel">
                <div className="mb-5">
                    <div>
                        <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                            <div>
                                <h5 className='text-xl dark:text-white'>All Users</h5>
                            </div>
                            {userDetails?.userRole != "Manager" && <div className="ltr:ml-auto rtl:mr-auto flex flex-row gap-2">
                                <button className='btn btn-primary bg-[#133c81] gap-2 shadow-none border-none dark:text-white' type="button" onClick={HandleAdd}>
                                    <IconPlus />
                                    Add User
                                </button>
                                <input type="text" className="form-input w-auto dark:text-white" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>}
                        </div>
                        <div className="datatables">
                            <DataTable
                                highlightOnHover
                                className={`${isRtl ? 'whitespace-nowrap table-hover' : 'whitespace-nowrap table-hover'}`}
                                records={recordsData}
                                columns={[
                                    {
                                        accessor: 'employeeID',
                                        title: 'Employee Id',
                                        titleClassName: 'dark-datatable-title-color',
                                        cellsClassName: 'dark:text-white',
                                        sortable: true
                                    },
                                    {
                                        accessor: 'name',
                                        title: 'Name',
                                        titleClassName: 'dark-datatable-title-color',
                                        cellsClassName: 'dark:text-white',
                                        sortable: true
                                    },
                                    {
                                        accessor: 'email',
                                        title: 'Email',
                                        titleClassName: 'dark-datatable-title-color',
                                        cellsClassName: 'dark:text-white',
                                        sortable: true
                                    },
                                    {
                                        accessor: 'mobileNumber',
                                        title: 'Phone',
                                        titleClassName: 'dark-datatable-title-color',
                                        cellsClassName: 'dark:text-white',
                                        sortable: true
                                    },
                                    {
                                        accessor: 'userRole',
                                        title: 'Role',
                                        titleClassName: 'dark-datatable-title-color',
                                        cellsClassName: 'dark:text-white',
                                        sortable: true
                                    },
                                    {
                                        accessor: 'emailNotification',
                                        title: 'Email Notification',
                                        titleClassName: 'dark-datatable-title-color',
                                        cellsClassName: 'dark:text-white'
                                    },
                                    {
                                        accessor: 'smsNotification',
                                        title: 'SMS Notification',
                                        titleClassName: 'dark-datatable-title-color',
                                        cellsClassName: 'dark:text-white'
                                    },
                                    {
                                        accessor: 'action',
                                        title: 'Actions',
                                        titleClassName: 'dark-datatable-title-color',
                                        cellsClassName: 'dark:text-white',
                                        render: (user) => <div className='flex gap-2'>
                                            {/* <Tippy content="Edit user"> */}
                                                    <div onClick={() => HandleEdit(user.id)} className='p-1 cursor-pointer'>
                                                    <EditIcon fill="rgb(67 97 238 / 1)" />
                                                </div>
                                            {/* </Tippy> */}
                                            {userDetails?.userRole != "Manager" && <>
                                                {/* <Tippy content="Delete user"> */}
                                                    <div onClick={() => HandleDelete(user.id)} className='p-1 cursor-pointer'>
                                                        <DeleteIcon fill='rgb(231 81 90 / 1)' />
                                                    </div>
                                                {/* </Tippy> */}
                                            </>}
                                            {/* <Tippy content="Reset user password"> */}
                                                <div onClick={() => handleResendPassword(user)} className='p-1 cursor-pointer'>
                                                    <IconRestore />
                                                </div>
                                            {/* </Tippy> */}
                                        </div>
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
                </div>
            </div>
            <AddUser
                OpenModal={UserForm}
                setOpenModal={setUserForm}
                LocationData={UserData}
                OnSuccess={setOnSuccess}
            />
        </div>
    )
};

export default User;
