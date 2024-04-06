import IconBellBing from '@/components/Icon/IconBellBing';
import IconTranslation from '@/components/Icon/IconTranslation';
import TimeComponent from '@/source/pages/Sensors/Component/TimeComponent/TimeComponent';
import React, { useEffect, useState } from 'react';
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import HighchartsReact from "highcharts-react-official";
import { setLoader } from '@/store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { GraphComponent } from '@/source/pages/Sensors/Component/GraphComponent/GraphComponent';
import { GetSensor } from '@/source/service/DashboardService';
import CustomToast from '@/helpers/CustomToast';
import { IRootState } from '@/store';
highchartsMore(Highcharts);
solidGauge(Highcharts);

const SensorComponent = ({ Device }: any) => {
    const dispatch = useDispatch();

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const colors = ['#E61617', '#F3CE0C', '#00AB55', '#F3CE0C', '#E61617'];
    const colors2 = ['#00AB55', '#F3CE0C', '#E61617'];
    const thickness = 30;

    const StoredSensors = localStorage.getItem('sensors');
    const AllSensors: Array<any> = StoredSensors != null ? JSON.parse(StoredSensors) : [];

    const [Data, setData] = useState<any>([]);
    const [Alerts, setAlerts] = useState<Array<any>>([]);

    const [openChart, setOpenChart] = useState<boolean>(false);
    const [ChartData, setChartData] = useState<any>({});

    const GetData = async () => {
        let response = await GetSensor({
            deviceID: Device.id
        });

        if(response?.data?.status == "success"){
            response = response.data;
            setData(response.data);
            setAlerts(response.alerts);
        } else {
            CustomToast('Something went wrong', 'error');
        }
    }

    const setChart = (data: any) => {
        // dispatch(setLoader(true));
        setChartData(data)
        setOpenChart(true)
    }

    useEffect(() => {
        GetData();
    }, [Device])

    return (
        <div className="panel">
            <div className="py-5">
                <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">
                    <div className="panel h-full p-4 pb-0 rounded-xl dark:border dark:border-white-light">
                        <div className="flex items-center justify-center border-b border-white-light dark:text-white dark:border-white-light pb-2">
                            <div className="font-semibold text-lg">
                                <h6>Total Sensors</h6>
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-between py-5">
                            <div className="text-3xl dark:text-white">{Object.keys(Data).length}</div>
                            <div className="flex justify-end">
                                <button type="button" className="bg-success/30 text-success rounded-md px-1.5 py-1 text-xs hover:shadow-[0_10px_20px_-10px] hover:shadow-success">
                                    <IconTranslation />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="panel h-full p-4 pb-0 rounded-xl dark:border dark:border-white-light">
                        <div className="flex items-center justify-center border-b border-white-light dark:text-white dark:border-white-light pb-2">
                            <div className="font-semibol text-lg">
                                <h6>Active Alerts</h6>
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-between py-5">
                            <div className="text-3xl dark:text-white">
                                {Alerts?.reduce((sum, alert) => {
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
                        <div className="flex items-center justify-center border-b border-white-light dark:border-white-light pb-2">
                            <div className="font-semibold dark:text-white">
                                <h6>Time</h6>
                            </div>
                        </div>
                        <TimeComponent />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
                    {Object.keys(Data)?.map((sensor: any) => {
                        let tickPositions: Array<number> = [];
                        let selectedSensor: any = Data[sensor];
                        let currentSensor: any = AllSensors.find(sensors => sensors.sensorID == sensor);
                        let warningAlertInfo = currentSensor.warningAlertInfo;
                        let criticalAlertInfo = currentSensor.criticalAlertInfo;
                        let outofRangeAlertInfo = currentSensor.outofRangeAlertInfo;
                        let LastValue: string = Number(selectedSensor?.lastSensorValue).toFixed(2);
                        let MinValue: any = Number(selectedSensor?.minSensorValue).toFixed(2);
                        let MaxValue: any = Number(selectedSensor?.maxSensorValue).toFixed(2);
                        let AvgValue: any = Number(selectedSensor?.avgSensorValue).toFixed(2);
                        let NumSamples: any = Number(selectedSensor?.numSamples).toFixed(2);
                        let Warning: any = 0;
                        let Critical: any = 0;
                        let OutOfRange: any = 0;
                        let PlotPoints: Array<any> = [];
                        let bgColor = 'bg-[#00AB55]';
                        let showDial: Boolean = true;
                        let chartMin = 0;
                        let chartMax = 0;

                        // if(selectedSensor.status == 0){
                        //     bgColor = 'bg-gray-500';
                        // } else if(currentSensorAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[0]) || currentSensorAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[1])){
                        //     // bgColor = 'bg-red-500';
                        //     bgColor = 'bg-[#E61617]';
                        // } else if(currentSensorAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[2] || currentSensorAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[3]))){
                        //     // bgColor = 'bg-orange-500';
                        //     bgColor = 'bg-[#F3CE0C]';
                        // } else if(currentSensorAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[4] || currentSensorAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[5])) || currentSensorAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[6] || currentSensorAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[7]))){
                        //     // bgColor = 'bg-[#9c27b0]';
                        //     bgColor = 'bg-[#B541D2]';
                        // } else if(currentSensorAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[8] || currentSensorAlerts.find(alert => alert.alertType.toLowerCase() == StatusArray[9]))){
                        //     bgColor = 'bg-gray-500';
                        // }

                        warningAlertInfo = JSON.parse(warningAlertInfo);
                        criticalAlertInfo = JSON.parse(criticalAlertInfo);
                        outofRangeAlertInfo = JSON.parse(outofRangeAlertInfo);

                        if(warningAlertInfo?.wAT == "High"){
                            Warning = warningAlertInfo?.wMax;
                            tickPositions.push(Number(warningAlertInfo?.wMax));
                        } else if(warningAlertInfo?.wAT == "Both"){
                            Warning = `${warningAlertInfo?.wMin}, ${warningAlertInfo?.wMax}`;
                            tickPositions.push(Number(warningAlertInfo?.wMin));
                            tickPositions.push(Number(warningAlertInfo?.wMax));
                        } else {
                            Warning = warningAlertInfo?.wMin;
                            tickPositions.push(Number(warningAlertInfo?.wMin));
                        }

                        if(criticalAlertInfo?.cAT == "High"){
                            Critical = criticalAlertInfo?.cMax;
                            tickPositions.push(Number(criticalAlertInfo?.cMax));
                        } else if(criticalAlertInfo?.cAT == "Both"){
                            Critical = `${criticalAlertInfo?.cMin}, ${criticalAlertInfo?.cMax}`;
                            tickPositions.push(Number(criticalAlertInfo?.cMin));
                            tickPositions.push(Number(criticalAlertInfo?.cMax));
                        } else {
                            Critical = criticalAlertInfo?.cMin;
                            tickPositions.push(Number(criticalAlertInfo?.cMin));
                        }

                        if(outofRangeAlertInfo?.oAT == "High"){
                            OutOfRange = outofRangeAlertInfo?.oMax;
                            tickPositions.push(Number(outofRangeAlertInfo?.oMax));
                            tickPositions.push(0);
                        } else if(outofRangeAlertInfo?.oAT == "Both"){
                            OutOfRange = `${outofRangeAlertInfo?.oMin}, ${outofRangeAlertInfo?.oMax}`;
                            tickPositions.push(Number(outofRangeAlertInfo?.oMin));
                            tickPositions.push(Number(outofRangeAlertInfo?.oMax));
                        } else {
                            OutOfRange = outofRangeAlertInfo?.oMin;
                            tickPositions.push(Number(outofRangeAlertInfo?.cMin));
                            tickPositions.push(0);
                        }

                        tickPositions = tickPositions.sort((a, b) => {return a - b});

                        if(tickPositions.length == 6){
                            for (let i = 0; i < tickPositions.length - 1; i++) {
                                PlotPoints.push({
                                    from: tickPositions[i],
                                    to: tickPositions[i + 1],
                                    color: colors[i],
                                    thickness: thickness,
                                });

                                if(Number(LastValue) >= tickPositions[i] && Number(LastValue) <= tickPositions[i + 1]){
                                    bgColor = `bg-[${colors[i]}]`;
                                }
                            }
                        } else {
                            for (let i = 0; i < tickPositions.length - 1; i++) {
                                PlotPoints.push({
                                    from: tickPositions[i],
                                    to: tickPositions[i + 1],
                                    color: colors2[i],
                                    thickness: thickness,
                                });

                                if(Number(LastValue) >= tickPositions[i] && Number(LastValue) <= tickPositions[i + 1]){
                                    bgColor = `bg-[${colors2[i]}]`;
                                }
                            }
                        }

                        if(selectedSensor.status == 0){
                            bgColor = 'bg-gray-500';
                        }

                        chartMin = tickPositions[0];
                        chartMax = tickPositions[tickPositions.length-1];

                        PlotPoints.push({
                            from: tickPositions[0],
                            to: Number(LastValue),
                            color: '#545353',
                            thickness: 10
                        });

                        return currentSensor ? <div key={sensor} className="panel h-full p-0 rounded-xl dark:border dark:border-white-light" onClick={() => setChart(currentSensor)}>
                            <div className={`flex justify-between border-b rounded-t-xl border-white-light dark:border-[#1b2e4b] p-4 ${bgColor} text-white`}>
                                <div className="font-bold text-md dark:text-white text-lg">{currentSensor?.sensorName}</div>
                                <div className="font-bold text-md dark:text-white text-lg">{currentSensor?.sensorTag}</div>
                            </div>

                            <div className="flex flex-col justify-between px-4 p-1 gap-2">
                                <div className='flex justify-between'>
                                    <div>
                                        <span className="dark:text-white font-bold text-lg">{currentSensor?.units}</span>
                                    </div>
                                    <div>
                                        <span className="dark:text-white">{NumSamples != 15 && `#${Number(NumSamples).toFixed()}`}</span>
                                    </div>
                                </div>
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
                                            className: '-mb-14',
                                            height: '100%',
                                            backgroundColor: isDark ? '#0E1726' : 'white',
                                        },
                                        exporting: {
                                            enabled: false,
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
                                            size: '80%'
                                        },
                                        // the value axis
                                        yAxis: {
                                            min: chartMin,
                                            max: chartMax,
                                            tickPositions: tickPositions,
                                            labels: {
                                                distance: 20,
                                                rotation: '120',
                                                style: {
                                                    fontSize: '15px',
                                                    color: isDark ? 'white' : 'black',
                                                },
                                                // formatter: function () {
                                                //     // Custom label format if needed
                                                //     return getTickString(this.value);
                                                // }
                                            },
                                            minorTickInterval: null,
                                            plotBands: PlotPoints,
                                            borderWidth: 0
                                        },
                                        series: [
                                            {
                                                name: 'Last Value',
                                                data: [Number(LastValue)],
                                                tooltip: {
                                                    valueSuffix: ` ${currentSensor?.units}`
                                                },
                                                dataLabels: {
                                                    // format: `{y}<br /><span style="font-size: 12px">${currentSensor?.units}</span>`,
                                                    format: `{y}`,
                                                    align: 'center', // Center-align horizontally
                                                    verticalAlign: 'top', //
                                                    borderWidth: 0,
                                                    color: isDark ? 'white' : 'black',
                                                    style: {
                                                        fontSize: '18px',
                                                    }
                                                },
                                                dial: {
                                                    radius: showDial ? '80%' : '0%',
                                                    backgroundColor: showDial ? 'gray' : 'trasnparent',
                                                    baseWidth: showDial ? 12 : 0,
                                                    baseLength: '0%',
                                                    rearLength: '0%'
                                                },
                                                pivot: {
                                                    backgroundColor: showDial ? 'gray' : 'transparent',
                                                    radius: showDial ? 6 : 0
                                                }
                                            }
                                        ]
                                    }}
                                />
                            </div>

                            <div className='flex justify-between p-2'>
                                <div className='flex flex-col gap-0 items-center'>
                                    <span className='font-bold dark:text-white'>MIN</span>
                                    <span className='font-bold dark:text-white'>{MinValue}</span>
                                </div>
                                <div className='flex flex-col gap-0 items-center'>
                                    <span className='font-bold dark:text-white'>MAX</span>
                                    <span className='font-bold dark:text-white'>{MaxValue}</span>
                                </div>
                                <div className='flex flex-col gap-0 items-center'>
                                    <span className='font-bold dark:text-white'>AVG</span>
                                    <span className='font-bold dark:text-white'>{AvgValue}</span>
                                </div>
                            </div>
                        </div> : <></>
                    })}
                </div>
            </div>
            <GraphComponent openModal={openChart} setOpenModal={setOpenChart} ChartData={ChartData} />
        </div>
    );
};

export default SensorComponent;
