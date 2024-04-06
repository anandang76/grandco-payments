import IconX from '@/components/Icon/IconX';
import { IRootState } from '@/store';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomToast from '@/helpers/CustomToast';
import { ClearLatchAlert } from '@/source/service/DashboardService';
import { setResetAlert } from '@/store/themeConfigSlice';

const ClearAlert = ({ openModal, setOpenModal, alert }: any) => {
    const dispatch = useDispatch();

    const StoredUser = localStorage.getItem('userDetails');
    const User = StoredUser != null ? JSON.parse(StoredUser) : '';

    const [modal2, setModal2] = useState(false);
    const [Message, setMessage] = useState<string>('');
    const [MessageError, setMessageError] = useState<boolean>(false);
    const [Alert, setAlert] = useState<any>({});

    const HandleClose = () => {
        setModal2(false);
        setOpenModal(false);
    }

    const HandleSubmit = async () => {
        if(Message != '' && Message.trim() != ''){
            setMessageError(false);
            let response = await ClearLatchAlert({
                alertID: Alert.id,
                clearMessage: Message,
                userEmail: User.email
            });

            let message: string = 'Unable to clear alert';
            let status: string = 'error';

            if(response.data?.status == "success"){
                message = 'Alert cleared successfully';
                status = 'success';
                dispatch(setResetAlert(true));
            }

            CustomToast(message, status);
            HandleClose();
        } else {
            setMessageError(true);
        }
    }

    useEffect(() => {
        if(openModal){
            setMessage('');
            setModal2(openModal);
            setAlert(alert)
        }
    }, [openModal])

    return (
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
                                    <h5 className="text-lg font-bold dark:text-white">Clear Alert</h5>
                                    <button type="button" className="text-white-dark hover:text-dark dark:text-white" onClick={HandleClose}>
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-col">
                                        <form className="flex flex-col gap-4">
                                            <div className='w-full'>
                                                <label htmlFor="message" className="dark:text-white">Message *</label>
                                                <textarea
                                                    name="message"
                                                    rows={4}
                                                    className='form-textarea dark:text-white'
                                                    value={Message}
                                                    onInput={(e: any) => setMessage(e.target.value)}
                                                />
                                                {MessageError && <div className='text-red-500'>Message is required</div>}
                                            </div>
                                        </form>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-primary" onClick={HandleSubmit}>
                                            Submit
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
    )
}

export default ClearAlert;
