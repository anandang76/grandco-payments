import { PropsWithChildren, Suspense, useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import App from '../../App';
import { IRootState } from '../../store';
import { toggleSidebar, setLoader } from '../../store/themeConfigSlice';
import Footer from './Footer';
import Header from './Header';
import Setting from './Setting';
import Sidebar from './Sidebar';
import Portals from '../../components/Portals';
import "./DefaultLayout.css";
import IconX from '../Icon/IconX';
import { GetAlertPriorityStatus } from '@/source/helpers/HelperFunctions';
import { useNavigate } from 'react-router-dom';

const DefaultLayout = ({ children }: PropsWithChildren) => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const alerts: any = useSelector((state: IRootState) => state.themeConfig.notifications);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showLoader, setShowLoader] = useState(true);
    const [showTopButton, setShowTopButton] = useState(false);
    const [currentAlerts, setCurrentAlerts] = useState<Array<any>>([]);
    const [alertModal, setAlertModal] = useState(false);
    const [alertDetails, setAlertDetails] = useState<any>({});

    const goToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    const onScrollHandler = () => {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            setShowTopButton(true);
        } else {
            setShowTopButton(false);
        }
    };

    const handleAlertModal = (location: any) => {
        let url = `/device/${location.deviceID}`;
        if(location.msg.toLowerCase().includes('disconnect')){
            url = `/zone/${location.zoneID}`;
        }
        navigate(url);
        setAlertModal(false)
    }

    useEffect(() => {
        setCurrentAlerts(alerts);
        if(currentAlerts.length > 0 && alerts.length > 0){
            const oldLastAlert = currentAlerts[currentAlerts.length -1];
            const newLastAlert: any = alerts[alerts.length -1];
            if(newLastAlert.id > oldLastAlert.id){
                setAlertDetails(newLastAlert);
                setAlertModal(true)
            }
        } else {
            // if(currentAlerts.length == 0 && alerts.length > 0){
            //     const newLastAlert: any = alerts[alerts.length -1];
            //     setAlertDetails(newLastAlert);
            //     setAlertModal(true)
            // }
        }
    }, [alerts])

    useEffect(() => {
        setAlertModal(false);
        setCurrentAlerts(alerts);
        window.addEventListener('scroll', onScrollHandler);

        const screenLoader = document.getElementsByClassName('screen_loader');
        if (screenLoader?.length) {
            screenLoader[0].classList.add('animate__fadeOut');
            setTimeout(() => {
                dispatch(setLoader(false));
                // setShowLoader(false);
            }, 200);
        }

        return () => {
            window.removeEventListener('onscroll', onScrollHandler);
        };
    }, []);

    return (
        <App>
            {/* BEGIN MAIN CONTAINER */}
            <div className="relative">
                {/* sidebar menu overlay */}
                <div className={`${(!themeConfig.sidebar && 'hidden') || ''} fixed inset-0 bg-[black]/60 z-50 lg:hidden`} onClick={() => dispatch(toggleSidebar())}></div>
                {/* screen loader */}
                {themeConfig.loader && (
                    // <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <div className="screen_loader fixed inset-0 bg-[#f3f3f3] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                        <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                            <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                                <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
                            </path>
                            <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                                <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                            </path>
                        </svg>
                    </div>
                )}
                <div className="fixed bottom-6 ltr:right-6 rtl:left-6 z-50">
                    {showTopButton && (
                        // <button type="button" className="btn btn-outline-primary rounded-full p-2 animate-pulse bg-[#fafafa] dark:bg-[#060818] dark:hover:bg-primary" onClick={goToTop}>
                        <button type="button" className="btn btn-outline-primary rounded-full p-2 animate-pulse bg-[#f3f3f3] dark:bg-[#060818] dark:hover:bg-primary" onClick={goToTop}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l4-4m0 0l4 4m-4-4v18" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* BEGIN APP SETTING LAUNCHER */}
                {/* <Setting /> */}
                {/* END APP SETTING LAUNCHER */}

                <div className={`${themeConfig.navbar} main-container text-black dark:text-white-dark min-h-screen`}>
                    {/* BEGIN SIDEBAR */}
                    <Sidebar />
                    {/* END SIDEBAR */}

                    <div className="main-content flex flex-col min-h-screen">
                        {/* BEGIN TOP NAVBAR */}
                        <Header />
                        {/* END TOP NAVBAR */}

                        {/* BEGIN CONTENT AREA */}
                        <Suspense>
                            <div className={`${themeConfig.animation} p-6 animate__animated`}>{children}</div>
                        </Suspense>
                        {/* END CONTENT AREA */}

                        {/* BEGIN FOOTER */}
                        {/* <Footer /> */}
                        {/* END FOOTER */}
                        <Portals />
                    </div>
                </div>
                {alertModal && <Transition appear show={alertModal} as={Fragment}>
                    <Dialog as="div" open={alertModal} onClose={() => setAlertModal(false)}>
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
                        <div id="zoomIn_up_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-center justify-center px-4">
                                <Dialog.Panel className="panel animate__animated animate__zoomInUp my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className={`flex items-center justify-between ${GetAlertPriorityStatus(alertDetails.alertType).color == "#545353" ? "bg-[#9CA3AF] dark:bg-[#9CA3AF]" : ""} bg-[${GetAlertPriorityStatus(alertDetails.alertType).color}] px-5 py-3 dark:bg-[${GetAlertPriorityStatus(alertDetails.alertType).color}] text-white`}>
                                        <h5 className="text-lg font-bold">{alertDetails.alertType}</h5>
                                        <button onClick={() => setAlertModal(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX className={'text-white'} />
                                        </button>
                                    </div>
                                    <div className={`p-5 border border-t-0 border-[${GetAlertPriorityStatus(alertDetails.alertType).color}]`}>
                                        <p>Device Name: {alertDetails.deviceName}</p>
                                        <p>Message: {alertDetails.msg}</p>
                                        {!alertDetails.msg.toLowerCase().includes("disconnected") && <p>Sensor Tag: {alertDetails.sensorTag}</p>}
                                        <div className="mt-8 flex items-center justify-end">
                                            <button onClick={() => setAlertModal(false)} type="button" className="btn btn-outline-danger">
                                                Close
                                            </button>
                                            <button onClick={() => handleAlertModal(alertDetails)} type="button" className="btn btn-primary ltr:ml-3">
                                                Take me there
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </div>
                        </div>
                    </Dialog>
                </Transition>}
            </div>
        </App>
    );
};

export default DefaultLayout;
