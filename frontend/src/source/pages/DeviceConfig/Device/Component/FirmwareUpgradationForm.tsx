import React, { Fragment, useEffect, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import CustomToast from '@/helpers/CustomToast';
import { updateBinFile, GetDevice } from '@/source/service/DeviceConfigService';
import IconInfoTriangle from '@/components/Icon/IconInfoTriangle';
import "./FirmwareUpgradationForm.css";

const FirmwareUpgradationForm = ({ openModal, setOpenModal, defaultData, enableDevice, onSuccess }: any) => {

    const [modal, setModal] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({
        binFileURL: "",
        firmwareVersion: ""
    });
    const [formError, setFormError] = useState<any>({});
    const [showForm, setShowForm] = useState<boolean>(true);

    const [BinFile, setBinFile] = useState<any>(null);

    const [modeCheck, setModeCheck] = useState<boolean>(false);
    const [firmwareUpgradationComplete, setFirmwareUpgradationComplete] = useState<boolean>(false);
    const [firmWareStatus, setFirmwareStatus] = useState<any>({});

    const handleClose = () => {
        onSuccess(true);
        setModal(false);
        setOpenModal(false);
    }

    const HandleValid = () => {
        let isValid: boolean = true;
        let error: any = {};

        if(BinFile == null && formData.binFileURL == ""){
            isValid = false;
            error['binFile'] = "Bin file is required";
        }

        if(formData.firmwareVersion == "" || formData.firmwareVersion.trim() == ""){
            isValid = false;
            error['firmwareVersion'] = "Firmware Version file is required";
        }

        setFormError(error);

        return isValid;
    }

    const handleBinFile = (e: any) => {
        let file = e.target.files[0];
        if(file.type == "application/octet-stream"){
            setBinFile(file);
            setFormData((prevData: any) => ({
                ...prevData,
                ['binFileURL']: URL.createObjectURL(file)
            }))

        } else {
            CustomToast('Invalid file type', 'error');
            setFormData((prevData: any) => ({
                ...prevData,
                ['binFileURL']: ''
            }))
            setBinFile(null);
        }
    }

    const getData = async (check=false) => {
        let response = await GetDevice({
            id: defaultData.deviceID,
            locationID: defaultData.locationID,
            branchID: defaultData.branchID,
            facilityID: defaultData.facilityID,
            buildingID: defaultData.buildingID,
            floorID: defaultData.floorID,
            zoneID: defaultData.zoneID
        });

        if(response.data?.status == "success"){
            if(check){
                const { deviceMode, firmwareVersion, deviceName, deviceTag, modifiedStatus } = response.data.data;
                if(deviceMode == "enabled"){
                    let firmwareStatus = `${deviceName} - ${deviceTag} upgraded to ${firmwareVersion}`;
                    if(modifiedStatus != "SUCCESS"){
                        firmwareStatus = `Unable to update firmware version`;
                    }
                    setFirmwareStatus({
                        status: modifiedStatus,
                        message: firmwareStatus
                    });
                    setFirmwareUpgradationComplete(true);
                    setModeCheck(false);
                    setTimeout(handleClose, 5000);
                }
            } else {
                let { deviceName, deviceTag } = response.data.data;
                setFormData((prevData: any) => ({
                    ...prevData,
                    ['deviceName']: deviceName,
                    ['deviceTag']: deviceTag
                }));
            }
        } else {
            CustomToast('Device not found','error');
            handleClose();
        }
    }

    const handleAdd = async () => {
        if(HandleValid()){
            const Data = new FormData();

            Data.append('locationID', defaultData.locationID);
            Data.append('branchID', defaultData.branchID);
            Data.append('facilityID', defaultData.facilityID);
            Data.append('buildingID', defaultData.buildingID);
            Data.append('floorID', defaultData.floorID);
            Data.append('zoneID', defaultData.zoneID);
            Data.append('deviceName', formData.deviceName);
            Data.append('deviceTag', formData.deviceTag);
            Data.append('firmwareVersion', formData.firmwareVersion);
            Data.append('binFile', BinFile);

            let message: string = "Something went wrong, Unable to update";
            let status: string = "error";

            let response = await updateBinFile(defaultData.deviceID, Data);

            if(response.data?.status == "success"){
                enableDevice({
                    id: defaultData.deviceID
                }, 'firmwareUpgradation', true);
                message = response.data.message;
                status = response.data.status;
                setShowForm(false);
                setModeCheck(true);
            }

            CustomToast(message, status);
        }
    }

    useEffect(() => {
        let intervalId: any;

        if (modeCheck) {
            intervalId = setInterval(() => getData(true), 5000);
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [modeCheck]);

    useEffect(() => {
        if(openModal){
            getData();
            setFormData({
                binFileURL: "",
                firmwareVersion: ""
            });
            setShowForm(true);
            setFormError({});
            setBinFile(null)
            setModal(openModal);
            setModeCheck(false);
            setFirmwareUpgradationComplete(false);
            setFirmwareStatus('');
        }
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
                                    <h5 className="text-lg font-bold dark:text-white">Firmware Upgradation</h5>

                                    {!showForm &&  <div className="flex gap-2 items-center dark:text-white">
                                        Device Status: <div className="btn btn-outline-success btn-sm rounded-full dark:text-white">Connected</div>
                                    </div>}
                                </div>
                                <div className="p-5">
                                    {showForm ? <div className="flex flex-col items-center">
                                        <form className="flex flex-col items-center gap-4 w-full">
                                            <div className='flex flex-row w-full gap-2'>
                                                <div className="w-full">
                                                    <label htmlFor="firmwareVersion" className='dark:text-white'>Bin File *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input w-full border dark:text-white'
                                                        name="firmwareVersion"
                                                        onChange={(e) => {
                                                            setFormData((prevData: any) => ({
                                                                ...prevData,
                                                                ['firmwareVersion']: e.target.value
                                                            }))
                                                        }}
                                                    />
                                                    {formError.firmwareVersion && <div className='text-sm text-danger'>{formError.firmwareVersion}</div>}
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="binFile" className='dark:text-white'>Bin File *</label>
                                                    <input
                                                        type="file"
                                                        className='form-file w-full border p-0.5 dark:text-white'
                                                        name="binFile"
                                                        accept=".bin"
                                                        onChange={handleBinFile}
                                                    />
                                                    {formError.binFile && <div className='text-sm text-danger'>{formError.binFile}</div>}
                                                </div>
                                            </div>
                                            <div className='flex flex-row justify-end w-full gap-2'>
                                                <button type="button" className="btn btn-primary" onClick={handleAdd}>
                                                    Submit
                                                </button>
                                                <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={handleClose}>
                                                    Close
                                                </button>
                                            </div>
                                        </form>
                                    </div> : firmwareUpgradationComplete ? <>
                                        {firmWareStatus?.status == "SUCCESS" ? <div className="swal2-icon swal2-success swal2-icon-show" style={{ display: 'flex' }}>
                                            <div className="swal2-success-circular-line-left" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                                            <span className="swal2-success-line-tip"></span>
                                            <span className="swal2-success-line-long"></span>
                                            <div className="swal2-success-ring"></div>
                                            <div className="swal2-success-fix" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                                            <div className="swal2-success-circular-line-right" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                                        </div> : <div className="swal2-icon swal2-error swal2-icon-show" style={{ display: "flex" }}>
                                            <span className="swal2-x-mark">
                                                <span className="swal2-x-mark-line-left"></span>
                                                <span className="swal2-x-mark-line-right"></span>
                                            </span>
                                        </div>}
                                        <div className='flex justify-center font-bold mt-8'>{firmWareStatus?.message}</div>
                                    </> : <div className="flex flex-col gap-4">
                                        <div className="relative flex items-center border p-3.5 rounded text-warning bg-warning-light border-warning ltr:border-l-[64px] rtl:border-r-[64px] dark:bg-warning-dark-light">
                                            <span className="absolute ltr:-left-11 rtl:-right-11 inset-y-0 text-white w-6 h-6 m-auto">
                                                <IconInfoTriangle />
                                            </span>
                                            <span className="ltr:pr-2 rtl:pl-2">
                                                <strong className="ltr:mr-1 rtl:ml-1 dark:text-white">Do not turn off the device and make sure that you have a stable network</strong>
                                            </span>
                                        </div>

                                        <span className="flex items-center animate-spin border-8 border-[#f1f2f3] border-l-primary rounded-full w-14 h-14 align-middle m-auto mb-10"></span>
                                    </div>}

                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default FirmwareUpgradationForm;
