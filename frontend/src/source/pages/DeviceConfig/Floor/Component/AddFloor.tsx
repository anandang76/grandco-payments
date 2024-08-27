import React, { Fragment, useEffect, useState } from 'react';
import IconX from '@/components/Icon/IconX';
import { Transition, Dialog } from '@headlessui/react';
import CustomToast from '@/helpers/CustomToast';
import { GetFloor, UpdateFloor, AddNewFloor, removeImage } from '@/source/service/DeviceConfigService';
import themeConfig from '@/theme.config';
import Tippy from '@tippyjs/react';
import { DeleteIcon } from '@/source/helpers/Icons';
import Swal from "sweetalert2";

const AddFloor = ({ OpenModal, setOpenModal, LocationData, OnSuccess }: any) => {
    const BackendURL = themeConfig.apiURL.slice(0, -4);

    const [modal, setModal] = useState<boolean>(false);
    const [Title, setTitle] = useState<string>('Location');

    const [formData, setFormData] = useState<any>({
        floorName: '',
        floorNumber: '',
        floorImageURL: ''
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
                ['floorImageURL']: URL.createObjectURL(file)
            }))

        } else {
            CustomToast('Invalid file type', 'error');
            setLocationImage(null);
        }
    }

    const HandleValid = () => {
        let isValid: boolean = true;
        let error: any = {};

        if(formData.floorName){
            if(formData.floorName == "" || formData.floorName.trim() == ""){
                error['floorName'] = "Floor Name is required";
                isValid = false;
            }
        } else {
            error['floorName'] = "Floor Name is required";
            isValid = false;
        }

        setFormError(error);

        return isValid;
    }

    const HandleAddLocation = async () => {
        if(HandleValid()){
            let { floorNumber } = formData;

            const Data = new FormData();

            Data.append('floorName', formData.floorName);
            Data.append('locationID', LocationData.locationID);
            Data.append('branchID', LocationData.branchID);
            Data.append('facilityID', LocationData.facilityID);
            Data.append('buildingID', LocationData.buildingID);

            if(floorNumber != ''){
                Data.append('coordinates', floorNumber);
            }

            if(LocationImage != null){
                Data.append('floorImage', LocationImage);
            }

            let message: string = "Something went wrong, unable to add";
            let status: string = "error";

            let response: any;

            if(LocationData.edit){
                message = "Something went wrong, unable to update";
                // Data.append('id', LocationData.id);
                response = await UpdateFloor(LocationData.id, Data)
            } else {
                response = await AddNewFloor(Data);
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
        let response = await GetFloor({
            id: LocationData.id,
            locationID: LocationData.locationID,
            branchID: LocationData.branchID,
            facilityID: LocationData.facilityID,
            buildingID: LocationData.buildingID
        });

        if(response.data?.status == "success"){
            let { floorName, coordinates, image } = response.data.data;

            setFormData({
                floorName: floorName,
                floorNumber: coordinates,
                floorImageURL: image != null && `${BackendURL}${image}`
            });
        } else {
            CustomToast('Floor not found','error');
            HandleClose();
        }
    }

    const confirmDelete = async (id: any) => {
        let response = await removeImage('Floor', id);

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
            title: 'Are you sure, you want to delete this floor image?',
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
                setTitle('Edit Floor');
            } else {
                setTitle('Add Floor');
                setFormData({
                    floorName: '',
                    floorNumber: '',
                    floorImageURL: ''
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
                                                <label htmlFor="floorName" className='dark:text-white'>Floor Name *</label>
                                                <input
                                                    type="text"
                                                    className='form-input dark:text-white'
                                                    name="floorName"
                                                    onChange={handleChange}
                                                    value={formData.floorName}
                                                />
                                                {formError.floorName && <div className='text-sm text-danger'>{formError.floorName}</div>}
                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor="floorNumber" className='dark:text-white'>Floor Number</label>
                                                <input
                                                    type="text"
                                                    className='form-input dark:text-white'
                                                    name="floorNumber"
                                                    onChange={handleChange}
                                                    value={formData.floorNumber}
                                                />
                                                {formError.floorNumber && <div className='text-sm text-danger'>{formError.floorNumber}</div>}
                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor="facilityImage" className='flex gap-2 items-center dark:text-white'>
                                                    Floor Image
                                                    {(formData?.floorImageURL != "" && formData?.floorImageURL != null) && <Tippy content="Delete">
                                                        <button type="button" className='btn-sm p-0' onClick={deleteImage}>
                                                            <DeleteIcon fill="rgb(231 81 90 / 1)" />
                                                        </button>
                                                    </Tippy>}
                                                </label>
                                                <input
                                                    type="file"
                                                    className='form-file w-full p-0.5 border dark:text-white'
                                                    name="buildingImage"
                                                    onChange={HandleFloorImage}
                                                    accept='image/png, image/jpeg'
                                                />
                                                {formError.floorImage && <div className='text-sm text-danger'>{formError.floorImage}</div>}
                                            </div>
                                        </form>

                                        {(formData?.floorImageURL != "" && formData?.floorImageURL != null) && <div className='mt-5 h-full w-full'>
                                            <img src={formData?.floorImageURL} />
                                        </div>}
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

export default AddFloor;
