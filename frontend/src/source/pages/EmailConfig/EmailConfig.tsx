import { GetEmailConfig, DeleteEmailConfig } from '@/source/service/EmailConfigService';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CustomToast from '@/helpers/CustomToast';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { DeleteIcon, EditIcon } from '@/source/helpers/Icons';
import IconPlus from '@/components/Icon/IconPlus';
import AddEmailConfig from './Component/AddEmailConfig/AddEmailConfig';
import Swal from "sweetalert2";
import './EmailConfig.css';
import { IRootState } from '@/store';

const EmailConfig = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Email Config'));
    });

    const storedUserDetails = useSelector((state: IRootState) => state.themeConfig).userDetails;
    const userDetails: any = storedUserDetails != null ? JSON.parse(storedUserDetails) : {};

    const [rowData, setRowData] = useState<Array<any>>([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[3]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });

    const [UserForm, setUserForm] = useState<boolean>(false);
    const [UserData, setUserData] = useState<any>({
        edit: false
    });
    const [OnSuccess, setOnSuccess] = useState<boolean>(false);

    const GetData = async () => {
        let response = await GetEmailConfig({
            id: 'all'
        });

        if(response?.data?.status == "success"){
            setRowData(response.data.data);
            setInitialRecords(sortBy(response.data.data, 'id') )
        } else {
            CustomToast('Unable to fetch Email Config', 'error');
        }
    }

    const HandleAdd = () => {
        setUserData({
            edit: false
        });
        setOnSuccess(false);
        setUserForm(true);
    }

    const HandleEdit = (id: number) => {
        setUserData({
            edit: true,
            id: id
        });
        setOnSuccess(false);
        setUserForm(true);
    }

    const HandleDeleteEmailConfig = async (id: number) => {
        let message: string = 'Unable to delete device';
        let status: string = 'error';

        let response = await DeleteEmailConfig({
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
                HandleDeleteEmailConfig(id);
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
                                <h5 className='text-xl dark:text-white'>All Email Templates</h5>
                            </div>
                            <div className="ltr:ml-auto rtl:mr-auto flex flex-row gap-2">
                                <button className='btn btn-primary bg-[#133c81] gap-2 shadow-none border-none dark:text-white' type="button" onClick={HandleAdd}>
                                    <IconPlus />
                                    Add Email Template
                                </button>
                            </div>
                        </div>
                        <div className="datatables">
                            <DataTable
                                highlightOnHover
                                className='whitespace-nowrap table-hover'
                                records={recordsData}
                                columns={[
                                    {
                                        accessor: 'templateID',
                                        title: 'Template ID',
                                        titleClassName: 'dark-datatable-title-color',
                                        cellsClassName: 'dark:text-white',
                                        sortable: true
                                    },
                                    {
                                        accessor: 'subject',
                                        title: 'Subject',
                                        titleClassName: 'dark-datatable-title-color',
                                        cellsClassName: 'dark:text-white',
                                        sortable: true
                                    },
                                    {
                                        accessor: 'body',
                                        title: 'Body',
                                        titleClassName: 'dark-datatable-title-color',
                                        cellsClassName: 'description dark:text-white',
                                        sortable: true,
                                        render: ({ body }) => <div className='flex gap-2'>
                                            <div dangerouslySetInnerHTML={{ __html: body }} />
                                            </div>

                                    },
                                    {
                                        accessor: 'action',
                                        title: 'Actions',
                                        titleClassName: 'dark-datatable-title-color',
                                        cellsClassName: 'dark:text-white',
                                        render: ({ id }) => <div className='flex gap-2'>
                                            <div onClick={() => HandleEdit(id)} className='p-1 cursor-pointer'>
                                                <EditIcon fill="rgb(67 97 238 / 1)" />
                                            </div>
                                            {userDetails?.userRole == "systemSpecialist" && <div onClick={() => HandleDelete(id)} className='p-1 cursor-pointer'>
                                                <DeleteIcon fill='rgb(231 81 90 / 1)' />
                                            </div>}
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
                                paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <AddEmailConfig
                openModal={UserForm}
                setOpenModal={setUserForm}
                LocationData={UserData}
                OnSuccess={setOnSuccess}
            />
        </div>
    )
};

export default EmailConfig;
