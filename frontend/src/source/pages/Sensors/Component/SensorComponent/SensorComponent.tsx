import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { GetSensor } from '@/source/service/DashboardService';
import CustomToast from '@/helpers/CustomToast';
import TimeComponent from '../TimeComponent/TimeComponent';
import { GraphComponent } from '../GraphComponent/GraphComponent';
import { AlertComponent } from '../AlertComponent/AlertComponent';
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import HighchartsReact from "highcharts-react-official";
import IconTranslation from '@/components/Icon/IconTranslation';
import IconBellBing from '@/components/Icon/IconBellBing';
import moment from 'moment';
import IconAlarm from '@/components/Icon/IconAlarm';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

highchartsMore(Highcharts);
solidGauge(Highcharts);

const SensorComponent = ({ params }: any) => {

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const StatusArray: Array<string> = ['critical', 'stel', 'twa', 'warning', 'out of range', 'out ofrange', 'outof range', 'outofrange', 'device disconnected', 'devicedisconnected'];
    const Alerts: Array<any> = useSelector((state: IRootState) => state.themeConfig.notifications);

    const StoredSensors = localStorage.getItem('sensors');
    const StoredDevices = localStorage.getItem('devices');

    const AllSensors: Array<any> = StoredSensors != null ? JSON.parse(StoredSensors) : [];
    const AllDevices: Array<any> = StoredDevices != null ? JSON.parse(StoredDevices) : [];

    // const [currentDevice, setCurrentDevice] = useState<any>({});
    const [CurrentAlerts, setCurrentAlerts] = useState<Array<any>>(Alerts);
    const [Data, setData] = useState<any>([]);
    const [SensorAlerts, setSensorAlerts] = useState<Array<any>>([]);
    const [currentDevice, setCurrentDevice] = useState<any>({});

    const [openChart, setOpenChart] = useState<boolean>(false);
    const [ChartData, setChartData] = useState<any>({});

    const colors = ['#E61617', '#F3CE0C', '#00AB55', '#F3CE0C', '#E61617'];
    const colors2 = ['#00AB55', '#F3CE0C', '#E61617'];
    const thickness = 30;

    const [ShowAlerts, setShowAlerts] = useState<boolean>(false);
    const [callSensor, setCallSensor] = useState<boolean>(false);


    const [RowData, setRowData] = useState<Array<any>>([]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [5, 10, 20];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(RowData);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: "id", direction: 'asc' });



    const GetData = async () => {
        let response = await GetSensor(params);

        let responseData: any = {};
        let responseAlerts: Array<any> = [];

        if (response?.data?.status == "success") {
            response = response.data;

            responseData = response.data;
            responseAlerts = response.alerts;
        } else {
            CustomToast('Something went wrong', 'error');
        }

        setData(responseData);
        setRowData(responseData);
        setInitialRecords(responseData);
        setRecordsData(responseData);

        setSensorAlerts(responseAlerts);
    }

    const setChart = (data: any) => {
        // dispatch(setLoader(true));
        setChartData(data)
        setOpenChart(true)
    }

    const HandleActiveAlerts = () => {
        let ActiveAlerts = SensorAlerts?.reduce((sum, alert) => {
            return sum + alert.alarmCount;
        }, 0);

        ActiveAlerts > 0 && setShowAlerts(true);
    }

    const runAtNextSeventhSecond = () => {
        const now = moment();
        const nextMinute = moment(now).startOf('minute').add(1, 'minute').add(7, 'seconds');
        const delay = nextMinute.diff(now);

        setTimeout(() => {
            console.log(`Device: ${moment().format('DD-MM-YYYY HH:mm:ss')}`)
            console.log(`deviceID; ${params.deviceID}`)
            setCallSensor(true);
        }, delay);
    };

    // useEffect(() => {
    //     if (intervalId) {
    //         clearInterval(intervalId);
    //     }
    //     const newIntervalId = setInterval(GetData, 60000);
    //     setIntervalId(newIntervalId);

    //     return () => {
    //         clearInterval(newIntervalId);
    //     };
    // }, [params])

    useEffect(() => {
        if (callSensor) {
            GetData();
            runAtNextSeventhSecond();
            setCallSensor(false);
        }
    }, [callSensor, params]);

    useEffect(() => {
        GetData();
        runAtNextSeventhSecond();
        setCurrentDevice(AllDevices.find(device => device.id == params.deviceID));
    }, [params])

    useEffect(() => {
        setCurrentAlerts(Alerts);
    }, [Alerts])

    return (
        <>
            <div className="py-5">
                <div className="py-2 panel">
                    <div className="datatables">
                        <DataTable
                            className={`whitespace-nowrap table-hover !text-center`}
                            records={recordsData}
                            columns={[
                                {
                                    accessor: 'id',
                                    titleClassName: 'title-center dark-datatable-title-color',
                                    cellsClassName: '!text-center !py-1 dark:text-white',
                                    title: "ID",
                                    sortable: true
                                },
                                // {
                                //     accessor: 'alertType',
                                //     titleClassName: 'title-center dark-datatable-title-color',
                                //     cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                                //     title: 'Transaction ID',
                                //     render: ((record: any) => {
                                //         return <div>{record?.transactionID}</div>
                                //     }),
                                //     sortable: true
                                // },
                                {
                                    accessor: 'updatedAt',
                                    titleClassName: 'title-center dark-datatable-title-color',
                                    cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                                    title: 'Date',
                                    render: ((record: any) => {
                                        return <div>{record?.updatedAt}</div>
                                    }),
                                    sortable: true
                                },
                                {
                                    accessor: 'alertType',
                                    titleClassName: 'title-center dark-datatable-title-color',
                                    cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                                    title: 'Transaction ID',
                                    render: ((record: any) => {
                                        return (<div className='flex justify-between items-center align-center'>
                                            <Tippy

                                                trigger="click"
                                                content={<div><code>{record?.transactionJson}</code></div>}
                                                allowHTML={true}
                                            >
                                                <button type="button" className='btn-sm p-0' onClick={() => console.log(record?.transactionJson)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                                                        <path fill="currentColor" d="M108 84a16 16 0 1 1 16 16a16 16 0 0 1-16-16m128 44A108 108 0 1 1 128 20a108.12 108.12 0 0 1 108 108m-24 0a84 84 0 1 0-84 84a84.09 84.09 0 0 0 84-84m-72 36.68V132a20 20 0 0 0-20-20a12 12 0 0 0-4 23.32V168a20 20 0 0 0 20 20a12 12 0 0 0 4-23.32" />
                                                    </svg>
                                                </button>
                                            </Tippy>
                                            {record?.transactionID}</div>
                                        )

                                    }),
                                    sortable: true
                                },
                                {
                                    accessor: 'alertType',
                                    titleClassName: 'title-center dark-datatable-title-color',
                                    cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                                    title: 'Name',
                                    render: ((record: any) => {
                                        return <div>{(record?.firstName || "") + " " + (record?.lastName || "")}</div>
                                    }),
                                    sortable: true
                                },
                                {
                                    accessor: 'alertType',
                                    titleClassName: 'title-center dark-datatable-title-color',
                                    cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                                    title: 'Amount',
                                    render: ((record: any) => {
                                        return <div className='font-bold'>${record?.amount / 100}</div>
                                    }),
                                    sortable: true
                                },
                                {
                                    accessor: 'alertType',
                                    titleClassName: 'title-center dark-datatable-title-color',
                                    cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                                    title: 'Card',
                                    render: ((record: any) => {
                                        return <div>{record?.cardScheme}</div>
                                    }),
                                    sortable: true
                                },
                                {
                                    accessor: 'alertType',
                                    titleClassName: 'title-center dark-datatable-title-color',
                                    cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                                    title: 'Card Type',
                                    render: ((record: any) => {
                                        return <div>{record?.cardType}</div>
                                    }),
                                    sortable: true
                                },
                                {
                                    accessor: 'alertType',
                                    titleClassName: 'title-center dark-datatable-title-color',
                                    cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                                    title: 'Type',
                                    render: ((record: any) => {
                                        return <div>{record?.transactionType}</div>
                                    }),
                                    sortable: true
                                },
                                {
                                    accessor: 'alertType',
                                    titleClassName: 'title-center dark-datatable-title-color',
                                    cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                                    title: 'Status',
                                    render: ((record: any) => {
                                        return (
                                            <>
                                                {record?.result == "PENDING" && <div className='font-bold text-warning'>{record?.result}</div>}
                                                {record?.result == "APPROVED" && <div className='font-bold text-success'>{record?.result}</div>}
                                                {!["PENDING", "APPROVED"].includes(record?.result) && <div className='font-bold text-danger'>{record?.result}</div>}
                                            </>
                                        )
                                    }),
                                    sortable: true
                                },

                                // {
                                //     accessor: 'aqiValue',
                                //     titleClassName: 'title-center dark-datatable-title-color',
                                //     cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                                //     title: 'AQI Value',
                                //     sortable: true,
                                //     render: (current: any) => {
                                //         let AQI = current.aqiValue ? Number(current.aqiValue).toFixed(0) : "NA";
                                //         return AQI != 'NA' && Number(AQI) != 0 && <button type="button" className={`p-1 rounded-3xl btn-sm w-28 cursor-default dark:text-white status-btn border border-gray-400 text-sm  font-bold`}>
                                //             {AQI}
                                //         </button>
                                //     }
                                // },
                                // {
                                //     accessor: 'aqicategory',
                                //     titleClassName: 'title-center dark-datatable-title-color',
                                //     cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                                //     title: 'AQI Category',
                                //     render: (current: any) => {
                                //         let value = current.aqicategory ? current.aqicategory : "NA";
                                //         let bgColor = GetAQIColor(Number(current.aqiValue) > 0 ? current.aqiValue : "NA");
                                //         return value != "NA" && <button type="button" className={`p-1 rounded-3xl btn-sm w-28 cursor-default status-btn border dark:text-white text-white text-sm  font-bold`} style={{ backgroundColor: bgColor, border: bgColor }}>
                                //             {value}
                                //         </button>
                                //     },
                                //     sortable: true
                                // }
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

            </div>
        </>
    );
};

export default SensorComponent;
