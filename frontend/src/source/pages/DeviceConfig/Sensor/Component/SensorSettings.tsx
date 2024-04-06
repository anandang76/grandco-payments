import React, { Fragment, useEffect, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import { GetSensor, UpdateSensorSettings } from '@/source/service/DeviceConfigService';
import CustomToast from '@/helpers/CustomToast';

const SensorSettings = ({ openModal, setOpenModal, defaultData, onSuccess }: any) => {
    const [modal, setModal] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({
        id: '',
        sensorStatus: '',
        notificationStatus: '',
        sensorName: ''
    });

    const handleClose = () => {
        setModal(false);
        setOpenModal(false);
    }

    const handleCheckboxChange = (e: any) => {
        let { name, checked } = e.target;

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: checked
        }))
    }

    const handleSensorStatusChange = async (e: any) => {
        let sensorStatus = e.target.checked;

        let data: any = {
            sensorStatus: Number(sensorStatus)
        };

        if(!sensorStatus){
           data['notificationStatus'] = Number(sensorStatus);
        }

        let response = await UpdateSensorSettings(defaultData.id, data);

        if(response.data?.status == "success"){
            getSensorData();
        } else {
            CustomToast('Unable to update sensor', 'error');
        }
    }

    const handleSensorNotificationChange = async (e: any) => {
        let notificationStatus = e.target.checked;

        let data: any = {
            notificationStatus: Number(notificationStatus)
        };

        let response = await UpdateSensorSettings(defaultData.id, data);

        if(response.data?.status == "success"){
            getSensorData();
        } else {
            CustomToast('Unable to update sensor', 'error');
        }
    }

    const getSensorData = async () => {
        let response = await GetSensor({
            id: defaultData.id
        });

        if(response.data?.status == "success"){
            response = response.data.data;

            let { sensorStatus, notificationStatus, sensorTag, id } = response;
            setFormData({
                id: id,
                sensorStatus: Boolean(sensorStatus),
                notificationStatus: Boolean(notificationStatus),
                sensorTag: sensorTag
            });
        } else {
            CustomToast('Unable to fetch sensor', 'error');
            handleClose();
        }
    }

    useEffect(() => {
        if(openModal){
            getSensorData();
            setFormData({
                id: defaultData.id,
                sensorTag: defaultData.sensorTag
            });
            setModal(openModal);
        }
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
                            <Dialog.Panel as="div" className="panel my-8 w-full max-w-sm overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold dark:text-white">{formData.sensorTag} Sensor Settings</h5>
                                    <button type="button" className="text-white-dark hover:text-dark dark:text-white" onClick={handleClose}>
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-col items-center">
                                        <form className="flex flex-col items-center gap-4 w-full">
                                            <div className='w-full flex flex-row gap-2'>
                                                <label htmlFor="sensorStatus" className='dark:text-white'>Sensor Status</label>
                                                <label className="w-12 h-6 relative">
                                                    <input
                                                        type="checkbox"
                                                        name="sensorStatus"
                                                        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                        checked={formData.sensorStatus}
                                                        onChange={handleSensorStatusChange}
                                                    />
                                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                </label>
                                            </div>
                                            <div className='w-full flex flex-row gap-2'>
                                                <label htmlFor="notificationStatus" className='dark:text-white'>Notification Status</label>
                                                <label className="w-12 h-6 relative">
                                                    <input
                                                        type="checkbox"
                                                        name="notificationStatus"
                                                        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                        checked={formData.notificationStatus}
                                                        onChange={handleSensorNotificationChange}
                                                    />
                                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                </label>
                                            </div>
                                            <div className='w-full flex flex-row gap-2'>
                                                <label htmlFor="hooterRelay" className='dark:text-white'>Hooter Relay</label>
                                                <label className="w-12 h-6 relative">
                                                    {/* <input
                                                        type="checkbox"
                                                        name="hooterRelay"
                                                        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                        value=""
                                                        defaultChecked={formData.hooterRelay}
                                                        onChange={handleCheckboxChange}
                                                    /> */}
                                                    <div className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"></div>
                                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                </label>
                                            </div>
                                        </form>
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

export default SensorSettings;
