import React, { Fragment, useEffect, useState } from 'react';
import IconX from '@/components/Icon/IconX';
import { Transition, Dialog } from '@headlessui/react';
import CustomToast from '@/helpers/CustomToast';
import Map from '../../../Dashboard/Component/Map/Map';
import { GetZone, UpdateZone, AddNewZone } from '@/source/service/DeviceConfigService';
import themeConfig from '@/theme.config';

const AddZone = ({ OpenModal, setOpenModal, LocationData, OnSuccess }: any) => {
    const BackendURL = themeConfig.apiURL.slice(0, -4);

    const [modal, setModal] = useState<boolean>(false);
    const [Title, setTitle] = useState<string>('Location');

    const [formData, setFormData] = useState<any>({
        zoneName: '',
        isAQI: false,
        latitude: '',
        longitude: '',
        zoneImageURL: ''
    });
    const [formError, setFormError] = useState<any>({});
    const [LocationImage, setLocationImage] = useState<any>(null);

    const HandleClose = () => {
        setModal(false);
        setOpenModal(false);
    }

    const handleChange = (e: any) => {
        let { name, value } = e.target;

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value
        }))
    };

    const HandleFloorImage = (e: any) => {
        let file = e.target.files[0];
        if(file.type == "image/png" || file.type == "image/jpeg"){
            setLocationImage(file);
            setFormData((prevData: any) => ({
                ...prevData,
                ['zoneImageURL']: URL.createObjectURL(file)
            }))

        } else {
            CustomToast('Invalid file type', 'error');
            setLocationImage(null);
        }
    }

    const HandleValid = () => {
        let isValid: boolean = true;
        let error: any = {};

        if(formData.zoneName){
            if(formData.zoneName == "" || formData.zoneName.trim() == ""){
                error['zoneName'] = "Zone Name is required";
                isValid = false;
            }
        } else {
            error['zoneName'] = "Zone Name is required";
            isValid = false;
        }

        setFormError(error);

        return isValid;
    }

    const HandleAddLocation = async () => {
        if(HandleValid()){
            let { latitude, longitude, zoneName, isAQI } = formData;
            isAQI = Number(isAQI);

            const Data = new FormData();

            Data.append('zoneName', zoneName);
            Data.append('isAQI', isAQI);
            Data.append('locationID', LocationData.locationID);
            Data.append('branchID', LocationData.branchID);
            Data.append('facilityID', LocationData.facilityID);
            Data.append('buildingID', LocationData.buildingID);
            Data.append('floorID', LocationData.floorID);

            if(latitude != ''&& longitude != ''){
                Data.append('coordinates', `${latitude}, ${longitude}`);
            }

            if(LocationImage != null){
                Data.append('zoneImage', LocationImage);
            }

            let message: string = "Something went wrong, unable to add";
            let status: string = "error";

            let response: any;

            if(LocationData.edit){
                message = "Something went wrong, unable to update";
                // Data.append('id', LocationData.id);
                response = await UpdateZone(LocationData.id, Data)
            } else {
                response = await AddNewZone(Data);
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

    const handleCheckBoxChange = (e: any) => {
        let { name, checked } = e.target;

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: checked
        }))
    }

    const GetData = async () => {
        let response = await GetZone({
            id: LocationData.id,
            locationID: LocationData.locationID,
            branchID: LocationData.branchID,
            facilityID: LocationData.facilityID,
            buildingID: LocationData.buildingID,
            floorID: LocationData.floorID
        });

        if(response.data?.status == "success"){
            let { zoneName, coordinates, image, isAQI } = response.data.data;
            let latitude = "";
            let longitude = "";

            if(coordinates){
                coordinates = coordinates.split(',');
                latitude = coordinates[0];
                longitude = coordinates[1];
            }

            setFormData({
                zoneName: zoneName,
                latitude: latitude,
                longitude: longitude,
                isAQI: Boolean(isAQI),
                zoneImageURL: image != null && `${BackendURL}${image}`
            });
        } else {
            CustomToast('Zone not found','error');
            HandleClose();
        }
    }

    useEffect(() => {
        if(OpenModal){
            setModal(OpenModal);
            if(LocationData.edit){
                GetData();
                setTitle('Edit Zone');
            } else {
                setTitle('Add Zone');
                setFormData({
                    zoneName: '',
                    latitude: '',
                    longitude: '',
                    zoneImageURL: '',
                    isAQI: false
                });
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
                                            <div className='flex flex-row w-full gap-2'>
                                                <div className='w-full'>
                                                    <label htmlFor="zoneName" className='dark:text-white'>Zone Name *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="zoneName"
                                                        onChange={handleChange}
                                                        value={formData.zoneName}
                                                    />
                                                    {formError.zoneName && <div className='text-sm text-danger'>{formError.zoneName}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="zoneImage" className='dark:text-white'>Zone Image *</label>
                                                    <input
                                                        type="file"
                                                        className='form-file w-full p-0.5 border dark:text-white'
                                                        name="zoneImage"
                                                        onChange={HandleFloorImage}
                                                        accept='image/png, image/jpeg'
                                                    />
                                                    {formError.zoneImage && <div className='text-sm text-danger'>{formError.zoneImage}</div>}
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <label className="inline-flex">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox"
                                                        name="isAQI"
                                                        onChange={handleCheckBoxChange}
                                                        checked={formData.isAQI}
                                                    />
                                                    <span className='dark:text-white'>AQI Zone</span>
                                                </label>
                                            </div>
                                        </form>

                                        {formData?.zoneImageURL != "" && <div className='mt-5 h-full w-full'>
                                            <img src={formData?.zoneImageURL} />
                                        </div>}
                                        {/* <div className='mt-5 h-full w-full'>
                                            <Map markers={map} />
                                        </div> */}
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

export default AddZone;
