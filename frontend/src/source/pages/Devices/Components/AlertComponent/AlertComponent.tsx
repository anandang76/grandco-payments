import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { GetAlertPriorityStatus } from '@/source/helpers/HelperFunctions';
import IconTrash from '@/components/Icon/IconTrash';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { GetAlertStatus } from '@/source/service/DashboardService';
import CustomToast from '@/helpers/CustomToast';
import ClearAlert from '@/source/pages/Dashboard/Component/Alerts/ClearAlert/ClearAlert';
import moment from 'moment';

export const AlertComponent = ({ AlertModal, setAlertModal, zoneID }: any) => {

    const Alerts: Array<any> = useSelector((state: IRootState) => state.themeConfig.notifications);

    const [loading, setLoading] = useState(true);
    const [RowData, setRowData] = useState<Array<any>>([]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [5, 10, 20];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(RowData, 'collectedTime'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });

    const [clearAlertModal, setClearAlertModal] = useState<boolean>(false);
    const [selectedAlert, setSelectedAlert] = useState<any>({});

    const handleLatchAlert = async (alert: any) => {
        let response = await GetAlertStatus({
            alertID: alert.id
        });

        if(response.data.status == 'success'){
            if(response.data.clearValue == "TRUE"){
                setSelectedAlert(alert);
                setClearAlertModal(true);
            } else {
                CustomToast('Alarm value is not back to NORMAL', 'error');
            }
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
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    useEffect(() => {
        if(AlertModal){
            let currentAlerts = Alerts.filter(alert => alert.zoneID == zoneID).reverse();
            setRowData(currentAlerts);
            setInitialRecords(currentAlerts)
            setLoading(false);
        }
    }, [zoneID, AlertModal, Alerts])

    return (
        <Transition appear show={AlertModal} as={Fragment}>
            <Dialog as="div" open={AlertModal} onClose={() => setAlertModal(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0" />
                </Transition.Child>
                <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-center justify-center px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel as="div" className="panel my-8 w-full mx-20 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold dark:text-white">Active Alert</h5>
                                    <button type="button" className="text-white-dark hover:text-dark dark:text-white" onClick={() => setAlertModal(false)}>
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="grid gap-6 mb-0">
                                        <div className="h-full sm:col-span-2 xl:col-span-1 rounded-xl">
                                            <div className="relative">
                                                <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                                    {loading ? (
                                                        <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                                        </div>
                                                    ) : (
                                                        <div className="py-2">
                                                            <div className="datatables">
                                                                <DataTable
                                                                    highlightOnHover
                                                                    className='whitespace-nowrap table-hover'
                                                                    records={recordsData}
                                                                    columns={[
                                                                        {
                                                                            accessor: 'collectedTime',
                                                                            titleClassName: 'title-center dark-datatable-title-color',
                                                                            cellsClassName: '!py-2 !text-center dark:text-white',
                                                                            title: 'Date Time',
                                                                            render: ({ collectedTime }) => moment(collectedTime).format('DD-MM-YYYY HH:mm:ss'),
                                                                            sortable: true
                                                                        },
                                                                        {
                                                                            accessor: 'sensorTag',
                                                                            titleClassName: 'title-center dark-datatable-title-color',
                                                                            cellsClassName: '!py-2 !text-center dark:text-white',
                                                                            title: 'Sensor/Device Tag',
                                                                            render: ({ sensorTag, msg, deviceName }) => msg == "Device Disconnected" ? deviceName : sensorTag,
                                                                            sortable: true
                                                                        },
                                                                        {
                                                                            accessor: 'value',
                                                                            titleClassName: 'title-center dark-datatable-title-color',
                                                                            cellsClassName: '!py-2 !text-center dark:text-white',
                                                                            title: 'Value',
                                                                            render: ({ value }) => Number(value) == 0 ? 'NA' : Number(value).toFixed(2),
                                                                            sortable: true
                                                                        },
                                                                        {
                                                                            accessor: 'msg',
                                                                            titleClassName: 'title-center dark-datatable-title-color',
                                                                            cellsClassName: '!py-2 !text-center dark:text-white',
                                                                            title: 'Message',
                                                                            sortable: true
                                                                        },
                                                                        {
                                                                            accessor: 'alertType',
                                                                            titleClassName: 'title-center dark-datatable-title-color',
                                                                            title: 'Status',
                                                                            sortable: true,
                                                                            cellsClassName: '!py-2 !text-center w-40 dark:text-white',
                                                                            render: ((current: any) => {
                                                                                let currentAlert = GetAlertPriorityStatus(current.alertType);
                                                                                let bgColor = currentAlert.color;
                                                                                let btnName = currentAlert.label;

                                                                                return <button type="button" className={`p-1 rounded-3xl btn-sm w-28 cursor-default status-btn border text-white  border-gray-400 text-sm dark:text-white`}style={{ backgroundColor: bgColor, border: bgColor }}>
                                                                                    {btnName}
                                                                                </button>
                                                                            })
                                                                        },
                                                                        {
                                                                            accessor: 'alarmType',
                                                                            titleClassName: 'title-center dark-datatable-title-color',
                                                                            cellsClassName: '!py-0 !text-center dark:text-white',
                                                                            title: 'Actions',
                                                                            sortable: true,
                                                                            render: ((current: any) => current.alarmType == "Latch" ? <button type="button" className={`p-2 text-white btn-md bg-green-800 flex gap-2 w-full items-center font-bold content-center justify-center rounded-md dark:text-white`}  onClick={() => handleLatchAlert(current)} ><IconTrash /> CLEAR</button> : "")
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
                                                                    paginationText={({ from, to, totalRecords }) => <div className='dark:text-white'>{`${to} of ${totalRecords}`}</div>}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <ClearAlert openModal={clearAlertModal} setOpenModal={setClearAlertModal} alert={selectedAlert} />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
