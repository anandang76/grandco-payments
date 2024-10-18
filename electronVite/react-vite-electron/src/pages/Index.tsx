import { Tab } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { setPageTitle } from '../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import TransactionForm from './TransactionForm';
import themeConfig from '../theme.config';
import RefundForm from './RefundForm';
import { openPaymentGateway } from './../service/TransactionService';

const Index = () => {
    const dispatch = useDispatch();
    const [isConnected, setIsConnected] = useState(false);
    const [paymentId, setPaymentId] = useState(null);

    useEffect(() => {
        dispatch(setPageTitle('Index'));
    });

    const handleTabChange = (type: string) => {
        console.log(type);
    }

    const handlePaymentGateway = async () => {
        try {
            const result: any = await openPaymentGateway(themeConfig.deviceID);
            if (result.success) {
                console.log('Payment Gateway Opened:', result.data);
                console.log('Device Token:', result.token);
                const paymentIdData = result?.data?.data?.paymentGatewayCommand?.openPaymentGatewayData?.paymentGatewayId;
                setPaymentId(paymentIdData);
                setIsConnected(true);
            } else {
                console.error('Failed to open Payment Gateway:', result.data);
                setIsConnected(true);
            }
        } catch (error: any) {
            console.error('Error:', error);
            setIsConnected(true);
        }
    };

    useEffect(() => {
        handlePaymentGateway();

        // apiCall("/openPaymentGateway",'post',{
        //     deviceID: themeConfig.deviceID,
        //   })
        //   .then((response:any) => {
        //     console.log("openPaymentGateway:", JSON.stringify(response.data));
        //     const paymentIdData = response?.data?.data?.paymentGatewayCommand?.openPaymentGatewayData?.paymentGatewayId;
        //     setPaymentId(paymentIdData);
        //     setIsConnected(true);
        //   })
        //   .catch((error:any) => {
        //     console.error("Error:", error);
        //     setIsConnected(true);
        //   });
        // getApiInfoDetails();
    }, []);

    return (
        <div className='relative w-full mx-auto max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]'>
            <div className='rounded-md p-4 backdrop-blur-lg sm:p-6'>
                <div className='mx-auto mt-5 w-full max-w-[550px] '>
                    <div className="mb-6"><h1 className="text-3xl font-extrabold uppercase !leading-snug text-black md:text-4xl text-center">GrandCo Payment</h1></div>

                    {isConnected ? (
                        <div className="panel" id="border">
                            <Tab.Group>
                                <Tab.List className="flex border-primary border-b-1">
                                    <Tab as={Fragment} >
                                        {({ selected }) => <button onClick={() => handleTabChange('addressbook')}

                                            // className={`btn btn-primary ' ${selected ? ' text-white' : 'bg-[#f6f7f8] text-black border-0'} rounded-none border-b-0 flex-1`}
                                            className={`rounded-none border-b-0 flex-1 ${selected ? '!border-primary text-primary !outline-none dark:!bg-[#191e3a]' : ''}
                                        ' flex items-center justify-center border-b-4 border-transparent bg-[#f6f7f8] p-7 py-3 before:inline-block hover:border-primary hover:text-primary dark:bg-transparent dark:hover:bg-[#191e3a]`}
                                        >
                                            Transaction
                                        </button>}
                                    </Tab>
                                    <Tab as={Fragment}>
                                        {({ selected }) => <button onClick={() => handleTabChange('new_recipient')}
                                            // className={`btn btn-primary ' ${selected ? '  text-white' : 'bg-white text-black border-0'} rounded-none border-b-0 flex-1`}
                                            className={`rounded-none border-b-0 flex-1 ${selected ? '!border-primary text-primary !outline-none dark:bg-[#191e3a]' : ''}
                                        before:inline-block' flex items-center justify-center border-b-4 border-transparent bg-[#f6f7f8] p-7 py-3 hover:border-primary hover:text-primary dark:bg-transparent dark:hover:bg-[#191e3a]`}
                                        >
                                            Refund
                                        </button>}
                                    </Tab>
                                </Tab.List>
                                <Tab.Panels>
                                    <Tab.Panel>
                                        <div className="active pt-1 text-sm mt-4">
                                            <TransactionForm paymentId={paymentId} />
                                        </div>
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        <div className="pt-1 text-sm mt-4">
                                            <RefundForm paymentId={paymentId} />
                                        </div>
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </div>)
                        :
                        <div className="px-6 py-16 text-center font-semibold before:container before:absolute before:left-1/2 before:-translate-x-1/2 before:rounded-full before:aspect-square before:opacity-10 md:py-20">
                            <div className="relative">
                                <div className="-mt-8 font-semibold dark:text-white">
                                    <h2 className="mb-5 text-2xl font-bold text-primary md:text-2xl"><svg className="text-[200px] text-center mx-auto text-red-500" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 22C6.468 21.994 1.996 17.515 2 11.993C2.004 6.472 6.482 1.998 12.003 2C17.525 2.002 22 6.478 22 12c-.003 5.525-4.485 10.002-10.01 10ZM4 12.172A8 8 0 1 0 4 12v.172ZM13 17h-2v-2h2v2Zm0-4h-2V7h2v6Z" /></svg></h2>
                                </div>
                                <div className=" font-semibold dark:text-white">
                                    <h2 className="mb-5 text-2xl font-bold text-red-500 md:text-2xl">Device Not Conntected</h2>
                                </div>
                                <a className="btn btn-primary mx-auto !mt-7 w-max border-0 uppercase shadow-none" href="/">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35A7.96 7.96 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z" /></svg>
                                    &nbsp; Refresh
                                </a>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Index;