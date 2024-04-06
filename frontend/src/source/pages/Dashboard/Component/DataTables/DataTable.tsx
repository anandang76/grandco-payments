import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../../../store';

import "./DataTables.css";
import { GetAQIColor, GetAlertPriorityStatus } from '@/source/helpers/HelperFunctions';

const DataTables = ({records, columnTitle, ChangeData}: any) => {

    const storedDevices = localStorage.getItem('devices');
    const AllDevices: Array<any> = storedDevices != null ? JSON.parse(storedDevices) : [];
    const Alerts: Array<any> = useSelector((state: IRootState) => state.themeConfig.notifications);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [RowData, setRowData] = useState<Array<any>>(records);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [5, 10, 20];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(RowData);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: columnTitle.accessor, direction: 'asc' });

    const StatusArray: Array<string> = ['critical', 'stel', 'twa', 'warning', 'out of range', 'device disconnected'];

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
        const filteredAlerts = Alerts.filter(alert => {
            if (alert.alertType.replaceAll(' ', '').toLowerCase() == 'devicedisconnected') {
                const correspondingDevice = AllDevices.find(device => device.id === alert.deviceID);
                return !(correspondingDevice && correspondingDevice.disconnectedOnGrid == 0);
            } else {
                return true;
            }
        });

        records.map((record: any) => {
            let currentLocationAlerts: Array<any> = [];
            let CurrentAlert = 6;
            if(record.locationName){
                currentLocationAlerts = filteredAlerts.filter((alert) => alert.locationID == record.locationID);
                currentLocationAlerts.map((alert) => {
                    StatusArray.map((status, index) => {
                        if(alert.alertType){
                            if(alert.alertType.toLowerCase() == status){
                                if(index < CurrentAlert){
                                    CurrentAlert = index;
                                }
                            }
                        }
                    })
                })
            }
            if(record.branchName){
                currentLocationAlerts = filteredAlerts.filter((alert) => alert.locationID == record.locationID && alert.branchID == record.branchID);
                currentLocationAlerts.map((alert) => {
                    StatusArray.map((status, index) => {
                        if(alert.alertType){
                            if(alert.alertType.toLowerCase() == status){
                                if(index < CurrentAlert){
                                    CurrentAlert = index;
                                }
                            }
                        }
                    })
                })
            }
            if(record.facilityName){
                currentLocationAlerts = filteredAlerts.filter((alert) => alert.locationID == record.locationID && alert.branchID == record.branchID && alert.facilityID == record.facilityID);
                currentLocationAlerts.map((alert) => {
                    StatusArray.map((status, index) => {
                        if(alert.alertType){
                            if(alert.alertType.toLowerCase() == status){
                                if(index < CurrentAlert){
                                    CurrentAlert = index;
                                }
                            }
                        }
                    })
                })
            }
            if(record.buildingName){
                currentLocationAlerts = filteredAlerts.filter((alert) => alert.locationID == record.locationID && alert.branchID == record.branchID && alert.facilityID == record.facilityID && alert.buildingID == record.buildingID);
                currentLocationAlerts.map((alert) => {
                    StatusArray.map((status, index) => {
                        if(alert.alertType){
                            if(alert.alertType.toLowerCase() == status){
                                if(index < CurrentAlert){
                                    CurrentAlert = index;
                                }
                            }
                        }
                    })
                })
            }
            if(record.floorName){
                currentLocationAlerts = filteredAlerts.filter((alert) => alert.locationID == record.locationID && alert.branchID == record.branchID && alert.facilityID == record.facilityID && alert.buildingID == record.buildingID && alert.floorID == record.floorID);
                currentLocationAlerts.map((alert) => {
                    StatusArray.map((status, index) => {
                        if(alert.alertType){
                            if(alert.alertType.toLowerCase() == status){
                                if(index < CurrentAlert){
                                    CurrentAlert = index;
                                }
                            }
                        }
                    })
                })
            }
            if(record.zoneName){
                currentLocationAlerts = filteredAlerts.filter((alert) => alert.locationID == record.locationID && alert.branchID == record.branchID && alert.facilityID == record.facilityID && alert.buildingID == record.buildingID && alert.floorID == record.floorID && alert.zoneID == record.zoneID);
                currentLocationAlerts.map((alert) => {
                    StatusArray.map((status, index) => {
                        if(alert.alertType){
                            if(alert.alertType.toLowerCase() == status){
                                if(index < CurrentAlert){
                                    CurrentAlert = index;
                                }
                            }
                        }
                    })
                })
            }
            record['alertType'] = StatusArray[CurrentAlert];
        })
        setRowData(records);
        setInitialRecords(sortBy(records, columnTitle.accessor));
        setPage(1);
    }, [records, columnTitle, Alerts]);

    return (
        <div className="py-2">
            <div className="datatables">
                <DataTable
                    className={`${isRtl ? 'whitespace-nowrap table-hover' : 'whitespace-nowrap table-hover'}`}
                    records={recordsData}
                    columns={[
                        {
                            accessor: columnTitle.accessor,
                            titleClassName: 'title-center dark-datatable-title-color',
                            cellsClassName: '!text-center !py-1 dark:text-white',
                            title: columnTitle.title,
                            render: (current: any) => current && <div className='cursor-pointer' onClick={() => ChangeData(current)}>{current[columnTitle.accessor]}</div>,
                            sortable: true
                        },
                        {
                            accessor: 'alertType',
                            titleClassName: 'title-center dark-datatable-title-color',
                            cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                            title: 'Status',
                            render: ((current: any) => {
                                let currentAlert = GetAlertPriorityStatus(current.alertType || "");
                                let bgColor = currentAlert.color;
                                let btnName = currentAlert.label;

                                return <button type="button" className={`p-1 rounded-3xl btn-sm w-28 cursor-default status-btn border text-white dark:text-white border-gray-400 text-sm font-bold`}style={{ backgroundColor: bgColor, border: bgColor }}>
                                    {btnName}
                                </button>
                            }),
                            sortable: true
                        },
                        {
                            accessor: 'aqiValue',
                            titleClassName: 'title-center dark-datatable-title-color',
                            cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                            title: 'AQI Value',
                            sortable: true,
                            render: (current: any) => {
                                let AQI = current.aqiValue ? Number(current.aqiValue).toFixed(0) : "NA";
                                return AQI != 'NA' && Number(AQI) != 0 && <button type="button" className={`p-1 rounded-3xl btn-sm w-28 cursor-default dark:text-white status-btn border border-gray-400 text-sm  font-bold`}>
                                    {/* {Number(AQI) == 0 ? "NA" : AQI} */}
                                    {AQI}
                                </button>
                            }
                        },
                        {
                            accessor: 'aqicategory',
                            titleClassName: 'title-center dark-datatable-title-color',
                            cellsClassName: '!text-center !py-1 w-40 dark:text-white',
                            title: 'AQI Category',
                            render: (current: any) => {
                                let value = current.aqicategory ? current.aqicategory : "NA";
                                let bgColor = GetAQIColor(Number(current.aqiValue) > 0 ? current.aqiValue : "NA");
                                return value != "NA" && <button type="button" className={`p-1 rounded-3xl btn-sm w-28 cursor-default status-btn border dark:text-white text-white text-sm  font-bold`} style={{ backgroundColor: bgColor, border: bgColor }}>
                                    {value}
                                </button>
                            },
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
                    paginationText={({ from, to, totalRecords }) => <div className='dark:text-white'>{`${to} of ${totalRecords}`}</div>}
                />
            </div>
        </div>
    );
};

export default DataTables;

