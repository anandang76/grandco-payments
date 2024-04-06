import { useEffect, useState } from "react";
import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import { IRootState } from "../../../../../store";
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import './Alerts.css';
import IconTrash from "../../../../../components/Icon/IconTrash.js";
import { GetAlertPriorityStatus } from "@/source/helpers/HelperFunctions";
import { GetAlertStatus } from "@/source/service/DashboardService";
import CustomToast from "@/helpers/CustomToast";
import ClearAlert from "./ClearAlert/ClearAlert";
import moment from 'moment';

const Alerts = () => {

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const Alerts: any = useSelector((state: IRootState) => state.themeConfig.notifications);
    const CurrentLocation: any = useSelector((state: IRootState) => state.themeConfig.currentAlertLocation);
    const [loading, setLoadingq] = useState(true);
    const [RowData, setRowData] = useState<Array<any>>(Alerts);
    const [CurrentAlertData, setCurrentAlertData] = useState<Array<any>>(Alerts);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [5, 10, 20];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(RowData);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    const [ClearAlertModal, setClearAlertModal] = useState<boolean>(false);
    const [SelectedAlert, setSelectedAlert] = useState<any>({});

    const SetCurrentLocationAlert = () => {
        setLoadingq(true);
        const sortedAlerts = sortBy(Alerts, 'id').reverse();
        if(CurrentLocation == "location"){
            setRowData(sortedAlerts);
            setInitialRecords(sortedAlerts);
        } else if(Object.keys(CurrentLocation).length > 1){
            let currentAlert: Array<any> = [];
            if(CurrentLocation.zoneID){
                currentAlert = CurrentAlertData.filter((row) => row.locationID == CurrentLocation.locationID && row.branchID == CurrentLocation.branchID && row.facilityID == CurrentLocation.facilityID && row.buildingID == CurrentLocation.buildingID && row.floorID == CurrentLocation.floorID && row.zoneID == CurrentLocation.zoneID);
            } else if(CurrentLocation.floorID){
                currentAlert = CurrentAlertData.filter((row) => row.locationID == CurrentLocation.locationID && row.branchID == CurrentLocation.branchID && row.facilityID == CurrentLocation.facilityID && row.buildingID == CurrentLocation.buildingID && row.floorID == CurrentLocation.floorID);
            } else if(CurrentLocation.buildingID){
                currentAlert = CurrentAlertData.filter((row) => row.locationID == CurrentLocation.locationID && row.branchID == CurrentLocation.branchID && row.facilityID == CurrentLocation.facilityID && row.buildingID == CurrentLocation.buildingID);
            } else if(CurrentLocation.facilityID){
                currentAlert = CurrentAlertData.filter((row) => row.locationID == CurrentLocation.locationID && row.branchID == CurrentLocation.branchID && row.facilityID == CurrentLocation.facilityID);
            } else if(CurrentLocation.branchID){
                currentAlert = CurrentAlertData.filter((row) => row.locationID == CurrentLocation.locationID && row.branchID == CurrentLocation.branchID);
            } else if(CurrentLocation.locationID){
                currentAlert = CurrentAlertData.filter((row) => row.locationID == CurrentLocation.locationID);
            }
            setRowData(currentAlert);
            setInitialRecords(currentAlert)
        } else {
            setRowData(sortedAlerts);
            setInitialRecords(sortedAlerts);
        }
        setLoadingq(false);
    }

    const HandleLatchAlert = async (alert: any) => {
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
        const sortedAlerts = sortBy(Alerts, 'id').reverse();
        // console.log(Alerts);
        setCurrentAlertData(sortedAlerts);
        SetCurrentLocationAlert();
    }, [Alerts])

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
        SetCurrentLocationAlert();
    }, [CurrentLocation])

    useEffect(() => {
        const sortedAlerts = sortBy(Alerts, 'id').reverse();
        // console.log(Alerts);
        setCurrentAlertData(sortedAlerts);
        SetCurrentLocationAlert()
    }, [])

    return (
        <div className="grid gap-6 mb-0">
            <div className="panel h-full sm:col-span-2 xl:col-span-1 rounded-xl">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li className="text-black font-bold text-md hover:underline dark:text-white">
                        <span>Alerts</span>
                    </li>
                </ul>
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
                                        className={`${isRtl ? 'whitespace-nowrap table-hover' : 'whitespace-nowrap table-hover'}`}
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
                                                cellsClassName: '!py-2 !text-cente dark:text-white',
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

                                                    return <button type="button" className={`p-1 rounded-3xl btn-sm w-28 cursor-default status-btn border text-white dark:text-white font-bold  border-gray-400 text-sm`}style={{ backgroundColor: bgColor, border: bgColor }}>
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
                                                render: ((current: any) => current.alarmType == "Latch" && <button type="button" className={`p-2 text-white btn-md bg-green-800 flex gap-2 w-full items-center font-bold content-center justify-center rounded-md`} onClick={() => HandleLatchAlert(current)}>
                                                    <IconTrash /> CLEAR
                                                </button>)
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
            <ClearAlert openModal={ClearAlertModal} setOpenModal={setClearAlertModal} alert={SelectedAlert} />
        </div>
    );
};

export default Alerts;
