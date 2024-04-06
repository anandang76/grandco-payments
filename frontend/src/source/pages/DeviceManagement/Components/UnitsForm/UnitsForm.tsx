import CustomToast from '@/helpers/CustomToast';
import IconX from '@/components/Icon/IconX';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { AddUnit, GetUnit, UpdateUnit } from '@/source/service/DeviceManagementService';
import themeConfig from '@/theme.config';

const UnitsForm = ({ openModal, closeModal, DefaultData, OnSuccess }: any) => {
    const BackendURL = themeConfig.apiURL.slice(0, -4);

    const [modal2, setModal2] = useState(false);
    const [Title, setTitle] = useState('Units');

    const [formData, setFormData] = useState<any>({
        unitLabel: '',
        unitMeasure: ''
    });
    const [formError, setFormError] = useState<any>({});

    const HandleClose = () => {
        closeModal(false);
        setModal2(false);
    }

    const handleChange = (e: any) => {
        let { name, value } = e.target;

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value
        }))
    };

    const HandleValid = () => {
        let isValid: boolean = true;
        let error: any = {};

        if(formData.unitLabel){
            if(formData.unitLabel == "" || formData.unitLabel.trim() == ""){
                error['unitLabel'] = "Unit Label is required";
                isValid = false;
            }
        } else {
            error['unitLabel'] = "Unit Label is required";
            isValid = false;
        }

        // if(formData.unitMeasure){
        //     if(formData.unitMeasure == "" || formData.unitMeasure.trim() == ""){
        //         error['unitMeasure'] = "Unit Measure is required";
        //         isValid = false;
        //     }
        // } else {
        //     error['unitMeasure'] = "Unit Measure is required";
        //     isValid = false;
        // }

        setFormError(error);

        return isValid;
    }

    const HandleAddUnit = async () => {
        if(HandleValid()){

            let message: string = "Something went wrong, unable to add";
            let status: string = "error";

            let response: any;
            let data = formData;

            if(DefaultData.edit){
                message = "Something went wrong, unable to update";
                data['id'] = DefaultData.unitID;
                response = await UpdateUnit(data);
            } else {
                response = await AddUnit(formData);
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
        let response = await GetUnit({
            id: DefaultData.unitID
        });

        if(response?.data?.status == "success"){
            let { unitLabel, unitMeasure } = response.data.data;
            setFormData({
                unitLabel: unitLabel,
                unitMeasure: unitMeasure || ''
            });
        } else {
            CustomToast('Unit not found','error');
            HandleClose();
        }
    }

    useEffect(() => {
        if(openModal){
            if(DefaultData.edit){
                GetData();
                setTitle(`Edit Units`);
            } else {
                setFormData({
                    unitLabel: '',
                    unitMeasure: ''
                });
                setTitle(`Add Units`);
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
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold dark:text-white">{Title}</h5>
                                        <button type="button" className="text-white-dark hover:text-dark dark:text-white" onClick={HandleClose}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex flex-col items-center">
                                            <form className="flex flex-col items-center gap-8 w-full">
                                                <div className='w-full'>
                                                    <label htmlFor="unitLabel" className='dark:text-white'>Unit Label</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="unitLabel"
                                                        onChange={handleChange}
                                                        value={formData.unitLabel}
                                                    />
                                                    {formError.unitLabel && <div className='text-sm text-danger'>{formError.unitLabel}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="unitMeasure" className='dark:text-white'>Unit Measure</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="unitMeasure"
                                                        onChange={handleChange}
                                                        value={formData.unitMeasure}
                                                    />
                                                    {formError.unitMeasure && <div className='text-sm text-danger'>{formError.unitMeasure}</div>}
                                                </div>
                                            </form>
                                        </div>
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" className="btn btn-primary" onClick={HandleAddUnit}>
                                                {DefaultData.edit ? 'Edit' : 'Add'}
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
        </>
    )
};

export default UnitsForm;
