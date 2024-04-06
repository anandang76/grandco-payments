import React, { Fragment, useEffect, useState } from 'react';
import IconX from '@/components/Icon/IconX';
import { Transition, Dialog } from '@headlessui/react';
import CustomToast from '@/helpers/CustomToast';
import Map from '../../../Dashboard/Component/Map/Map';
import { GetBranch, UpdateBranch, AddNewBranch, removeImage } from '@/source/service/DeviceConfigService';
import themeConfig from '@/theme.config';
import Tippy from '@tippyjs/react';
import { DeleteIcon } from '@/source/helpers/Icons';
import IconEye from '@/components/Icon/IconEye';
import Swal from "sweetalert2";

const AddBranch = ({ OpenModal, setOpenModal, LocationData, MapDetails, OnSuccess }: any) => {
    const BackendURL = themeConfig.apiURL.slice(0, -4);

    const [modal, setModal] = useState<boolean>(false);
    const [Title, setTitle] = useState<string>('Location');

    const [formData, setFormData] = useState<any>({
        branchName: '',
        latitude: '',
        longitude: '',
        branchImageURL: ''
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

    const HandleBranchImage = (e: any) => {
        let file = e.target.files[0];
        if(file.type == "image/png" || file.type == "image/jpeg"){
            setLocationImage(file);
            setFormData((prevData: any) => ({
                ...prevData,
                ['branchImageURL']: URL.createObjectURL(file)
            }))

        } else {
            CustomToast('Invalid file type', 'error');
            setLocationImage(null);
        }
    }

    const getEvent = (e: any) => {
        setFormData((prevData: any) => ({
            ...prevData,
            ['latitude']: e.latLng.lat(),
            ['longitude']: e.latLng.lng()
        }))
    }

    const HandleValid = () => {
        let isValid: boolean = true;
        let error: any = {};

        if(formData.branchName){
            if(formData.branchName == "" || formData.branchName.trim() == ""){
                error['branchName'] = "Location Name is required";
                isValid = false;
            }
        } else {
            error['branchName'] = "Location Name is required";
            isValid = false;
        }

        setFormError(error);

        return isValid;
    }

    const HandleAddLocation = async () => {
        if(HandleValid()){
            let { latitude, longitude } = formData;

            latitude = latitude.toString().trim();
            longitude = longitude.toString().trim();

            const Data = new FormData();

            Data.append('branchName', formData.branchName);
            Data.append('locationID', LocationData.locationID);

            if(latitude != ''&& longitude != ''){
                Data.append('coordinates', `${latitude}, ${longitude}`);
            }

            if(LocationImage != null){
                Data.append('branchImage', LocationImage);
            }

            let message: string = "Something went wrong, Unable to add";;
            let status: string = "error";

            let response: any;

            if(LocationData.edit){
                // Data.append('id', LocationData.id);
                message = 'Something went wrong, unable to update';
                response = await UpdateBranch(LocationData.id, Data)
            } else {
                response = await AddNewBranch(Data);
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
        let response = await GetBranch({
            id: LocationData.id,
            locationID: LocationData.locationID
        });

        if(response.data?.status == "success"){
            let { branchName, coordinates, image } = response.data.data;
            let latitude = "";
            let longitude = "";

            if(coordinates){
                coordinates = coordinates.split(',');
                latitude = coordinates[0];
                longitude = coordinates[1];
            }

            setFormData({
                branchName: branchName,
                latitude: latitude,
                longitude: longitude,
                branchImageURL: image != null && `${BackendURL}${image}`
            });
        } else {
            CustomToast('Branch not found','error');
            HandleClose();
        }
    }

    const confirmDelete = async (id: any) => {
        let response = await removeImage('Branch', id);

        let message: string = "Unable to delete image";
        let status: string = "error";
        if(response?.data?.status == "success"){
            message = response?.data?.message;
            status = response?.data?.status;
            GetData();
        }

        CustomToast(message, status);
    }

    const deleteImage = async () => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure, you want to delete this branch image?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result:any) => {
            if (result.value) {
                console.log();
                confirmDelete(LocationData.id);
            }
        });
    }

    useEffect(() => {
        if(OpenModal){
            setModal(OpenModal);
            if(LocationData.edit){
                GetData();
                setTitle('Edit Branch');
            } else {
                setTitle('Add Branch');
                setFormData({
                    branchName: '',
                    latitude: MapDetails[0]?.coordinates?.split(',')[0],
                    longitude: MapDetails[0]?.coordinates?.split(',')[1],
                    branchImageURL: ''
                })
            }
            setFormError({});
            setLocationImage(null);
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
                                        <form className="flex items-center gap-8 w-full">
                                            <div className='w-full'>
                                                <label htmlFor="branchName" className='dark:text-white'>Branch Name *</label>
                                                <input
                                                    type="text"
                                                    className='form-input dark:text-white'
                                                    name="branchName"
                                                    onChange={handleChange}
                                                    value={formData.branchName}
                                                />
                                                {formError.branchName && <div className='text-sm text-danger'>{formError.branchName}</div>}
                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor="latitude" className='dark:text-white'>Latitude</label>
                                                <div className='form-input h-9 dark:text-white'>{formData.latitude}</div>
                                                {formError.latitude && <div className='text-sm text-danger'>{formError.latitude}</div>}
                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor="longitude" className='dark:text-white'>Longitude</label>
                                                <div className='form-input h-9 dark:text-white'>{formData.longitude}</div>
                                                {formError.longitude && <div className='text-sm text-danger'>{formError.longitude}</div>}
                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor="branchImage" className='flex gap-2 items-center dark:text-white'>
                                                    Branch Image
                                                    {formData?.branchImageURL && <>
                                                        <Tippy content="View">
                                                            <a href={formData?.branchImageURL} target='_blank' className='text-xs'>
                                                                <IconEye />
                                                            </a>
                                                        </Tippy>
                                                        <Tippy content="Delete">
                                                            <button type="button" className='btn-sm p-0' onClick={deleteImage}>
                                                                <DeleteIcon fill="rgb(231 81 90 / 1)" />
                                                            </button>
                                                        </Tippy>
                                                    </>}
                                                </label>
                                                <input
                                                    type="file"
                                                    className='form-file w-full p-0.5 border dark:text-white'
                                                    name="branchImage"
                                                    onChange={HandleBranchImage}
                                                    accept='image/png, image/jpeg'
                                                />

                                                {formError.branchImage && <div className='text-sm text-danger'>{formError.branchImage}</div>}
                                            </div>
                                        </form>

                                        <div className='mt-5 h-full w-full'>
                                            <Map
                                                markers={[
                                                    {
                                                        coordinates: `${formData.latitude || 22.847115270522174}, ${formData.longitude || 79.65438486875}`,
                                                        branchName: 'New location'
                                                    }
                                                ]}
                                                draggable={true}
                                                getEvent={getEvent}
                                            />
                                        </div>
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

export default AddBranch;
