import { GetAllUsers } from '@/source/service/UserService';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../../store/themeConfigSlice';
import { IRootState } from '@/store';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import IconBell from '@/components/Icon/IconBell';
import CustomToast from '@/helpers/CustomToast';
import IconTrash from '@/components/Icon/IconTrash';
import IconPencil from '@/components/Icon/IconPencil';
import { DeleteIcon, EditIcon } from '@/source/helpers/Icons';

const UsersTable = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('User'));
    });

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [rowData, setRowData] = useState<Array<any>>([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'employeeID'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'employeeID', direction: 'asc' });

    const GetData = async () => {
        let response = await GetAllUsers();

        if(response?.data?.status == "success"){
            setRowData(response.data.data.users);
            setInitialRecords(sortBy(response.data.data.users, 'employeeID') )
        } else {
            CustomToast('Something went wrong', 'error');
        }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);

    useEffect(() => {
        GetData();
    }, [])

    return (
        <div className="">
            <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                <div>
                    <h5 className='text-xl dark:text-white-light'>All Users</h5>
                </div>
                <div className="ltr:ml-auto rtl:mr-auto">
                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
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
                            sortable: true
                        },
                        {
                            accessor: 'name',
                            title: 'Name',
                            sortable: true
                        },
                        {
                            accessor: 'email',
                            title: 'Email',
                            sortable: true
                        },
                        {
                            accessor: 'mobileNumber',
                            title: 'Phone',
                            sortable: true
                        },
                        {
                            accessor: 'userRole',
                            title: 'Role',
                            sortable: true
                        },
                        {
                            accessor: 'action',
                            title: 'Actions',
                            render: (rowdata) => <div className='flex gap-2'>
                                <div onClick={() => console.log(rowdata)} className='p-1 cursor-pointer'>
                                    <EditIcon fill="rgb(67 97 238 / 1)" />
                                </div>
                                <div onClick={() => console.log(rowdata)} className='p-1 cursor-pointer'>
                                    <DeleteIcon fill='rgb(231 81 90 / 1)' />
                                </div>
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
    );
};

export default UsersTable;
