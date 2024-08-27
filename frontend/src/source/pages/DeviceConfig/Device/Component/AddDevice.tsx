import React, { Fragment, useEffect, useState } from 'react';
import IconX from '@/components/Icon/IconX';
import { Transition, Dialog } from '@headlessui/react';
import CustomToast from '@/helpers/CustomToast';
import Map from '../../../Dashboard/Component/Map/Map';
import { GetDevice, UpdateDevice, AddNewDevice } from '@/source/service/DeviceConfigService';
import { GetCategories } from '@/source/service/DeviceManagementService';
import themeConfig from '@/theme.config';
import Select from 'react-select';
import { useParams } from 'react-router-dom';

const AddDevice = ({ OpenModal, setOpenModal, LocationData, OnSuccess }: any) => {
    const BackendURL = themeConfig.apiURL;

    const [modal, setModal] = useState<boolean>(false);
    const [Title, setTitle] = useState<string>('Location');

    const [formData, setFormData] = useState<any>({
        deviceCategory: '',
        deviceName: '',
        deviceTag: '',
        macAddress: '',
        serialNumber: '',
        firmwareVersion: '',
        hardwareModelVersion: '',
        pollingPriority: '',
        nonPollingPriority: '',
        disconnectedOnGrid: '',
        binFileURL: ''
    });
    const [formError, setFormError] = useState<any>({});
    const [BinFile, setBinFile] = useState<any>(null);

    const [Categories, setCategories] = useState<Array<any>>([]);
    const [GridStatus, setGridStatus] = useState<Array<any>>([
        {
            label: 'Enable',
            value: '1'
        },
        {
            label: 'Disable',
            value: '0'
        }
    ]);

    const HandleClose = () => {
        setModal(false);
        setOpenModal(false);
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

    const HandleSelectChange = (e: any, name: string) => {
        setFormData((prevData: any) => ({
            ...prevData,
            [name]: e
        }))
    }

    const HandleFloorImage = (e: any) => {
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

    const HandleValid = () => {
        let isValid: boolean = true;
        let error: any = {};

        if(formData.deviceCategory){
            if(formData.deviceCategory == "" || formData.deviceCategory.label.trim() == ""){
                error['deviceCategory'] = "Device Category is required";
                isValid = false;
            }
        } else {
            error['deviceCategory'] = "Device Category is required";
            isValid = false;
        }

        if(formData.deviceName){
            if(formData.deviceName == "" || formData.deviceName.trim() == ""){
                error['deviceName'] = "Device Name is required";
                isValid = false;
            }
        } else {
            error['deviceName'] = "Device Name is required";
            isValid = false;
        }

        if(formData.deviceTag){
            if(formData.deviceTag == "" || formData.deviceTag.trim() == ""){
                error['deviceTag'] = "Device Tag is required";
                isValid = false;
            }
        } else {
            error['deviceTag'] = "Device Tag is required";
            isValid = false;
        }

        if(formData){
            if(formData.macAddress == "" || formData.macAddress.trim() == ""){
                error['macAddress'] = "MAC Address is required";
                isValid = false;
            }
        } else {
            error['macAddress'] = "MAC Address is required";
            isValid = false;
        }

        if(formData?.serialNumber == "" || formData?.serialNumber?.length == 0){
                error['serialNumber'] = "Serial Number is required";
                isValid = false;
        }
        
        if(formData.pollingPriority){
            if(formData.pollingPriority == "" || String(formData.pollingPriority).trim() == ""){
                error['pollingPriority'] = "Polling Priority Value is required";
                isValid = false;
            }
        } else {
            error['pollingPriority'] = "Polling Priority Value is required";
            isValid = false;
        }

        if(formData.nonPollingPriority){
            if(formData.nonPollingPriority == "" || String(formData.nonPollingPriority).trim() == ""){
                error['nonPollingPriority'] = "Polling Non Priority Value is required";
                isValid = false;
            }
        } else {
            error['nonPollingPriority'] = "Polling Non Priority Value is required";
            isValid = false;
        }

        if(formData.disconnectedOnGrid){
            if(formData.disconnectedOnGrid == "" || formData.disconnectedOnGrid.label.trim() == ""){
                error['disconnectedOnGrid'] = "Disconnected On Grid is required";
                isValid = false;
            }
        } else {
            error['disconnectedOnGrid'] = "Disconnected On Grid is required";
            isValid = false;
        }

        if(formData.dataPushUrl){
            if(formData.dataPushUrl == "" || formData.dataPushUrl.trim() == ""){
                error['dataPushUrl'] = "Data Push URL is required";
                isValid = false;
            }
        } else {
            error['dataPushUrl'] = "Data Push URL is required";
            isValid = false;
        }

        setFormError(error);

        return isValid;
    }

    const HandleAddLocation = async () => {
        if(HandleValid()){
            let { deviceCategory, deviceName, deviceTag, macAddress, serialNumber, firmwareVersion, hardwareModelVersion, pollingPriority, nonPollingPriority, disconnectedOnGrid, dataPushUrl } = formData;

            const Data = new FormData();

            Data.append('deviceCategory', deviceCategory.label);
            Data.append('deviceName', deviceName);
            Data.append('deviceTag', deviceTag);
            Data.append('macAddress', macAddress);
            Data.append('serialNumber', serialNumber);
            Data.append('firmwareVersion', firmwareVersion);
            Data.append('hardwareModelVersion', hardwareModelVersion);
            Data.append('pollingPriority', pollingPriority);
            Data.append('nonPollingPriority', nonPollingPriority);
            Data.append('disconnectedOnGrid', disconnectedOnGrid.value);
            Data.append('dataPushUrl', dataPushUrl);

            Data.append('locationID', LocationData.locationID);
            Data.append('branchID', LocationData.branchID);
            Data.append('facilityID', LocationData.facilityID);
            Data.append('buildingID', LocationData.buildingID);
            Data.append('floorID', LocationData.floorID);
            Data.append('zoneID', LocationData.zoneID);

            if(BinFile != null){
                Data.append('binFile', BinFile);
            }

            let message: string = "Something went wrong, Unable to add";
            let status: string = "error";

            let response: any;

            if(LocationData.edit){
                message = "Something went wrong, Unable to update";
                response = await UpdateDevice(LocationData.id, Data)
            } else {
                response = await AddNewDevice(Data);
            }

            if(response?.response?.status == 409){
                message = response.response.data.message;
                status = response.response.data.status;
                setFormError({
                    deviceTag: response.response.data.message
                });
            }

            if(response.data?.status == "success"){
                message = response.data.message;
                status = response.data.status;
                OnSuccess(true);
                HandleClose();
            }

            CustomToast(message, status);
        }
    };

    const GetFormData = async () => {
        let response = await GetCategories();

        if(response.data?.status == "success"){
            response = response.data.data;
            response.map((category: any) => {
                category.label = category.categoryName;
                category.value = category.id;
            });

            setCategories(response);
        } else {
            CustomToast('Unable to fetch categories', 'error')
        }
    }

    const GetData = async () => {
        let response = await GetDevice({
            id: LocationData.id,
            locationID: LocationData.locationID,
            branchID: LocationData.branchID,
            facilityID: LocationData.facilityID,
            buildingID: LocationData.buildingID,
            floorID: LocationData.floorID,
            zoneID: LocationData.zoneID
        });

        if(response.data?.status == "success"){
            let { categoryID, deviceCategory, deviceName, deviceTag, macAddress, serialNumber, firmwareVersion, hardwareModelVersion, pollingPriority, nonPollingPriority, disconnectionStatus, binFileName, dataPushUrl, disconnectedOnGrid } = response.data.data;

            let data = {
                deviceCategory: {
                    label: deviceCategory,
                    value: categoryID
                },
                deviceName: deviceName,
                deviceTag: deviceTag,
                macAddress: macAddress,
                serialNumber: serialNumber,
                firmwareVersion: firmwareVersion,
                hardwareModelVersion: hardwareModelVersion,
                pollingPriority: pollingPriority,
                nonPollingPriority: nonPollingPriority,
                disconnectedOnGrid: GridStatus.find(status => status.value == disconnectedOnGrid),
                binFileURL: "",
                dataPushUrl: dataPushUrl
            }

            setFormData(data);
        } else {
            CustomToast('Device not found','error');
            HandleClose();
        }
    }

    useEffect(() => {
        if(OpenModal){
            GetFormData()
            setModal(OpenModal);
            if(LocationData.edit){
                GetData();
                setTitle('Edit Device');
            } else {
                setTitle('Add Device');
                setFormData({
                    deviceCategory: '',
                    deviceName: '',
                    deviceTag: '',
                    macAddress: '',
                    firmwareVersion: '',
                    hardwareModelVersion: '',
                    pollingPriority: '',
                    nonPollingPriority: '',
                    disconnectedOnGrid: '',
                    binFileURL: '',
                    dataPushUrl: `${BackendURL}device/pushData`
                });
                setBinFile(null);
            }
            setFormError({});
        }
    }, [OpenModal])

    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" open={modal} onClose={HandleClose}>
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
                                    <h5 className="text-lg font-bold dark:text-white">{Title}</h5>
                                    <button type="button" className="text-white-dark hover:text-dark dark:text-white" onClick={HandleClose}>
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-col items-center">
                                        <form className="flex flex-col items-center gap-4 w-full">
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="deviceCategory" className="dark:text-white">Device Category *</label>
                                                    <Select
                                                        name="deviceCategory"
                                                        className="w-full select-box dark:text-white"
                                                        options={Categories}
                                                        value={formData.deviceCategory}
                                                        onChange={(e) => HandleSelectChange(e, 'deviceCategory')}
                                                    />
                                                    {formError.deviceCategory && <div className='text-sm text-danger'>{formError.deviceCategory}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="deviceName" className="dark:text-white">Device Name *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="deviceName"
                                                        onChange={handleChange}
                                                        value={formData.deviceName}
                                                    />
                                                    {formError.deviceName && <div className='text-sm text-danger'>{formError.deviceName}</div>}
                                                </div>
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="deviceTag" className="dark:text-white">Device Tag *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="deviceTag"
                                                        onChange={handleChange}
                                                        value={formData.deviceTag}
                                                    />
                                                    {formError.deviceTag && <div className='text-sm text-danger'>{formError.deviceTag}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="serialNumber" className="dark:text-white">Serial Number *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="serialNumber"
                                                        onChange={handleChange}
                                                        value={formData.serialNumber}
                                                    />
                                                    {formError.serialNumber && <div className='text-sm text-danger'>{formError.serialNumber}</div>}
                                                </div>
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                {/* <div className='w-full'>
                                                    <label htmlFor="deviceTag" className="dark:text-white">Device Tag *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="deviceTag"
                                                        onChange={handleChange}
                                                        value={formData.deviceTag}
                                                    />
                                                    {formError.deviceTag && <div className='text-sm text-danger'>{formError.deviceTag}</div>}
                                                </div> */}
                                                <div className='w-full'>
                                                    <label htmlFor="macAddress" className="dark:text-white">MAC Address *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="macAddress"
                                                        onChange={handleChange}
                                                        value={formData.macAddress}
                                                    />
                                                    {formError.macAddress && <div className='text-sm text-danger'>{formError.macAddress}</div>}
                                                </div>
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="firmwareVersion" className="dark:text-white">Firmware Version</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="firmwareVersion"
                                                        onChange={handleChange}
                                                        value={formData.firmwareVersion}
                                                    />
                                                    {formError.firmwareVersion && <div className='text-sm text-danger'>{formError.firmwareVersion}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="hardwareModelVersion" className="dark:text-white">Hardware Version</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="hardwareModelVersion"
                                                        onChange={handleChange}
                                                        value={formData.hardwareModelVersion}
                                                    />
                                                    {formError.hardwareModelVersion && <div className='text-sm text-danger'>{formError.hardwareModelVersion}</div>}
                                                </div>
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="pollingPriority" className="dark:text-white">Polling Priority Value *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="pollingPriority"
                                                        onChange={(e) => handleChange(e, 'number')}
                                                        value={formData.pollingPriority}
                                                    />
                                                    {formError.pollingPriority && <div className='text-sm text-danger'>{formError.pollingPriority}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="nonPollingPriority" className="dark:text-white">Polling Non-Priority Value *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="nonPollingPriority"
                                                        onChange={(e) => handleChange(e, 'number')}
                                                        value={formData.nonPollingPriority}
                                                    />
                                                    {formError.nonPollingPriority && <div className='text-sm text-danger'>{formError.nonPollingPriority}</div>}
                                                </div>
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="binFile" className="dark:text-white">
                                                        Bin File
                                                        {formData.binFileURL != "" && <a className='text-xs ml-2' href={formData.binFileURL} target='_blank'>Click here to view file</a>}
                                                    </label>
                                                    <input
                                                        type="file"
                                                        className='form-file w-full border p-0.5 dark:text-white'
                                                        name="binFile"
                                                        accept=".bin"
                                                        onChange={HandleFloorImage}
                                                    />
                                                    {formError.binFile && <div className='text-sm text-danger'>{formError.binFile}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="disconnectedOnGrid" className="dark:text-white">Disconnected on Grid *</label>
                                                    <Select
                                                        name="disconnectedOnGrid"
                                                        className="w-full select-box dark:text-white"
                                                        menuPlacement='top'
                                                        options={GridStatus}
                                                        onChange={(e) => HandleSelectChange(e, 'disconnectedOnGrid')}
                                                        value={formData.disconnectedOnGrid}
                                                    />
                                                    {formError.disconnectedOnGrid && <div className='text-sm text-danger'>{formError.disconnectedOnGrid}</div>}
                                                </div>
                                                {/* <div className='w-full'>
                                                    <label htmlFor="hooter">Hooter</label>
                                                    <div className='flex gap-2'>
                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="hooter"
                                                                value="Non"
                                                                className="form-radio"
                                                                onClick={handleChange}
                                                            />
                                                            <span>Non</span>
                                                        </label>
                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="hooter"
                                                                value="localized_hooter"
                                                                className="form-radio"
                                                                onClick={handleChange}
                                                            />
                                                            <span>Localized Hooter</span>
                                                        </label>
                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="hooter"
                                                                value="centralized_hooter"
                                                                className="form-radio"
                                                                onClick={handleChange}
                                                            />
                                                            <span>Centralized Hooter</span>
                                                        </label>
                                                    </div>
                                                    {formError.hooter && <div className='text-sm text-danger'>{formError.hooter}</div>}
                                                </div> */}
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="dataPushUrl" className="dark:text-white">Data Push URL *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="dataPushUrl"
                                                        onChange={handleChange}
                                                        value={formData.dataPushUrl}
                                                    />
                                                    {formError.dataPushUrl && <div className='text-sm text-danger'>{formError.dataPushUrl}</div>}
                                                </div>
                                                <div className='w-full'>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-primary" onClick={HandleAddLocation}>
                                            {LocationData.edit ? 'Update' : 'Add'}
                                        </button>
                                        <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={HandleClose}>
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

export default AddDevice;
