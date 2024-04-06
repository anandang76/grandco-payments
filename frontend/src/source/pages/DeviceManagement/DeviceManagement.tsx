import React, { Fragment, useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import DeviceCategory from './Components/DeviceCategory/DeviceCategory';
import Units from './Components/Units/Units';
import SensorOutputType from './Components/SensorOutputType/SensorOutputType';
import AQI from './Components/AQI/AQI';
import Devices from './Components/Devices/Devices';
import Sensors from './Components/Sensors/Sensors';
import DefaultSensors from './Components/DefaultSensors/DefaultSensors';
import AddNewSensor from './Components/AddNewSensor/AddNewSensor';
import CommunicationSetup from './Components/CommunicationSetup/CommunicationSetup';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';

const DeviceManagement = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Device Management'));
    });
    return (
        <div className="panel">
            <div className="mb-5">
                <Tab.Group>
                    <Tab.List className="mt-3 flex flex-wrap">
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                    COMMUNICATION SETUP
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                    DEVICE CATEGORY
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                    UNITS
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                    SENSOR OUTPUT TYPE
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                    AQI
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                    SENSOR TYPE
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                    DEVICES LIST
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button className={`${selected ? 'bg-primary text-white !outline-none' : ''} -mb-[1px] dark:text-white block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}>
                                    SENSORS LIST
                                </button>
                            )}
                        </Tab>
                    </Tab.List>
                    <hr className='my-4' />
                    <Tab.Panels>
                        <Tab.Panel>
                            <CommunicationSetup />
                        </Tab.Panel>
                        <Tab.Panel>
                            <DeviceCategory />
                        </Tab.Panel>
                        <Tab.Panel>
                            <Units />
                        </Tab.Panel>
                        <Tab.Panel>
                            <SensorOutputType />
                        </Tab.Panel>
                        <Tab.Panel>
                            <AQI />
                        </Tab.Panel>
                        <Tab.Panel>
                            <AddNewSensor />
                        </Tab.Panel>
                        <Tab.Panel>
                            <Devices />
                        </Tab.Panel>
                        <Tab.Panel>
                            <Sensors />
                        </Tab.Panel>
                        {/* <Tab.Panel>
                            <DefaultSensors />
                        </Tab.Panel> */}
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    );
};

export default DeviceManagement;
