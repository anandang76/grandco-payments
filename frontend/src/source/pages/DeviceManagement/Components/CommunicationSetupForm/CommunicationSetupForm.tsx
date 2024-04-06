import CustomToast from '@/helpers/CustomToast';
import IconX from '@/components/Icon/IconX';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { AddCommunicationConfig, GetCommunicationConfig, UpdateCommunicationConfig } from '@/source/service/DeviceManagementService';
import { EyeIcon, EyeSlashedIcon } from '@/source/helpers/Icons';

const CommunicationSetupForm = ({ openModal, closeModal, DefaultData, OnSuccess }: any) => {

    const [modal2, setModal2] = useState(false);
    const [Title, setTitle] = useState('Communication Setup');

    const [formData, setFormData] = useState<any>({
        categoryName: '',
        categoryDescription: ''
    });
    const [formError, setFormError] = useState<any>({});

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showFTPPassword, setShowFTPPassword] = useState<boolean>(false);

    const HandleClose = () => {
        closeModal(false);
        setModal2(false);
    }

    const handleChange = (e: any, type:string="string") => {
        let { name, value } = e.target;

        if(type == "number"){
            value = value.replace(/[^\d-]/g, '')
        }

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value
        }))
    };

    const handleCheckBoxChange = (e: any) => {
        let { name, checked } = e.target;

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: checked
        }))
    }

    const HandleValid = () => {
        let isValid: boolean = true;
        let error: any = {};

        if(formData.configName == '' || formData.configName.trim() == ""){
            error['configName'] = "Config Name is required";
            isValid = false;
        }

        if(formData.isWifi || formData.isGSM || formData.isFTP){

            if(formData.isWifi){
                if(formData.ssid == "" || formData.ssid.trim() == ""){
                    error['ssid'] = "SSID is required";
                    isValid = false;
                }

                if(formData.ssidPassword == "" || formData.ssidPassword.trim() == ""){
                    error['ssidPassword'] = "Password is required";
                    isValid = false;
                }
            }

            if(formData.isGSM){
                if(formData.serviceProvider == "" || formData.serviceProvider.trim() == ""){
                    error['serviceProvider'] = "Service Provider is required";
                    isValid = false;
                }

                if(formData.apn == "" || formData.apn.trim() == ""){
                    error['apn'] = "APN is required";
                    isValid = false;
                }

                if(formData.mobileNumber == ""){
                    error['mobileNumber'] = "Mobile Number is required";
                    isValid = false;
                } else if(!(String(formData.mobileNumber).length == 10)){
                    error['mobileNumber'] = "Valid Mobile Number is required";
                    isValid = false;
                }

                if(formData.pin == "" || formData.apn.trim() == ""){
                    error['pin'] = "Mobile Number is required";
                    isValid = false;
                }
            }

            if(formData.isFTP){
                if(formData.accountName == "" || formData.accountName.trim() == ""){
                    error['accountName'] = "Account Name is required";
                    isValid = false;
                }

                if(formData.userName == "" || formData.userName.trim() == ""){
                    error['userName'] = "User Name is required";
                    isValid = false;
                }

                if(formData.ftpPassword == "" || formData.ftpPassword.trim() == ""){
                    error['ftpPassword'] = "Password is required";
                    isValid = false;
                }

                if(formData.port == "" || formData.port.trim() == ""){
                    error['port'] = "port is required";
                    isValid = false;
                }

                if(formData.serviceURL == "" || formData.serviceURL.trim() == ""){
                    error['serviceURL'] = "Service URL is required";
                    isValid = false;
                }

                if(formData.folderPath == "" || formData.folderPath.trim() == ""){
                    error['folderPath'] = "Folder Path is required";
                    isValid = false;
                }
            }
        } else {
            error['error'] = "Any one of the above communication method is required";
            isValid = false;
        }

        setFormError(error);

        return isValid;
    }

    const HandleAdd = async () => {
        if(HandleValid()){
            let message: string = "Something went wrong, unable to add";
            let status: string = "error";

            let response: any;

            let data: any = {
                name: formData.configName
            };

            if(formData.isWifi){
                data['isWifi'] = Number(formData.isWifi);
                data['wifiInfo'] = JSON.stringify({
                    ssid: formData.ssid,
                    ssidPassword: formData.ssidPassword
                });
            }

            if(formData.isGSM){
                data['isGSM'] = Number(formData.isGSM);
                data['gsmInfo'] = JSON.stringify({
                    serviceProvider: formData.serviceProvider,
                    apn: formData.apn,
                    mobileNumber: formData.mobileNumber,
                    pin: formData.pin
                });
            }

            if(formData.isFTP){
                data['isFTP'] = Number(formData.isFTP);
                data['ftpInfo'] = JSON.stringify({
                    accountName: formData.accountName,
                    userName: formData.userName,
                    ftpPassword: formData.ftpPassword,
                    port: formData.port,
                    serviceURL: formData.serviceURL,
                    folderPath: formData.folderPath
                })
            }

            if(DefaultData.edit){
                message = "Something went wrong, unable to update";
                data['id'] = DefaultData.id;
                response = await UpdateCommunicationConfig(data);
            } else {
                response = await AddCommunicationConfig(data);
            }

            if(response.data?.status == "success"){
                message = response.data.message;
                status = response.data.status;
                OnSuccess(true);
            }

            CustomToast(message, status);
            HandleClose();

        }
    };

    const GetData = async () => {
        let response = await GetCommunicationConfig({
            id: DefaultData.id
        });

        if(response?.data?.status == "success"){
            let { name, isWifi, wifiInfo, isGSM, gsmInfo, isFTP, ftpInfo } = response.data.data;

            if(wifiInfo){
                wifiInfo = JSON.parse(wifiInfo);
            } else {
                wifiInfo = {
                    ssid: '',
                    ssidPassword: '',
                }
            }

            if(gsmInfo){
                gsmInfo = JSON.parse(gsmInfo);
            } else {
                gsmInfo = {
                    serviceProvider: '',
                    apn: '',
                    mobileNumber: '',
                    pin: '',
                }
            }

            if(ftpInfo){
                ftpInfo = JSON.parse(ftpInfo);
            } else {
                ftpInfo = {
                    accountName: '',
                    userName: '',
                    ftpPassword: '',
                    port: '',
                    serviceURL: '',
                    folderPath: ''
                }
            }

            setFormData({
                configName: name,
                isWifi: Boolean(isWifi),
                ssid: wifiInfo.ssid,
                ssidPassword: wifiInfo.ssidPassword,
                isGSM: Boolean(isGSM),
                serviceProvider: gsmInfo.serviceProvider,
                apn: gsmInfo.apn,
                mobileNumber: gsmInfo.mobileNumber,
                pin: gsmInfo.pin,
                isFTP: Boolean(isFTP),
                accountName: ftpInfo.accountName,
                userName: ftpInfo.userName,
                ftpPassword: ftpInfo.ftpPassword,
                port: ftpInfo.port,
                serviceURL: ftpInfo.serviceURL,
                folderPath: ftpInfo.folderPath
            });
        } else {
            CustomToast('Communication config not found','error');
            HandleClose();
        }
    }

    useEffect(() => {
        if(openModal){
            if(DefaultData.edit){
                GetData();
                setTitle(`Edit Communication Setup`);
            } else {
                setFormData({
                    configName: '',
                    isWifi: false,
                    ssid: '',
                    ssidPassword: '',
                    isGSM: false,
                    serviceProvider: '',
                    apn: '',
                    mobileNumber: '',
                    pin: '',
                    isFTP: false,
                    accountName: '',
                    userName: '',
                    ftpPassword: '',
                    port: '',
                    serviceURL: '',
                    folderPath: ''
                });
                setTitle(`Add Communication Setup`);
            }
            setFormError({});
            setModal2(openModal);
        }
    }, [openModal])

    return (
        <>
            <Transition appear show={modal2} as={Fragment}>
                <Dialog as="div" open={modal2} onClose={HandleClose}>
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
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-2xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold dark:text-white">{Title}</h5>
                                        <button type="button" className="text-white-dark hover:text-dark dark:text-white" onClick={HandleClose}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex flex-col items-center">
                                            <form className="flex flex-col items-center gap-2 w-full">
                                                <div className="w-full">
                                                    <label htmlFor="configName" className="dark:text-white">Config Name</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="configName"
                                                        onChange={handleChange}
                                                        value={formData.configName}
                                                    />
                                                    {formError.configName && <div className='text-sm text-danger'>{formError.configName}</div>}
                                                </div>
                                                <div className="w-full">
                                                    <label className="inline-flex">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox"
                                                            name="isWifi"
                                                            onChange={handleCheckBoxChange}
                                                            checked={formData.isWifi}
                                                        />
                                                        <span className="dark:text-white">WiFi</span>
                                                    </label>
                                                </div>
                                                {formData.isWifi && <div className='flex flex-row w-full gap-2'>
                                                    <div className='w-full'>
                                                        <label htmlFor="ssid" className='dark:text-white'>SSID (WiFi Name)</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="ssid"
                                                            onChange={handleChange}
                                                            value={formData.ssid}
                                                        />
                                                        {formError.ssid && <div className='text-sm text-danger'>{formError.ssid}</div>}
                                                    </div>
                                                    <div className='w-full'>
                                                        <label htmlFor="password" className='dark:text-white'>Password</label>
                                                        <div className='relative'>
                                                            <input
                                                                type={showPassword ? "text" : "password"}
                                                                className='form-input dark:text-white'
                                                                name="ssidPassword"
                                                                onChange={handleChange}
                                                                value={formData.ssidPassword}
                                                            />
                                                            <div onClick={() => setShowPassword(!showPassword)}>
                                                                {showPassword ? <EyeSlashedIcon className='absolute top-2 right-2' />
                                                                    :
                                                                <EyeIcon className='absolute top-2 right-2' />}
                                                            </div>
                                                        </div>
                                                        {formError.ssidPassword && <div className='text-sm text-danger'>{formError.ssidPassword}</div>}
                                                    </div>
                                                </div>}
                                                <div className="w-full">
                                                    <label className="inline-flex">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox"
                                                            name="isGSM"
                                                            onChange={handleCheckBoxChange}
                                                            checked={formData.isGSM}
                                                        />
                                                        <span className='dark:text-white'>GSM</span>
                                                    </label>
                                                </div>
                                                {formData.isGSM && <>
                                                    <div className='flex flex-row w-full gap-2'>
                                                        <div className='w-full'>
                                                            <label htmlFor="serviceProvider" className='dark:text-white'>Service Provider</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="serviceProvider"
                                                                onChange={handleChange}
                                                                value={formData.serviceProvider}
                                                            />
                                                            {formError.serviceProvider && <div className='text-sm text-danger'>{formError.serviceProvider}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="apn" className='dark:text-white'>APN</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="apn"
                                                                onChange={handleChange}
                                                                value={formData.apn}
                                                            />
                                                            {formError.apn && <div className='text-sm text-danger'>{formError.apn}</div>}
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-row w-full gap-2'>
                                                        <div className='w-full'>
                                                            <label htmlFor="mobileNumber" className='dark:text-white'>Mobile Number</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="mobileNumber"
                                                                onChange={(e) => handleChange(e, 'number')}
                                                                value={formData.mobileNumber}
                                                            />
                                                            {formError.mobileNumber && <div className='text-sm text-danger'>{formError.mobileNumber}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="pin" className='dark:text-white'>Pin</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="pin"
                                                                onChange={handleChange}
                                                                value={formData.pin}
                                                            />
                                                            {formError.pin && <div className='text-sm text-danger'>{formError.pin}</div>}
                                                        </div>
                                                    </div>
                                                </>}
                                                <div className="w-full">
                                                    <label className="inline-flex">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox"
                                                            name="isFTP"
                                                            onChange={handleCheckBoxChange}
                                                            checked={formData.isFTP}
                                                        />
                                                        <span className='dark:text-white'>FTP</span>
                                                    </label>
                                                </div>
                                                {formData.isFTP && <>
                                                    <div className='flex flex-row w-full gap-2'>
                                                        <div className='w-full'>
                                                            <label htmlFor="accountName" className='dark:text-white'>Account Name</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="accountName"
                                                                onChange={handleChange}
                                                                value={formData.accountName}
                                                            />
                                                            {formError.accountName && <div className='text-sm text-danger'>{formError.accountName}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="userName" className='dark:text-white'>User Name</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="userName"
                                                                onChange={handleChange}
                                                                value={formData.userName}
                                                            />
                                                            {formError.userName && <div className='text-sm text-danger'>{formError.userName}</div>}
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-row w-full gap-2'>
                                                        <div className='w-full'>
                                                            <label htmlFor="ftpPassword" className='dark:text-white'>Password</label>
                                                            <div className='relative'>
                                                                <input
                                                                    type={showFTPPassword ? "text" : "password"}
                                                                    className='form-input dark:text-white'
                                                                    name="ftpPassword"
                                                                    onChange={handleChange}
                                                                    value={formData.ftpPassword}
                                                                />
                                                                <div onClick={() => setShowFTPPassword(!showFTPPassword)}>
                                                                    {showFTPPassword ? <EyeSlashedIcon className='absolute top-2 right-2' />
                                                                        :
                                                                    <EyeIcon className='absolute top-2 right-2' />}
                                                                </div>
                                                            </div>
                                                            {formError.ftpPassword && <div className='text-sm text-danger'>{formError.ftpPassword}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="port" className='dark:text-white'>Port</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="port"
                                                                onChange={handleChange}
                                                                value={formData.port}
                                                            />
                                                            {formError.port && <div className='text-sm text-danger'>{formError.port}</div>}
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-row w-full gap-2'>
                                                        <div className='w-full'>
                                                            <label htmlFor="serviceURL" className='dark:text-white'>Service URL</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="serviceURL"
                                                                onChange={handleChange}
                                                                value={formData.serviceURL}
                                                            />
                                                            {formError.serviceURL && <div className='text-sm text-danger'>{formError.serviceURL}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="folderPath" className='dark:text-white'>Folder Path</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="folderPath"
                                                                onChange={handleChange}
                                                                value={formData.folderPath}
                                                            />
                                                            {formError.folderPath && <div className='text-sm text-danger'>{formError.folderPath}</div>}
                                                        </div>
                                                    </div>
                                                </>}
                                                <div className="w-full">
                                                    {formError.error &&  <div className='text-sm text-danger'>{formError.error}</div>}
                                                </div>
                                            </form>
                                        </div>
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" className="btn btn-primary" onClick={HandleAdd}>
                                                {DefaultData.edit ? 'Save' : 'Add'}
                                            </button>
                                            <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={HandleClose}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
};

export default CommunicationSetupForm;
