import React, { Fragment, useEffect, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import { getDeviceDebugData } from '@/source/service/DeviceConfigService';
import { json } from 'node:stream/consumers';

const DebugForm = ({ openModal, setOpenModal, defaultData, enableDevice }: any) => {

    const [modal, setModal] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({
        date: "",
        time: "",
        rssi: "",
        flashSize: "",
        batteryCharge: "",
        batteryHealth: "",
        firmwareVersion: ""
    });

    let intervalId: NodeJS.Timeout;

    const handleClose = () => {
        clearInterval(intervalId);
        enableDevice({
            id: defaultData.deviceID
        }, 'enabled');
        setModal(false);
        setOpenModal(false);
    }

    const getData = async () => {
        let response = await getDeviceDebugData({
            deviceID: defaultData.deviceID
        });

        if(response?.data?.status == "success"){
            let data = JSON.parse(response.data.data.data);

            const { DATE, TIME, RSSI, FLASH_SIZE, BATCHG, BATHEALTH, FW_VER } = data;

            setFormData({
                date: DATE,
                time: TIME,
                rssi: RSSI,
                flashSize: FLASH_SIZE,
                batteryCharge: BATCHG,
                batteryHealth: BATHEALTH,
                firmwareVersion: FW_VER
            })
        }
    }

    useEffect(() => {
        if(openModal){
            intervalId = setInterval(getData, 2000);
            setFormData({
                date: "",
                time: "",
                rssi: "",
                flashSize: "",
                batteryCharge: "",
                batteryHealth: "",
                firmwareVersion: ""
            });
            setModal(openModal);
        } else {
            clearInterval(intervalId);
        }

        return () => {
            clearInterval(intervalId);
        };
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
                                    <div className='flex gap-2'>
                                        <h5 className="text-lg font-bold dark:text-white">Debugging...</h5>
                                        <span className="animate-spin border-[3px] border-transparent border-l-primary rounded-full w-6 h-6 inline-block align-middle m-auto"></span>
                                    </div>

                                    <button type="button" className="text-white-dark hover:text-dark dark:text-white" onClick={handleClose}>
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="table-responsive mb-5">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">Date:</div>
                                                    </td>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">{formData.date}</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">Time:</div>
                                                    </td>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">{formData.time}</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">RSSI:</div>
                                                    </td>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">{formData.rssi}</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">Flash Size:</div>
                                                    </td>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">{formData.flashSize}</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">Battery Charge:</div>
                                                    </td>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">{formData.batteryCharge}</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">Battery Health:</div>
                                                    </td>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">{formData.batteryHealth}</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">Firmware Version:</div>
                                                    </td>
                                                    <td>
                                                        <div className="whitespace-nowrap dark:text-white">{formData.firmwareVersion}</div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-primary" onClick={handleClose}>
                                            Done
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

export default DebugForm;
