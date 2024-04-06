import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import { DownloadIcon, SendIcon } from '@/source/helpers/Icons';
import CustomToast from '@/helpers/CustomToast';
import { DownloadAQIReport, GetAQIReport, SendAQIReport } from '@/source/service/ReportsService';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import IconCalendar from '@/components/Icon/IconCalendar';

const AQIReport = ({ Zone }: any) => {

    const Today = new Date();
    const storedZones = localStorage.getItem('zone');
    const StoredUser = localStorage.getItem('userDetails');
    const StoredSensors = localStorage.getItem('sensors');

    const currentUser = StoredUser != null ? JSON.parse(StoredUser) : {};

    const [zone, setzone] = useState<any>('');

    const [FromDate, setFromDate] = useState('');
    const [ToDate, setToDate] = useState('');

    const Zones: Array<any> = storedZones != null ? JSON.parse(storedZones) : [];
    const AllSensors: Array<any> = StoredSensors != null ? JSON.parse(StoredSensors) : [];

    Zones.map((zone) => {
        zone.label = zone.zoneName;
        zone.value = zone.zoneName;
    })

    const [rowData, setRowData] = useState<Array<any>>([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [5, 10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[4]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'collectedTime'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'collectedTime', direction: 'asc' });
    const [Column, setColumn] = useState<Array<any>>([]);

    const [AQIZoneOptions, setAQIZoneOptions] = useState<Array<any>>([]);
    const [AQIZone, setAQIZone] = useState<any>('');

    const HandleValidate = () => {
        let isValid = true;

        if(FromDate == ''){
            CustomToast('From date is required', 'error');
            isValid = false;
        } else if(ToDate == ''){
            CustomToast('To date is required', 'error');
            isValid = false;
        } else if(Zone == '' && AQIZone == ''){
            CustomToast('Please select zone', 'error');
            isValid = false;
        }

        return isValid;
    }

    const CustomTitle = ({ name, limit, unit }: any ) => {
        return <div>
            {name}
            <div>Limit = {limit}</div>
            <div>Unit = {unit}</div>
        </div>
    }

    const HandleAQIReport = (Data: Array<any>) => {
        if(Data.length > 0){
            let dynamicSensor: Array<any> = [];
            Data.map(data => {
                let infoData = JSON.parse(data.aqiInfo);
                if(infoData){
                    Object.keys(infoData).map((key: any)=> {
                        let info = infoData[key];

                        if(key != 'info'){
                            if(info.count > 0){
                                dynamicSensor[key] = info;
                            }
                        }
                    })
                }
            });

            let currentColumn: Array<any> = [
                {
                    accessor: 'collectedTime',
                    title: 'Date',
                    titleClassName: 'dark-datatable-title-color',
                    cellsClassName: 'dark:text-white',
                    render: (rowData: any) => moment(rowData.collectedTime.split(' ')[0]).format('DD-MM-YYYY'),
                    sortable: true
                },
                {
                    accessor: 'aqiValue',
                    title: 'AqiValue',
                    titleClassName: 'dark-datatable-title-color',
                    cellsClassName: 'dark:text-white',
                    sortable: true
                },
                {
                    accessor: 'aqiCategory',
                    title: 'AqiCategory',
                    titleClassName: 'dark-datatable-title-color',
                    cellsClassName: 'dark:text-white',
                    render: (rowData: any) => JSON.parse(rowData.aqiInfo).info.aqiCategory,
                    sortable: true
                },
                {
                    accessor: 'prominentPollutantID',
                    title: 'Prominent Pollutant',
                    titleClassName: 'dark-datatable-title-color',
                    cellsClassName: 'dark:text-white',
                    render: (rowData: any) => {
                        let info = JSON.parse(rowData.aqiInfo)
                        let prominentPollutantID = info.info.prominentPollutantID
                        prominentPollutantID = AllSensors.find(sensor => sensor.sensorID == prominentPollutantID).sensorTag
                        return prominentPollutantID;
                    },
                    sortable: true
                }
            ];

            if(Object.keys(dynamicSensor).length > 0){
                Object.keys(dynamicSensor).map((key: any) => {
                    let currentSensor = dynamicSensor[key];
                    let sensor = AllSensors.find(sensor => sensor.sensorID == currentSensor.sensorID)
                    let name = sensor.sensorTag;
                    let limit = JSON.parse(sensor.warningAlertInfo).wMax;
                    let unit = sensor.units;
                    currentColumn.push({
                        accessor: sensor.sensorTag,
                        title: <CustomTitle name={name} limit={limit} unit={unit} />,
                        titleClassName: 'dark-datatable-title-color',
                        cellsClassName: 'dark:text-white',
                        render: (rowData: any) => {
                            let info = JSON.parse(rowData.aqiInfo);
                            return info[key].avg;
                        }
                    })
                })
            }

            setColumn(currentColumn)
        } else {
            CustomToast('No data found', '');
        }
    }

    const HandleSubmit = async () => {
        let data = {
            fromDate: moment(FromDate).format('YYYY-MM-DD'),
            toDate: moment(ToDate).format('YYYY-MM-DD'),
            zoneID: zone.zoneID
        };

        if(AQIZone != ''){
            data['zoneID'] = AQIZone.zoneID;
        }

        let response = await GetAQIReport(data)

        if(response?.data?.status == "success"){
            response = response.data.data;

            HandleAQIReport(response);
            setRowData(response);
            setInitialRecords(sortBy(response, 'collectedTime').reverse())
        } else {
            CustomToast('Something went wrong', 'error');
        }
    }

    const HandleDownload = () => {
        let user = StoredUser != null ? JSON.parse(StoredUser) : '';
        if(user && user.email != ""){
            let data = {
                fromDate: moment(FromDate).format('YYYY-MM-DD'),
                toDate: moment(ToDate).format('YYYY-MM-DD'),
                zoneID: zone.zoneID,
                email: user.email
            };

            if(AQIZone != ''){
                data['zoneID'] = AQIZone.zoneID;
            }

            DownloadAQIReport(data)
        }
    }

    const HandleSend = async () => {
        let user = StoredUser != null ? JSON.parse(StoredUser) : '';
        if(user && user.email != ""){
            let data = {
                fromDate: moment(FromDate).format('YYYY-MM-DD'),
                toDate: moment(ToDate).format('YYYY-MM-DD'),
                zoneID: zone.zoneID,
                email: user.email
            };

            if(AQIZone != ''){
                data['zoneID'] = AQIZone.zoneID;
            }

            let response = await SendAQIReport(data);

            let message = "Something went wrong";
            let status = "error";
            if(response?.data?.status == "success"){
                message = response?.data?.Msg;
                status = response?.data?.status;
            }

            CustomToast(message, status);
        }
    }

    const HandleButton = (e: any) => {
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

    const aqiZoneFilterOption = () => {
        let zone = Zones.filter(zone => zone.isAQI == 1);
        if(currentUser){
            if(currentUser.zoneID){
                zone = Zones.filter(zone => zone.isAQI == 1 && zone.zoneID == currentUser.zoneID && zone.floorID == currentUser.floorID && zone.buildingID == currentUser.buildingID && zone.facilityID == currentUser.facilityID && zone.branchID == currentUser.branchID && zone.locationID == currentUser.locationID);
            } else if(currentUser.floorID){
                zone = Zones.filter(zone => zone.isAQI == 1 && zone.floorID == currentUser.floorID && zone.buildingID == currentUser.buildingID && zone.facilityID == currentUser.facilityID && zone.branchID == currentUser.branchID && zone.locationID == currentUser.locationID);
            } else  if(currentUser.buildingID){
                zone = Zones.filter(zone => zone.isAQI == 1 && zone.buildingID == currentUser.buildingID && zone.facilityID == currentUser.facilityID && zone.branchID == currentUser.branchID && zone.locationID == currentUser.locationID);
            } else  if(currentUser.facilityID){
                zone = Zones.filter(zone => zone.isAQI == 1 && zone.facilityID == currentUser.facilityID && zone.branchID == currentUser.branchID && zone.locationID == currentUser.locationID);
            } else  if(currentUser.branchID){
                zone = Zones.filter(zone => zone.isAQI == 1 && zone.branchID == currentUser.branchID && zone.locationID == currentUser.locationID);
            } else  if(currentUser.locationID){
                zone = Zones.filter(zone => zone.isAQI == 1 && zone.locationID == currentUser.locationID);
            }
        }
        setAQIZoneOptions(zone);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);

    useEffect(() => {
        setzone(Zone);
        aqiZoneFilterOption();
        setAQIZone('');
        setRowData([]);
        setInitialRecords([])
    }, [Zone])

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
                <div className="w-full">
                    <label htmlFor='devices' className="dark:text-white">AQI Zones</label>
                    <Select
                        name="AQIzones"
                        id="AQIzones"
                        className="device w-full dark:text-white"
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 3 }) }}
                        placeholder="AQI zones"
                        options={AQIZoneOptions}
                        value={AQIZone}
                        onChange={(e) => setAQIZone(e)}
                    />
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
                    columns={Column}
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

export default AQIReport;
