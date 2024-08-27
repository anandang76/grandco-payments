import IconX from '@/components/Icon/IconX';
import { IRootState } from '@/store';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetGraph } from '@/source/service/DashboardService';
import { toPng } from 'html-to-image';
import { setLoader } from '@/store/themeConfigSlice';
import Dropdown from '@/components/Dropdown';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// import exporting from 'highcharts/modules/exporting';
import CustomToast from '@/helpers/CustomToast';
import PDFComponent from '../PDFComponent/PDFComponent';
// exporting(Highcharts);
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';

interface TimeIntervalArrayType {
    lastTime: string,
    lastTimeValue: string,
    interval: Array<string>,
    defaultInterval: string
}

export const GraphComponent = ({ openModal, setOpenModal, ChartData }: any) => {
    const chartRef = useRef(null);

    const today = new Date();
    const storedUserDetails = useSelector((state: IRootState) => state.themeConfig).userDetails;
    const userDetails: any = storedUserDetails != null ? JSON.parse(storedUserDetails) : {};

    const storedLocations = localStorage.getItem('location');
    const storedBranches = localStorage.getItem('branch');
    const storedFacilities = localStorage.getItem('facility');
    const storedBuildings = localStorage.getItem('building');
    const storedFloors = localStorage.getItem('floor');
    const storedZones = localStorage.getItem('zone');
    const StoredSensors = localStorage.getItem('sensors');
    const StoredDevices = localStorage.getItem('devices');

    const Locations: Array<any> = storedLocations != null ? JSON.parse(storedLocations) : [];
    const Branches: Array<any> = storedBranches != null ? JSON.parse(storedBranches) : [];
    const Facilities: Array<any> = storedFacilities != null ? JSON.parse(storedFacilities) : [];
    const Buildings: Array<any> = storedBuildings != null ? JSON.parse(storedBuildings) : [];
    const Floors: Array<any> = storedFloors != null ? JSON.parse(storedFloors) : [];
    const Zones: Array<any> = storedZones != null ? JSON.parse(storedZones) : [];
    const AllSensors: Array<any> = StoredSensors != null ? JSON.parse(StoredSensors) : [];
    const AllDevices: Array<any> = StoredDevices != null ? JSON.parse(StoredDevices) : [];

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const TimeIntervalArray: Array<TimeIntervalArrayType> = [
        {
            lastTime: '15 Min',
            lastTimeValue: `${moment().subtract(15, 'minutes').format('YYYY-MM-DD HH:mm')}:00`,
            interval: ['1 Minute', '5 Minutes'],
            defaultInterval: '1 Minute'
        },
        {
            lastTime: '1 Hour',
            lastTimeValue: `${moment().subtract(1, 'hour').format('YYYY-MM-DD HH:mm')}:00`,
            interval: ['1 Minute', '5 Minutes', '15 Minutes', '30 Minutes'],
            defaultInterval: '15 Minutes'
        },
        {
            lastTime: '24 Hours',
            lastTimeValue: `${moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm')}:00`,
            interval: ['1 Minute', '5 Minutes', '15 Minutes', '30 Minutes', '1 Hour'],
            defaultInterval: '15 Minutes'
        },
        {
            lastTime: '1 Week',
            lastTimeValue: `${moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm')}:00`,
            interval: ['15 Minutes', '1 Hour', '1 Day'],
            defaultInterval: '15 Minutes'
        },
        {
            lastTime: '1 Month',
            lastTimeValue: `${moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')}:00`,
            interval: ['30 Minutes', '1 Hour', '1 Day'],
            defaultInterval: '30 Minutes'
        },
        {
            lastTime: 'Custom Date',
            lastTimeValue: '',
            interval: ['1 Minute', '5 Minutes', '15 Minutes', '30 Minutes', '1 Hour'],
            defaultInterval: '30 Minutes'
        }
    ];
    const Colors: Array<string> = ['#E7515A', '#00AB55', '#E2A03F', '#ff9e00', '#ff0000'];
    const Colors2: Array<string> = ['#E7515A', '#00AB55', '#E2A03F', '#ff9e00', '#ff9e00', '#ff0000', '#ff0000'];

    const [modal2, setModal2] = useState(false);
    const [Labels, setLables] = useState<Array<string>>([]);
    const [LastTime, setLastTime] = useState<string>(TimeIntervalArray[2].lastTime);
    const [Interval, setInterval] = useState<string>(TimeIntervalArray[2].interval[1]);
    const [showCalendar, setShowCalendar] = useState<Boolean>(false);
    const [customDate, setCustomDate] = useState<any>('');
    const [showGraph, setShowGraph] = useState<boolean>(false);
    const [chartSeries, setChartSeries] = useState<Array<any>>([]);

    // PDF modal
    const [pdfModal, setPdfModal] = useState<boolean>(false);
    const [pdfDefaultData, setPdfDefaultData] = useState<any>({});
    const [chartImage, setChartImage] = useState<any>('');
    const [locationData, setLocationData] = useState<any>({});
    const [limitsData, setLimitsData] = useState<any>({});
    const [trendsData, setTrendsData] = useState<any>({});

    const GetData = async (interval: Number=5, lastTime: any=`${moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm')}:00`) => {
        let response = await GetGraph({
            deviceID: ChartData.deviceID,
            sensorID: ChartData.sensorID,
            interval: interval,
            lastTime: lastTime
        });

        if(response?.data?.status == "success"){
            response = response?.data;
            let showGraph = false;
            let chart: Array<any> = [];
            if(response?.data.length > 0){
                showGraph = true;
                let warning = JSON.parse(response.limits[0].warningAlertInfo);
                let critial = JSON.parse(response.limits[0].criticalAlertInfo);

                const maxScaledValue = response?.data.map((max: any) => Number(max.maxScaledVal.toFixed(2)));
                const averageScaledValue = response?.data.map((avg: any) => Number(avg.avgScaledVal.toFixed(2)));
                const minScaledValue = response?.data.map((min: any) => Number(min.minScaledVal.toFixed(2)));
                let criticalMaxValue = [];
                let warningMaxValue = [];
                let warningMinValue = [];
                let criticalMinValue = [];
                const zone = [];

                if(warning.wAT == 'High'){
                    warningMaxValue = response?.data.map((critical: any) => Number(JSON.parse(response.limits[0].warningAlertInfo).wMax));
                    zone.push({
                        value: warningMaxValue[0],
                        color: Colors[1]
                    });
                } else if(warning.wAT == 'Low'){
                    warningMinValue = response?.data.map((critical: any) => Number(JSON.parse(response.limits[0].warningAlertInfo).wMin));
                    zone.push({
                        value: warningMinValue[0],
                        color: Colors[1]
                    });
                } else {
                    warningMaxValue = response?.data.map((critical: any) => Number(JSON.parse(response.limits[0].warningAlertInfo).wMax));
                    warningMinValue = response?.data.map((critical: any) => Number(JSON.parse(response.limits[0].warningAlertInfo).wMin));
                }

                if(critial.cAT == 'High'){
                    criticalMaxValue = response?.data.map((critical: any) => Number(JSON.parse(response.limits[0].criticalAlertInfo).cMax));
                    zone.push({
                        value: criticalMaxValue[0],
                        color: Colors[3]
                    });
                } else if(critial.cAT == 'Low') {
                    criticalMinValue = response?.data.map((critical: any) => Number(JSON.parse(response.limits[0].criticalAlertInfo).cMin));
                    zone.push({
                        value: criticalMinValue[0],
                        color: Colors[3]
                    });
                } else {
                    criticalMaxValue = response?.data.map((critical: any) => Number(JSON.parse(response.limits[0].criticalAlertInfo).cMax));
                    criticalMinValue = response?.data.map((critical: any) => Number(JSON.parse(response.limits[0].criticalAlertInfo).cMin));
                }

                if(warning.wAT == 'Both'){
                    zone.push({
                        value: criticalMinValue[0],
                        color: Colors[4]
                    });
                    zone.push({
                        value: warningMinValue[0],
                        color: Colors[3]
                    });
                    zone.push({
                        value: warningMaxValue[0],
                        color: Colors[1]
                    });
                    zone.push({
                        value: criticalMaxValue[0],
                        color: Colors[3]
                    });
                    zone.push({
                        color: Colors[4]
                    });
                } else {
                    zone.push({
                        color: Colors[4]
                    });
                }

                // MaxScaledValue
                chart.push({
                    name:'Maximum',
                    data: maxScaledValue,
                    visible: false
                });

                // AverageScaledValue
                chart.push({
                    name: "Average",
                    data: averageScaledValue,
                    zones:  zone,
                    visible: true
                });

                // MinScaledValue
                chart.push({
                    name: "Minimum",
                    data: minScaledValue,
                    visible: false
                });

                // Warning
                if(warning.wAT == 'High'){
                    chart.push({
                        name: "Warning Max",
                        data: warningMaxValue,
                        visible: true
                    });
                } else if(warning.wAT == 'Low'){
                    chart.push({
                        name: "Warning Min",
                        data: warningMinValue,
                        visible: true
                    });
                } else {
                    chart.push({
                        name: "Warning Max",
                        data: warningMaxValue,
                        visible: true
                    });
                    chart.push({
                        name: "Warning Min",
                        data: warningMinValue,
                        visible: true
                    });
                }

                // critical
                if(critial.cAT == 'High'){
                    chart.push({
                        name: "Critical Max",
                        data: criticalMaxValue,
                        visible: true
                    });
                } else if(critial.cAT == 'Low'){
                    chart.push({
                        name: "Critical Min",
                        data: criticalMinValue,
                        visible: true
                    });
                } else {
                    chart.push({
                        name: "Critical Max",
                        data: criticalMaxValue,
                        visible: true
                    });
                    chart.push({
                        name: "Critical Min",
                        data: criticalMinValue,
                        visible: true
                    });
                }

                setLables(response?.data.map(({collectedTime}: any) => moment(collectedTime).format('DD-MM-YYYY HH:mm:ss')));
                setTrendsData(response.data);
            }
            setChartSeries(chart);
            setShowGraph(showGraph);
            // dispatch(setLoader(false));
        }
    }

    const HandleClose = () => {
        setModal2(false);
        setOpenModal(false);
    }

    const HandleGetData = (interval: string, lastTime: string) => {
        let currentLastTimeValue: any = `${moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm')}:00`;
        let currnetInterval: Number = 15;

        if(lastTime == "15 Min"){
            currentLastTimeValue = `${moment().subtract(15, 'minutes').format('YYYY-MM-DD HH:mm')}:00`;
        }
        if(lastTime == "1 Hour"){
            currentLastTimeValue = `${moment().subtract(1, 'hour').format('YYYY-MM-DD HH:mm')}:00`;
        }
        if(lastTime == "24 Hours"){
            currentLastTimeValue = `${moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm')}:00`;
        }
        if(lastTime == "1 Week"){
            currentLastTimeValue = `${moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm')}:00`;
        }
        if(lastTime == "1 Month"){
            currentLastTimeValue = `${moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')}:00`;
        }

        if(interval == "1 Minute"){
            currnetInterval = 1;
        }
        if(interval == "5 Minutes"){
            currnetInterval = 5;
        }
        if(interval == "15 Minutes"){
            currnetInterval = 15;
        }
        if(interval == "30 Minutes"){
            currnetInterval = 30;
        }
        if(interval == "1 Hour"){
            currnetInterval = 60;
        }
        if(interval == "1 Day"){
            currnetInterval = 1440;
        }

        GetData(currnetInterval, currentLastTimeValue);
    }

    const HandleLastTime = (lastTime: string) => {

        let CurrentTimeIntervalArray: Array<TimeIntervalArrayType> = TimeIntervalArray.filter(array => array.lastTime == lastTime);

        HandleGetData(CurrentTimeIntervalArray[0].defaultInterval, lastTime);
        setInterval(CurrentTimeIntervalArray[0].defaultInterval)
        setLastTime(lastTime)
    }

    const HandleInterval = (interval: string) => {
        if(!showCalendar){
            HandleGetData(interval, LastTime);
        } else {
            handleCustomDate(customDate, interval);
        }
        setInterval(interval);
    }

    const handleCustomDate = (date: any, interval: any = Interval) => {
        setCustomDate(date);
        if(date.length == 2){
            let time = `${moment().format('HH:mm')}:00`;
            let currnetInterval: Number = 15;

            date = `${moment(date[0]).format('YYYY-MM-DD')} ${time}|${moment(date[1]).format('YYYY-MM-DD')} ${time}`;

            switch (interval) {
                case "1 Minute":
                    currnetInterval = 1;
                    break;
                case "5 Minutes":
                    currnetInterval = 5;
                    break;
                case "15 Minutes":
                    currnetInterval = 15;
                    break;
                case "30 Minutes":
                    currnetInterval = 30;
                    break;
                case "1 Hour":
                    currnetInterval = 60;
                    break;
                case "1 Day":
                    currnetInterval = 1440;
                    break;
            }

            GetData(currnetInterval, date);
        }
    }

    const setDownloadData = () => {
        let criticalAlertInfo = JSON.parse(ChartData.criticalAlertInfo);
        let warningAlertInfo = JSON.parse(ChartData.warningAlertInfo);
        let stelInfo = ChartData.stelInfo;
        let twaInfo = ChartData.twaInfo;
        let currentlocation = Locations.find(location => location.locationID == ChartData.locationID);
        let currentbranch = Branches.find(branch => branch.branchID == ChartData.branchID);
        let currentfacility = Facilities.find(facility => facility.facilityID == ChartData.facilityID);
        let currentbuilding = Buildings.find(building => building.buildingID == ChartData.buildingID);
        let currentfloor = Floors.find(floor => floor.floorID == ChartData.floorID);
        let currentzone = Zones.find(zone => zone.zoneID == ChartData.zoneID);
        let currentdevice = AllDevices.find(device => device.deviceID == ChartData.deviceID);

        if(stelInfo){
            stelInfo = JSON.parse(stelInfo);
            if(Object.keys(stelInfo).length == 0){
                stelInfo = {
                    stelLimit: '',
                    stelDuration: '',
                    stelAlert: ''
                };
            }
        } else {
            stelInfo = {
                stelLimit: '',
                stelDuration: '',
                stelAlert: ''
            };
        }

        if(twaInfo){
            twaInfo = JSON.parse(twaInfo);

            if(Object.keys(twaInfo).length == 0){
                twaInfo = {
                    shift1: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlertTag: '',
                        twaStartTime: '08:30',
                    },
                    shift2: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlertTag: '',
                        twaStartTime: '',
                    },
                    shift3: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlertTag: '',
                        twaStartTime: '',
                    },
                    twaLimit: '0'
                };
            } else if(Object.keys(twaInfo).length == 1){
                twaInfo = {
                    shift1: twaInfo.shift1,
                    shift2: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlertTag: '',
                        twaStartTime: '',
                    },
                    shift3: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlertTag: '',
                        twaStartTime: '',
                    },
                    twaLimit: twaInfo.shift1.twaLimit
                };
            } else if(Object.keys(twaInfo).length == 2){
                twaInfo = {
                    shift1: twaInfo.shift1,
                    shift2: twaInfo.shift2,
                    shift3: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlertTag: '',
                        twaStartTime: '',
                    },
                    twaLimit: twaInfo.shift1.twaLimit
                };
            }
        } else {
            twaInfo = {
                shift1: {
                    twaShiftId: '',
                    twaDuration: '',
                    twaLimit: '',
                    twaAlertTag: '',
                    twaStartTime: '08:30',
                },
                shift2: {
                    twaShiftId: '',
                    twaDuration: '',
                    twaLimit: '0',
                    twaAlertTag: '',
                    twaStartTime: '',
                },
                shift3: {
                    twaShiftId: '',
                    twaDuration: '',
                    twaLimit: '0',
                    twaAlertTag: '',
                    twaStartTime: '',
                },
                twaLimit: '0'
            };
        }

        setPdfDefaultData(ChartData);
        setLocationData({
            locationName: currentlocation.locationName,
            branchName: currentbranch.branchName,
            facilityName: currentfacility.facilityName,
            buildingName: currentbuilding.buildingName,
            floorName: currentfloor.floorName,
            zoneName: currentzone.zoneName,
            deviceName: currentdevice.deviceName,
            sensor: ChartData.sensorTag,
        });
        setLimitsData({
            cAlert: criticalAlertInfo.cAT,
            cMax: criticalAlertInfo.cMax,
            cMin: criticalAlertInfo.cMin,
            stel: stelInfo.stelLimit,
            twa: twaInfo.twaLimit,
            wAlert: warningAlertInfo.wAT,
            wMax: warningAlertInfo.wMax,
            wMin: warningAlertInfo.wMin,
            unit: ChartData.units
        });
        setPdfModal(true);
    }

    const handleDownload = () => {
        if (chartRef?.current) {
            toPng(chartRef.current)
            .then((dataUrl) => {
                console.log('Image conversion successful');
                setChartImage(dataUrl);
                setDownloadData();
            })
            .catch((error) => {
                console.error(error);
            });
        } else {
            CustomToast('Chart not found.');
        }
    }

    useEffect(() => {
        if(openModal){
            setModal2(openModal);
            setLables([]);
            setLastTime(TimeIntervalArray[2].lastTime);
            setInterval(TimeIntervalArray[2].interval[1]);
            GetData();
            setShowCalendar(false);
            setCustomDate('')
        }
    }, [openModal])

    return (
        <Transition appear show={modal2} as={Fragment}>
            <Dialog as="div" open={modal2} onClose={HandleClose}>
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
                            <Dialog.Panel as="div" className="panel my-8 w-full max-w-full overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold dark:text-white">Trends of Sensors {ChartData?.sensorTag} </h5>
                                    <button type="button" className="text-white-dark dark:text-white hover:text-dark" onClick={HandleClose}>
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-col items-center">
                                        <form className="flex items-center gap-8">
                                            <div>
                                                <label htmlFor="sensorTag" className="dark:text-white">Sensor Tag</label>
                                                <div className="form-input text-white-dark w-[150px] dark:text-white text-lg">{ChartData?.sensorTag}</div>
                                            </div>
                                            <div>
                                                <label htmlFor="last" className="dark:text-white">Last</label>
                                                <div className="dropdown">
                                                    <Dropdown
                                                        offset={[0, 5]}
                                                        btnClassName="w-[150px] form-select dark:text-white text-lg"
                                                        button={LastTime}
                                                    >
                                                        <ul className='w-[150px]'>
                                                            {TimeIntervalArray.map((last, index) => <li key={index} onClick={() => {
                                                                setShowCalendar(last.lastTime == "Custom Date" ? true : false);
                                                                HandleLastTime(last.lastTime);
                                                            }}>
                                                                <button type="button" className="dark:text-white">{last.lastTime}</button>
                                                            </li>)}
                                                        </ul>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                            {showCalendar && <div>
                                                <label htmlFor="customDate" className="dark:text-white">Custom Date</label>
                                                <Flatpickr
                                                    options={{
                                                        mode: 'range',
                                                        dateFormat: 'd-m-Y',
                                                        position: isRtl ? 'auto right' : 'auto left',
                                                        maxDate: today
                                                    }}
                                                    value={customDate}
                                                    className="form-input w-[220px] dark:text-white text-lg"
                                                    onChange={(date) => handleCustomDate(date)}
                                                />
                                            </div>}
                                            <div>
                                                <label htmlFor="groupingInterval" className="dark:text-white">Grouping Interval</label>
                                                <div className="dropdown">
                                                    <Dropdown
                                                        offset={[0, 5]}
                                                        btnClassName="w-[150px] form-select dark:text-white text-lg"
                                                        button={Interval}
                                                    >
                                                        <ul className='w-[150px]'>
                                                            {TimeIntervalArray.filter(array => array.lastTime == LastTime)[0].interval.map((array: any, index: any) => <li key={index} onClick={() => HandleInterval(array)}>
                                                                <button type="button" className="dark:text-white">{array}</button>
                                                            </li>)}
                                                        </ul>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    {showGraph ? <div ref={chartRef}>
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={{
                                                accessibility: {
                                                    enabled: false
                                                },
                                                chart: {
                                                    type: 'line',
                                                    plotBackgroundColor: null,
                                                    plotBackgroundImage: null,
                                                    plotBorderWidth: 0,
                                                    plotShadow: false,
                                                    // className: '-mb-14',
                                                    height: '400px',
                                                    backgroundColor: isDark ? '#0E1726' : 'white',
                                                    zoomType: 'x'
                                                },
                                                // exporting: {
                                                //     enabled: true,
                                                // },
                                                credits: {
                                                    enabled: false
                                                },
                                                title: {
                                                    text: undefined
                                                },
                                                xAxis: {
                                                    categories: Labels,
                                                    axisBorder: {
                                                        color: isDark ? 'white' : '#e0e6ed',
                                                    },
                                                    labels: {
                                                        style: {
                                                            color: isDark ? 'white' : 'black'
                                                        }
                                                    }
                                                },
                                                yAxis: {
                                                    title: {
                                                        text: `Y axis: ${ChartData.units}`,
                                                        style: {
                                                            color: isDark ? 'white' : 'black'
                                                        }
                                                    },
                                                    opposite: isRtl ? true : false,
                                                    labels: {
                                                        offsetX: isRtl ? -20 : 0,
                                                        format: '{value}',
                                                        style: {
                                                            color: isDark ? 'white' : 'black'
                                                        }
                                                    },
                                                    style: {
                                                        color: isDark ? 'white' : 'black'
                                                    },
                                                    gridLineColor: 'transparent',
                                                },
                                                tooltip: {
                                                    crosshairs: true,
                                                    shared: true
                                                },
                                                legend: {
                                                    itemStyle: {
                                                        color: isDark ? 'white' : 'black'
                                                    },
                                                    itemHiddenStyle: {
                                                        // color:  isDark ? 'white' : 'black'
                                                    }
                                                },
                                                colors: chartSeries.length == 5 ? Colors : Colors2,
                                                plotOptions: {
                                                    line: {
                                                        marker: {
                                                            enabled: false,
                                                        },
                                                        lineWidth: 2,
                                                    },
                                                },
                                                series: chartSeries
                                            }}
                                        />
                                    </div> : <div className='flex h-[400px] justify-center items-center dark:text-white'>
                                        <b>No Data available</b>
                                    </div>}
                                    <div className="mt-8 flex items-center justify-end">
                                        {userDetails?.userRole != "User" && <>
                                            {showGraph ? <button type="button" className="btn btn-primary" onClick={handleDownload}>
                                                Download
                                            </button> : <button type="button" className="btn btn-primary" disabled>
                                                Download
                                            </button>}
                                        </>}
                                        <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={HandleClose}>
                                            Close
                                        </button>
                                    </div>
                                </div>

                                <PDFComponent
                                    openModal={pdfModal}
                                    setOpenModal={setPdfModal}
                                    defaultdata={pdfDefaultData}
                                    locationsData={locationData}
                                    limitsData={limitsData}
                                    rangeInterval={showCalendar ? `${moment(customDate[0]).format('DD-MM-YYYY')} to ${moment(customDate[1]).format('DD-MM-YYYY')}` : LastTime}
                                    segretionInterval={Interval}
                                    imageData={chartImage}
                                    trendSensorData={trendsData}
                                />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
