import React, { useEffect, useState } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { IRootState } from '@/store';
import { useSelector } from 'react-redux';
import moment from 'moment';

const AqiBarGraph = ({ data }: any) => {

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const [graphData, setGraphData] = useState<any>({});

    const generateTimestamps = () => {
        const currentTimestamp = moment().valueOf();
        const newTimestamps: Array<any> = [];
        for (let i = 0; i < 24; i++) {
            const timestamp = moment(currentTimestamp).subtract(i, 'hours').valueOf();
            newTimestamps.push(moment(timestamp).format('YYYY-MM-DD HH:00:00'));
        }
        // Update the state with the new array of timestamps
        return newTimestamps;
    };

    const checkEmptyData = (data: any) => {
        let aqiGraph: Array<any> = [];
        let last24Hour = generateTimestamps();

        last24Hour.map((time: any) => {
            let graphData = data.data.find((aqi: any) => aqi.collectedTime == time);

            let subIndex = 0;
            let collectedTime = time;

            if(graphData){
                subIndex = graphData.subIndex;
                collectedTime = graphData.collectedTime;
            }

            aqiGraph.unshift({
                subIndex: subIndex,
                collectedTime: collectedTime
            })
        });

        let updateData = {
            data: aqiGraph,
            name: data.sensorName
        };

        setGraphData(updateData);
    }

    useEffect(() => {
        checkEmptyData(data);
    }, [data])

    return  <HighchartsReact
                highcharts={Highcharts}
                options={{
                    accessibility: {
                        enabled: false
                    },
                    chart: {
                        type: 'column',
                        backgroundColor: isDark ? '#0E1726' : 'white',
                        zoomType: 'x'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: graphData?.sensorName,
                        style: {
                            color: isDark ? 'white' : 'black'
                        }
                    },
                    xAxis: {
                        categories: graphData?.data?.map((aqi: any) => aqi.collectedTime.split(' ')[1].slice(0, -3)),
                        axisBorder: {
                            color: isDark ? 'white' : '#e0e6ed',
                        },
                        labels:{
                            style: {
                                color: isDark ? 'white' : 'black'
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: undefined
                        },
                        gridLineColor: 'transparent',
                        labels:{
                            style: {
                                color: isDark ? 'white' : 'black'
                            }
                        }
                    },
                    series: [{
                        name: 'Sub Index',
                        // data: graphData?.data?.map((aqi: any) => aqi.avgScaledVal),
                        data: graphData?.data?.map((aqi: any) => Math.round(aqi.subIndex)),
                        zones: [
                            {
                                value: 50,
                                color: '#026107'
                            },
                            {
                                value: 100,
                                color: '#729c02'
                            },
                            {
                                value: 200,
                                color: '#dbc604'
                            },
                            {
                                value: 300,
                                color: '#f78e16'
                            },
                            {
                                value: 400,
                                color: '#ed120e'
                            },
                            {
                                value: 5000,
                                color: '#af2d24'
                            }
                        ],
                        showInLegend: false
                    }]
                }}
            />
}

export default AqiBarGraph;
