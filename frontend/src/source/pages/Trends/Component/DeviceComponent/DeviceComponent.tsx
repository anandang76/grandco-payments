import IconAlarm from '@/components/Icon/IconAlarm';
import IconBellBing from '@/components/Icon/IconBellBing';
import IconCustomSpeaker from '@/components/Icon/IconCustomSpeaker';
import IconCustomWifiDisconnected from '@/components/Icon/IconCustomWifiDisconnected';
import IconTranslation from '@/components/Icon/IconTranslation';
import IconTranslationCrossed from '@/components/Icon/IconTranslationCrossed';
import IconVolumeCross from '@/components/Icon/IconVolumeCross';
import CustomToast from '@/helpers/CustomToast';
import { GetDevice } from '@/source/service/DashboardService';
import React, { useState, useEffect } from 'react';
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import HighchartsReact from "highcharts-react-official";
highchartsMore(Highcharts);
solidGauge(Highcharts);
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

const DeviceComponent = ({ zone, setSensors, setDeviceDetails, setDevice }: any) => {

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const StoredDevices = localStorage.getItem('devices');
    const AllDevices: Array<any> = StoredDevices != null ? JSON.parse(StoredDevices) : [];

    AllDevices.map((device) => {
        device.label = device.deviceName;
        device.value = device.id;
    });

    const [DeviceAlerts, setDeviceAlerts] = useState<Array<any>>([]);
    const [DeviceData, setDeviceData] = useState<Array<any>>([]);
    const [Devices, setDevices] = useState<Array<any>>([]);

    const tickPositions = [0, 50, 100, 200, 300, 400, 500];

    const GetData = async () => {
        let response = await GetDevice({
            zoneID: zone.zoneID
        });

        if(response?.data?.status == "success"){
            response = response?.data;
            setDeviceAlerts(response?.alerts)
            setDeviceData(response?.data)
            setDevices(response?.device)
        } else {
            CustomToast('Something went wrong', 'error');
        }
    }

    const HandleSensor = (device: any) => {
        setSensors(true);
        setDeviceDetails(device);
        setDevice(AllDevices.find(devices => devices.id == device.id));
    }

    useEffect(() => {
        GetData();
    }, [zone])

    return (
        <div className="panel">
            <div className="py-5">
                <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">
                    <div className="panel h-full p-4 pb-0 rounded-xl dark:border dark:border-white-light">
                        {/* <div className="flex items-center justify-center border-b border-white-light dark:border-[#1b2e4b] pb-2"> */}
                        <div className="flex items-center justify-center border-b border-white-light dark:text-white dark:border-white pb-2">
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

                    <div className="panel h-full p-4 pb-0 rounded-xl dark:border dark:border-white-light">
                        {/* <div className="flex items-center justify-center border-b border-white-light dark:border-[#1b2e4b] pb-2"> */}
                        <div className="flex items-center justify-center border-b border-white-light dark:text-white dark:border-white pb-2">
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

                    <div className="panel h-full p-4 pb-0 rounded-xl dark:border dark:border-white-light">
                        {/* <div className="flex items-center justify-center border-b border-white-light dark:border-[#1b2e4b] pb-2"> */}
                        <div className="flex items-center justify-center border-b border-white-light dark:text-white dark:border-white pb-2">
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

                    <div className="panel h-full p-4 pb-0 rounded-xl dark:border dark:border-white-light">
                        {/* <div className="flex items-center justify-center border-b border-white-light dark:border-[#1b2e4b] pb-2"> */}
                        <div className="flex items-center justify-center border-b border-white-light dark:text-white dark:border-white pb-2">
                            <div className="font-semibold text-lg">
                                <h6>Active Alerts</h6>
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-between py-5">
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

                    <div className="panel h-full p-4 pb-0 rounded-xl dark:border dark:border-white-light">
                        {/* <div className="flex items-center justify-center border-b border-white-light dark:border-[#1b2e4b] pb-2"> */}
                        <div className="flex items-center justify-center border-b border-white-light dark:text-white dark:border-white pb-2">
                            <div className="font-semibold text-lg">
                                <h6>AQI</h6>
                            </div>
                        </div>

                        {DeviceData[0]?.isAQI == 1 ?
                            <div className="w-full flex items-center justify-center">
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
                                                    radius: '80%',
                                                    backgroundColor: 'gray',
                                                    baseWidth: 12,
                                                    baseLength: '0%',
                                                    rearLength: '0%'
                                                },
                                                pivot: {
                                                    backgroundColor: 'gray',
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
                        let currentDevice = AllDevices?.filter(devices => devices.deviceID == device.id)[0];
                        let DeviceConnectionStatus = currentDevice?.disconnectionStatus == "1" ? true : false;
                        return currentDevice ? <div key={index} className={`panel h-full p-0 rounded-xl dark:border dark:border-white`} onClick={() => HandleSensor(device)}>
                            <div className={`flex justify-between border-b rounded-t-xl border-white-light dark:border-[#1b2e4b] p-4 text-white ${DeviceConnectionStatus ? 'bg-gray-400' : 'bg-success'}`}>
                                <div className={`text-lg ${DeviceConnectionStatus ? 'text-black' : ''} dark:text-white font-bold`}>{currentDevice?.deviceName}</div>
                                <div className={`text-lg ${DeviceConnectionStatus ? 'text-black' : ''} dark:text-white font-bold`}>{currentDevice?.deviceTag}</div>
                            </div>
                            <div className="w-full flex flex-col gap-2 p-4">
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
                                                {DeviceAlerts.filter(alerts => alerts.deviceID == device.id).length}
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
        </div>
    )

};

export default DeviceComponent;
