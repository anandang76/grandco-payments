import React, { useEffect, useState } from "react";
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import IconPlus from "@/components/Icon/IconPlus";
import { GetUnit, DeleteUnit } from "@/source/service/DeviceManagementService";
import CustomToast from "@/helpers/CustomToast";
import { DeleteIcon, EditIcon } from "@/source/helpers/Icons";
import UnitsForm from "../UnitsForm/UnitsForm";
import Swal from "sweetalert2";

const Units = () => {

    const rowData: Array<any> = [];

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });

    const [ShowUnitsForm, setShowUnitsForm] = useState<boolean>(false);
    const [DefaultData, setDefaultData] = useState<any>({});
    const [OnSuccess, setOnSuccess] = useState<boolean>(false);

    const GetData = async () => {
        let response = await GetUnit({
            id: 'all'
        });

        if(response.data?.status == "success"){
            setInitialRecords(sortBy(response.data.data, 'id'));
        } else {
            CustomToast('Unable to fetch units', 'error');
        }
    }

    const HandleAdd = () => {
        setShowUnitsForm(true);
        setDefaultData({});
    }

    const HandleEdit = (id: any) => {
        setShowUnitsForm(true);
        setDefaultData({
            unitID: id,
            edit: true
        });
    }

    const ConfirmDelete = async (id: any) => {
        let message: string = 'Unable to delete location';
        let status: string = 'error';

        let response = await DeleteUnit({
            id: id
        });

        if(response?.data?.status == "success"){
            message = response.data.message;
            status = response.data.status;
            setOnSuccess(true);
        }

        CustomToast(message, status);
    }

    const HandleDelete = async (id: any) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure, you want to delete this unit?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result:any) => {
            if (result.value) {
                ConfirmDelete(id);
            }
        });
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
    }, [sortStatus]);

    useEffect(() => {
        if(OnSuccess){
            GetData();
            setOnSuccess(false);
        }
    }, [OnSuccess])

    useEffect(() => {
        GetData();
    }, [])

    return (
        <div>
            <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                <h5 className="font-semibold text-lg dark:text-white">UNITS</h5>
                <div className="ltr:ml-auto rtl:mr-auto">
                    <button className="btn btn-primary gap-2 dark:text-white" type="button" onClick={HandleAdd}>
                        <IconPlus />
                        Add Units
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
                            accessor: 'unitLabel',
                            title: 'Unit Label',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'unitMeasure',
                            title: 'Unit Measure',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'actions',
                            title: 'Actions',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ id }: any) => <div className='flex gap-2'>
                            <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => HandleEdit(id)}>
                                <EditIcon fill="rgb(67 97 238 / 1)" />
                            </button>
                            <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => HandleDelete(id)}>
                                <DeleteIcon fill="rgb(231 81 90 / 1)" />
                            </button>
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
                    paginationText={({ from, to, totalRecords }) => <div className="dark:text-white">{`Showing  ${from} to ${to} of ${totalRecords} entries`}</div>}
                />
            </div>

            <UnitsForm
                openModal={ShowUnitsForm}
                closeModal={setShowUnitsForm}
                DefaultData={DefaultData}
                OnSuccess={setOnSuccess}
            />
        </div>
    );
};

export default Units;
