import React, { useState, useEffect } from 'react';
import IconVolumeCross from '@/components/Icon/IconVolumeCross';
import IconTranslation from '@/components/Icon/IconTranslation';
import IconCustomSpeaker from '@/components/Icon/IconCustomSpeaker';
import IconTranslationCrossed from '@/components/Icon/IconTranslationCrossed';
import IconCustomWifiDisconnected from '@/components/Icon/IconCustomWifiDisconnected';
import { AlertComponent } from '../AlertComponent/AlertComponent';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IRootState } from '@/store';
import { GetDevice } from '@/source/service/DashboardService';
import CustomToast from '@/helpers/CustomToast';
import IconAlarm from '@/components/Icon/IconAlarm';
import IconBellBing from '@/components/Icon/IconBellBing';
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import HighchartsReact from "highcharts-react-official";
import GraphComponent from '../GraphComponent/GraphComponent';
import moment from 'moment';
highchartsMore(Highcharts);
solidGauge(Highcharts);

const DeviceComponent = ({ params }: any) => {

    const navigate = useNavigate();
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const StatusArray: Array<string> = ['critical', 'stel', 'twa', 'warning', 'out of range', 'out ofrange', 'outof range', 'outofrange', 'device disconnected', 'devicedisconnected'];
    const Alerts: Array<any> = useSelector((state: IRootState) => state.themeConfig.notifications);
    const StoredDevices = localStorage.getItem('devices');

    const AllDevices: Array<any> = StoredDevices != null ? JSON.parse(StoredDevices) : [];

    const [CurrentAlerts, setCurrentAlerts] = useState<Array<any>>(Alerts);
    const [DeviceAlerts, setDeviceAlerts] = useState<Array<any>>([]);
    const [DeviceData, setDeviceData] = useState<Array<any>>([]);
    const [Devices, setDevices] = useState<Array<any>>([]);

    const [ShowAlerts, setShowAlerts] = useState<boolean>(false);
    let [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

    const tickPositions = [0, 50, 100, 200, 300, 400, 500];

    const [aqiGraph, setAQIGraph] = useState<boolean>(false);
    const [callDevice, setCallDevice] = useState<boolean>(false);

    const GetData = async () => {
        let response = await GetDevice(params);

        let responseDeviceAlerts: Array<any> = [];
        let responseDeviceData: Array<any> = [];
        let responseDevices: Array<any> = [];

        if(response?.data?.status == "success"){
            response = response?.data;
            responseDeviceAlerts = response?.alerts;
            responseDeviceData = response?.data;
            responseDevices = response?.device;
        } else {
            CustomToast('Something went wrong', 'error');
        }

        setDeviceAlerts(responseDeviceAlerts)
        setDeviceData(responseDeviceData)
        setDevices(responseDevices)
    }

    const HandleActiveAlerts = () => {
        DeviceAlerts.length > 0 && setShowAlerts(true);
    }

    const handleAQIGraph = (device: any) => {
        setAQIGraph(true);
    }

    const runAtNextSeventhSecond = () => {
        const now = moment();
        const nextMinute = moment(now).startOf('minute').add(1, 'minute').add(7, 'seconds');
        const delay = nextMinute.diff(now);

        setTimeout(() => {
            console.log(`Zone: ${moment().format('DD-MM-YYYY HH:mm:ss')}`)
            console.log(`zoneID; ${params.zoneID}`)
            setCallDevice(true);
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
        if(callDevice){
            GetData();
            runAtNextSeventhSecond();
            setCallDevice(false);
        }
    }, [callDevice, params])

    useEffect(() => {
        setCurrentAlerts(Alerts);
    }, [Alerts])

    useEffect(() => {
        GetData();
        runAtNextSeventhSecond();
    }, [params])

    return (
        <>
            <div className="py-5">
                <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">
                    <div className="panel h-full p-4 pb-0 rounded-xl">
                        {/* <div className="flex items-center justify-center border-b border-white-light dark:border-[#1b2e4b] pb-2"> */}
                        <div className="flex items-center justify-center border-b border-white-light dark:text-white dark:border-[#1b2e4b] pb-2">
                            <div className="font-semibold text-lg">
                                <h6>Hooter</h6>
                            </div>
                        </div>
                        <div className="w-full flex items-end justify-between py-5">
                            <IconVolumeCross className="w-16 h-16" />
                            <button type="button" className="flex items-center bg-purple-400/30 dark:bg-purple-400 text-purple-400 rounded-md px-1.5 py-1 text-xs hover:shadow-[0_10px_20px_-10px] hover:shadow-purple-400">
                                <IconCustomSpeaker />
                            </button>
                        </div>
                    </div>

                    <div className="panel h-full p-4 pb-0 rounded-xl">
                        {/* <div className="flex items-center justify-center border-b border-white-light dark:border-[#1b2e4b] pb-2"> */}
                        <div className="flex items-center justify-center border-b border-white-light dark:text-white dark:border-[#1b2e4b] pb-2">
                            <div className="font-semibold text-lg">
                                <h6>Disconnected Devices</h6>
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-between py-5">
                            <div className="text-3xl dark:text-white"> {Devices?.filter((device) => device.disconnectionStatus == "1").length} </div>
                            <div className="flex justify-end">
                                <button type="button" className="bg-danger/30 dark:bg-danger text-danger rounded-md px-1.5 py-1 text-xs hover:shadow-[0_10px_20px_-10px] hover:shadow-danger">
                                    <IconTranslationCrossed />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="panel h-full p-4 pb-0 rounded-xl">
                        {/* <div className="flex items-center justify-center border-b border-white-light dark:border-[#1b2e4b] pb-2"> */}
                        <div className="flex items-center justify-center border-b border-white-light dark:text-white dark:border-[#1b2e4b] pb-2">
                            <div className="font-semibold text-lg">
                                <h6>Total Devices</h6>
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-between py-5">
                            <div className="text-3xl dark:text-white"> {Devices?.length} </div>
                            <div className="flex justify-end">
                                <button type="button" className="bg-success/30 text-success rounded-md px-1.5 py-1 text-xs hover:shadow-[0_10px_20px_-10px] hover:shadow-success">
                                    <IconTranslation />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="panel h-full p-4 pb-0 rounded-xl">
                        {/* <div className="flex items-center justify-center border-b border-white-light dark:border-[#1b2e4b] pb-2"> */}
                        <div className="flex items-center justify-center border-b border-white-light dark:text-white dark:border-[#1b2e4b] pb-2">
                            <div className="font-semibold text-lg">
                                <h6>Active Alerts</h6>
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-between py-5" onClick={HandleActiveAlerts}>
                            <div className="text-3xl dark:text-white">
                                {DeviceAlerts?.reduce((sum, alert) => {
                                    return sum + alert.alarmCount;
                                }, 0)}
                            </div>
                            <div className="flex justify-end">
                                <button type="button" className="bg-purple-500/30 text-purple-500 rounded-md px-1.5 py-1 text-xs hover:shadow-[0_10px_20px_-10px] hover:shadow-purple-500">
                                    <IconBellBing />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="panel h-full p-4 pb-0 rounded-xl">
                        {/* <div className="flex items-center justify-center border-b border-white-light dark:border-[#1b2e4b] pb-2"> */}
                        <div className="flex items-center justify-center border-b border-white-light dark:text-white dark:border-[#1b2e4b] pb-2">
                            <div className="font-semibold text-lg">
                                <h6>AQI</h6>
                            </div>
                        </div>

                        {DeviceData[0]?.isAQI == 1 ?
                            <div className="w-full flex items-center justify-center" onClick={() => handleAQIGraph(DeviceData)}>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={{
                                        accessibility: {
                                            enabled: false
                                        },
                                        chart: {
                                            type: 'gauge',
                                            plotBackgroundColor: null,
                                            plotBackgroundImage: null,
                                            plotBorderWidth: 0,
                                            plotShadow: false,
                                            className: '-mb-14 -mt-5',
                                            height: '80%',
                                            backgroundColor: isDark ? '#0E1726' : 'white',
                                        },
                                        credits: {
                                            enabled: false
                                        },
                                        title: {
                                            text: undefined
                                        },
                                        pane: {
                                            startAngle: -120,
                                            endAngle: 120,
                                            background: null,
                                            center: ['50%', '50%'],
                                            size: '50%'
                                        },
                                        // the value axis
                                        yAxis: {
                                            min: tickPositions[0],
                                            max: tickPositions[tickPositions.length-1],
                                            tickPositions: tickPositions,
                                            labels: {
                                                distance: 20,
                                                rotation: '120',
                                                style: {
                                                    fontSize: '15px',
                                                    // color: isDark ? '#888EA8' : 'black',
                                                    color: isDark ? 'white' : 'black',
                                                },
                                                // formatter: function () {
                                                //     // Custom label format if needed
                                                //     return getTickString(this.value);
                                                // }
                                            },
                                            minorTickInterval: null,
                                            plotBands: [
                                                {
                                                    from: 0,
                                                    to: 50,
                                                    color: '#026107',
                                                    thickness: 10
                                                },
                                                {
                                                    from: 51,
                                                    to: 100,
                                                    color: '#729c02',
                                                    thickness: 10
                                                },
                                                {
                                                    from: 101,
                                                    to: 200,
                                                    color: '#dbc604',
                                                    thickness: 10
                                                },
                                                {
                                                    from: 201,
                                                    to: 300,
                                                    color: '#f78e16',
                                                    thickness: 10
                                                },
                                                {
                                                    from: 301,
                                                    to: 400,
                                                    color: '#ed120e',
                                                    thickness: 10
                                                },
                                                {
                                                    from: 401,
                                                    to: 5000,
                                                    color: '#af2d24',
                                                    thickness: 10
                                                }

                                            ],
                                            borderWidth: 0
                                        },
                                        series: [
                                            {
                                                name: 'AQI',
                                                data: [Number(DeviceData[0]?.aqiValue)],
                                                // tooltip: {
                                                //     valueSuffix: ` ${currentSensor?.units}`
                                                // },
                                                dataLabels: {
                                                    // format: `{y}<br /><span style="font-size: 12px">${currentSensor?.units}</span>`,
                                                    align: 'center', // Center-align horizontally
                                                    verticalAlign: 'top', //
                                                    borderWidth: 0,
                                                    // color: isDark ? '#888EA8' : 'black',
                                                    color: isDark ? 'white' : 'black',
                                                    style: {
                                                        fontSize: '18px',
                                                    }
                                                },
                                                dial: {
                                                    radius: (DeviceData[0]?.aqiValue >= 0 && DeviceData[0]?.aqiValue <= 500) ? '80%' : '0%',
                                                    backgroundColor: (DeviceData[0]?.aqiValue >= 0 && DeviceData[0]?.aqiValue <= 500) ? 'gray' : 'transparent',
                                                    baseWidth: 12,
                                                    baseLength: '0%',
                                                    rearLength: '0%'
                                                },
                                                pivot: {
                                                    backgroundColor: (DeviceData[0]?.aqiValue >= 0 && DeviceData[0]?.aqiValue <= 500) ? 'gray' : 'transparent',
                                                    radius: 6
                                                }
                                            }
                                        ]
                                    }}
                                />
                            </div>
                            :
                            <div className="w-full h-3/4 flex items-center justify-center dark:text-white">
                                <div className='font-bold text-lg'>No AQI Devices</div>
                            </div>
                        }


                    </div>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6 mt-8">
                    {Devices?.map((device, index) => {
                        let currentDeviceAlerts = CurrentAlerts.filter(alert => alert.deviceID == device.id);
                        let currentDevice = AllDevices?.filter(devices => devices.deviceID == device.id)[0];
                        let DeviceConnectionStatus = device?.disconnectionStatus == "1" ? true : false;
                        let bgColor = 'bg-[#00AB55]';

                        if(currentDevice?.disconnectionStatus != device?.disconnectionStatus){
                            AllDevices.map(devices => {
                                if(devices.deviceID == device.id){
                                    devices.disconnectionStatus = device.disconnectionStatus
                                }
                            })
                            localStorage.setItem('devices', JSON.stringify(AllDevices))
                        }

                        if(currentDeviceAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[0]) || currentDeviceAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[1])){
                            bgColor = 'bg-[#E61617]';
                        } else if(currentDeviceAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[2] || currentDeviceAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[3]))){
                            bgColor = 'bg-[#F3CE0C]';
                        } else if(currentDeviceAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[4] || currentDeviceAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[5])) || currentDeviceAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[6] || currentDeviceAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[7]))){
                            bgColor = 'bg-[#B541D2]';
                        } else if(currentDeviceAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[8] || currentDeviceAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[9]))){
                            bgColor = "bg-['#9CA3AF']";
                        }
                        return currentDevice ? <div key={index} className={`panel h-full p-0 rounded-xl`} onClick={() => navigate(`/device/${device.id}`)}>
                            <div className={`flex justify-between border-b rounded-t-xl border-white-light dark:border-[#1b2e4b] p-4 text-white ${DeviceConnectionStatus ? 'bg-gray-400' : bgColor}`}>
                                <div className={`text-lg ${DeviceConnectionStatus ? 'text-black' : ''} dark:text-white font-bold`}>{currentDevice?.deviceName}</div>
                                <div className={`text-lg ${DeviceConnectionStatus ? 'text-black' : ''} dark:text-white font-bold`}>{currentDevice?.deviceTag}</div>
                            </div>
                            <div className="w-full flex flex-col gap-8 p-4">
                                {DeviceConnectionStatus ?
                                    <div className="m-auto">
                                        <IconCustomWifiDisconnected className="w-16 h-16" />
                                    </div>
                                :
                                    <div className="w-full flex items-end justify-between py-5">
                                        <div className='dark:text-white text-base'>Active Alarms: </div>
                                        <button type="button" className="relative flex items-center text-warning rounded-md px-1.5 py-1 text-xs">
                                            <IconAlarm className='w-14 h-14 text-warning' />
                                            <div className="absolute top-0 right-0 bg-danger p-2 text-white rounded-3xl w-8 font-bold">
                                                {currentDeviceAlerts.length}
                                            </div>
                                        </button>
                                    </div>
                                }
                                <div>
                                    <span className='dark:text-white text-base'>Device mode: </span>
                                    <span className={`${DeviceConnectionStatus ? 'text-danger border-danger' : 'text-success border-success'} text-base border px-3 rounded-3xl`}>{DeviceConnectionStatus ? "Disconnected": "Connected"}</span>
                                </div>
                            </div>
                        </div> : <></>
                    })}
                </div>
            </div>

            <AlertComponent AlertModal={ShowAlerts} setAlertModal={setShowAlerts} zoneID={params.zoneID} />
            <GraphComponent openModal={aqiGraph} setOpenModal={setAQIGraph} zoneID={params.zoneID} />
        </>
    );
};

export default DeviceComponent;
