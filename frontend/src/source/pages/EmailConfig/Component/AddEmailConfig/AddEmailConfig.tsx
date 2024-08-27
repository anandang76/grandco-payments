import React, { Fragment, useEffect, useState } from 'react';
import IconX from '@/components/Icon/IconX';
import { Transition, Dialog } from '@headlessui/react';
import CustomToast from '@/helpers/CustomToast';
import { AddNewEmailConfig, GetEmailConfig, UpdateEmailConfig } from '@/source/service/EmailConfigService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const AddEmailConfig = ({ openModal, setOpenModal, LocationData, OnSuccess }: any) => {

    const [modal, setModal] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('Email Config');
    const [textBodyContent, setTextBodyContent] = useState<string>('');

    const [formData, setFormData] = useState<any>({
        templateID: '',
        subject: '',
        body: ''
    });
    const [formError, setFormError] = useState<any>({});

    const HandleClose = () => {
        setModal(false);
        setOpenModal(false);
    }

    const HandleChange = (e: any) => {
        let { name, value } = e.target;

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value
        }))
    };

    const HandleValid = () => {
        let isValid: boolean = true;
        let error: any = {};

        if(formData.templateID?.trim() == ''){
            error['templateID'] = "RPT ID is required";
            isValid = false;
        }

        if(formData.subject?.trim() == ''){
            error['subject'] = "Subject is required";
            isValid = false;
        }

        if(textBodyContent.trim() == ''){
            error['body'] = "Body is required";
            isValid = false;
        }

        setFormError(error);
        return isValid;
    }

    const HandleAddLocation = async () => {
        if(HandleValid()){
            let message: string = "Something went wrong, unable to add";
            let status: string = "error";

            let response: any;

            if(LocationData.edit){
                message = "Something went wrong, unable to update";
                formData['id'] = LocationData.id;
                response = await UpdateEmailConfig(formData)
            } else {
                response = await AddNewEmailConfig(formData);
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
        let response = await GetEmailConfig({
            id: LocationData.id
        });

        if(response.data.status == "success"){
            let { templateID, subject, body } = response.data.data;

            setFormData({
                templateID: templateID,
                subject: subject,
                body: body
            })
        } else {
            CustomToast('Email Config not found','error');
            HandleClose();
        }
    }

    useEffect(() => {
        if(openModal){
            setModal(openModal);
            setFormError({});
            if(LocationData.edit){
                GetData();
                setTitle('Edit Email Config');
            } else {
                setTitle('Add Email Config');
                setFormData({
                    templateID: '',
                    subject: '',
                    body: ''
                })
            }

        }
    }, [openModal])

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
                                    <h5 className="text-lg font-bold dark:text-white">{title}</h5>
                                    <button type="button" className="text-white-dark hover:text-dark dark:text-white" onClick={HandleClose}>
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-col items-center">
                                        <form className="flex flex-col gap-8 w-full">
                                            <div className='w-full'>
                                                <label htmlFor='templateID' className='dark:text-white'>Template ID *</label>
                                                <input
                                                    type="text"
                                                    className='form-input dark:text-white'
                                                    name="templateID"
                                                    onChange={HandleChange}
                                                    value={formData.templateID}
                                                />
                                                {formError.templateID && <div className='text-sm text-danger'>{formError.templateID}</div>}

                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor='subject' className='dark:text-white'>Subject *</label>
                                                <input
                                                    type="text"
                                                    className='form-input dark:text-white'
                                                    name="subject"
                                                    onChange={HandleChange}
                                                    value={formData.subject}
                                                />
                                                {formError.subject && <div className='text-sm text-danger'>{formError.subject}</div>}
                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor='body' className='dark:text-white'>Body *</label>
                                                {/* <textarea onChange={HandleChange} name="body" className='form-textarea' value={formData.body}>{formData.body}</textarea> */}
                                                <ReactQuill
                                                    theme="snow"
                                                    value={formData.body || ''}
                                                    defaultValue={formData.body || ''}
                                                    onChange={(content, delta, source, editor) => {
                                                        // params.description = content;
                                                        // params.displayDescription = editor.getText();
                                                        // setParams({
                                                        //     ...params,
                                                        // });
                                                        setTextBodyContent(editor.getText());
                                                        setFormData((prevData: any) => ({
                                                            ...prevData,
                                                            body: content
                                                        }))
                                                    }}
                                                    style={{ minHeight: '200px' }}
                                                    className='dark:text-white'
                                                />
                                                {formError.body && <div className='text-sm text-danger'>{formError.body}</div>}
                                            </div>
                                        </form>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-primary" onClick={HandleAddLocation}>
                                            {LocationData.edit ? 'Save' : 'Add'}
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
    );
};

export default AddEmailConfig;
