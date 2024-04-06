import React, { Fragment, useEffect, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import IconInfoTriangle from '@/components/Icon/IconInfoTriangle';
import { GetDevice, getEventLogData, deleteEventLogData } from '@/source/service/DeviceConfigService';

const EventLogForm = ({ openModal, setOpenModal, defaultData, onSuccess }: any) => {

    let intervalId: NodeJS.Timeout;

    const [modal, setModal] = useState<boolean>(false);

    const handleClose = () => {
        onSuccess(true);
        setModal(false);
        setOpenModal(false);
    }

    const eventLogData = async () => {
        let response = await getEventLogData({
            deviceID: defaultData.deviceID
        });

        if(response?.data?.status == "success"){
            if(response?.data?.data?.status == "completed"){
                console.log(response?.data?.data);
                window.open(response?.data?.data?.logPath, '_blank');
                handleDelete(response?.data?.data?.id);
            }
        }
    }

    const handleDelete = async (id: Number) => {
        let response = await deleteEventLogData({
            id: id
        });

        console.log(response);
    }

    const getData = async () => {
        let response = await GetDevice({
            id: defaultData.deviceID,
            locationID: defaultData.locationID,
            branchID: defaultData.branchID,
            facilityID: defaultData.facilityID,
            buildingID: defaultData.buildingID,
            floorID: defaultData.floorID,
            zoneID: defaultData.zoneID
        });

        if(response?.data?.status == "success"){

            const { deviceMode } = response.data.data;
            if(deviceMode == "enabled"){
                handleClose();
            }
            eventLogData();
        }
    }

    useEffect(() => {
        if(openModal){
            intervalId = setInterval(getData, 5000);
            setModal(openModal);
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [openModal])

    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" open={modal} onClose={() => {return}}>
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
                            <Dialog.Panel as="div" className="panel my-8 w-full max-w-5xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold dark:text-white">Event Log</h5>

                                    <div className="flex gap-2 items-center dark:text-white">
                                        Device Status: <div className="btn btn-outline-success btn-sm rounded-full dark:text-white">Connected</div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-col gap-4">
                                        <div className="relative flex items-center border p-3.5 rounded text-warning bg-warning-light border-warning ltr:border-l-[64px] rtl:border-r-[64px] dark:bg-warning-dark-light">
                                            <span className="absolute ltr:-left-11 rtl:-right-11 inset-y-0 text-white w-6 h-6 m-auto dark:text-white">
                                                <IconInfoTriangle />
                                            </span>
                                            <span className="ltr:pr-2 rtl:pl-2">
                                                <strong className="ltr:mr-1 rtl:ml-1 dark:text-white">Do not turn off the device and make sure that you have a stable network</strong>
                                            </span>
                                        </div>

                                        <span className="flex items-center animate-spin border-8 border-[#f1f2f3] border-l-primary rounded-full w-14 h-14 align-middle m-auto mb-10"></span>
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

export default EventLogForm;
