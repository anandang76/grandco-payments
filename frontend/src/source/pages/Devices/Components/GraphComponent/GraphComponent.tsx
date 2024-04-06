import React, { Fragment, useState, useEffect } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import { getAQIGraph } from '@/source/service/DashboardService';
import AqiBarGraph from '../AqiBarGraph/AqiBarGraph';
import moment from 'moment';

const GraphComponent = ({ openModal, setOpenModal, zoneID }: any) => {

    const [modal, setModal] = useState<boolean>(false);
    const [aqiSensors, setAqiSensors] = useState<Array<any>>([]);

    const handleClose = () => {
        setOpenModal(false);
        setModal(false);
    }

    const getHour = (dateTimeStr: any) => {
        return moment(dateTimeStr, "YYYY-MM-DD HH:mm:ss").startOf('hour').format("YYYY-MM-DD HH:mm:ss");
    }

    const hourlyAverage = (data: any) => {
        // Object to store hourly subindexes for each sensor
        var hourlySubindexes: any = {};

        // Iterate over each sensor data
        Object.keys(data).forEach((sensor) => {
            data[sensor].forEach((entry: any) => {
                var hour = getHour(entry.collectedTime);
                var subindex = parseFloat(entry.subIndex);
                if (!hourlySubindexes[sensor]) {
                    hourlySubindexes[sensor] = {};
                }
                if (!hourlySubindexes[sensor][hour]) {
                    hourlySubindexes[sensor][hour] = [];
                }
                hourlySubindexes[sensor][hour].push(subindex);
            });
        });

        // Object to store hourly averages for each sensor
        var hourlyAverages: any = {};

        // Calculate average subindex for each hour for each sensor
        Object.keys(hourlySubindexes).forEach((sensor) => {
            hourlyAverages[sensor] = {};
            Object.keys(hourlySubindexes[sensor]).forEach((hour) => {
                var subindexes = hourlySubindexes[sensor][hour];
                var avgSubindex = subindexes.reduce((acc: any, val: any) => { return acc + val; }, 0) / subindexes.length;
                hourlyAverages[sensor][hour] = avgSubindex.toFixed(2); // Adjust decimal places as needed
            });
        });

        var transformedData: any = {};

        Object.keys(hourlyAverages).forEach((sensor) => {
            transformedData[sensor] = [];
            Object.keys(hourlyAverages[sensor]).forEach((dateTime) => {
                transformedData[sensor].push({
                    "subIndex": hourlyAverages[sensor][dateTime],
                    "collectedTime": dateTime
                });
            });
        });

        return transformedData;
    }

    const getData = async () => {
        let response = await getAQIGraph({
            zoneID: zoneID,
            time: `${moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm')}:00`
        });


        if(response?.data?.status == "success"){
            response = hourlyAverage(response.data.data);
            setAqiSensors(response);
        }
    }

    useEffect(() => {
        if(openModal){
            getData();
        }
        setModal(openModal);
    }, [openModal])

    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" open={modal} onClose={handleClose}>
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
                            <Dialog.Panel as="div" className={`panel my-8 w-full ${Object.keys(aqiSensors).length > 0 ? 'max-w-full' : 'max-w-lg'} overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark`}>
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c] dark:text-white">
                                    <h5 className="text-lg font-bold">AQI Trend</h5>
                                    <button type="button" className="text-white-dark dark:text-white hover:text-dark" onClick={handleClose}>
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    {Object.keys(aqiSensors).length > 0 ? <div className="grid grid-cols-2">
                                        {Object.keys(aqiSensors).map((key: any) => <div key={key}>
                                            <AqiBarGraph
                                                data={{
                                                    data: aqiSensors[key],
                                                    sensorName: key
                                                }}
                                            />
                                        </div>)}
                                    </div> : <div className="flex justify-center items-center font-bold text-lg dark:text-white">
                                        No AQI data available
                                    </div>}
                                    {/* {aqiSensors.map((aqiSensor, index) => <div key={index}><AqiBarGraph data={aqiSensor} /></div>)} */}
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={handleClose}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default GraphComponent;
