import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IRootState } from '../../store';
import { toggleTheme, toggleSidebar } from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import IconMenu from '../Icon/IconMenu';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';
import IconMailDot from '../Icon/IconMailDot';
import IconUser from '../Icon/IconUser';
import IconLogout from '../Icon/IconLogout';
import { AlertHeader } from '../../source/pages/Dashboard/Component/Alerts/AlertHeader/AlertHeader';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import DefaultLogo from "../../source/assets/images/Janane_Logo.png";
import ThemeConfig from "../../theme.config";
import { LogOut } from '@/source/service/Auth';
import { ShieldIcon } from '@/source/helpers/Icons';
import moment from 'moment';

const Header = () => {
    const CurrentLogo = localStorage.getItem('logo');
    const userDetails: any = localStorage.getItem('userDetails');
    const AppDetails: any = localStorage.getItem('AppData');

    let CompanyName = "";
    let UserName = "";
    let AppData: any = {};

    if(userDetails){
        CompanyName = JSON.parse(userDetails).companyName;
        UserName = JSON.parse(userDetails).name;
    }

    if(AppDetails){
        AppData = JSON.parse(AppDetails);
    }

    const location = useLocation();
    const navigate = useNavigate();

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const handleLogout = async () => {
        let response: any = await LogOut({
            email: JSON.parse(userDetails).email
        });

        if(response.data.status == "success"){
            sessionStorage.removeItem('accessToken');
            localStorage.removeItem('userDetails');
            localStorage.removeItem('devices');
            localStorage.removeItem('building');
            localStorage.removeItem('branch');
            localStorage.removeItem('facility');
            localStorage.removeItem('floor');
            localStorage.removeItem('sensors');
            localStorage.removeItem('AppData');
            localStorage.removeItem('location');
            localStorage.removeItem('zone');
            localStorage.removeItem('trendsValue');
            sessionStorage.clear();
            navigate('/login');
        }
    }

    const HandleDownloadUserManual = () => {
        let BackendURL = ThemeConfig.apiURL?.split('api/')[0];
        window.open(`${BackendURL}${AppData?.userManual}`, "_blank");
    }

    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [location]);

    return (
        <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
            <div className="shadow-sm">
                <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                        <Link to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-[150px] ltr:-ml-1 rtl:-mr-1 inline" src={CurrentLogo || DefaultLogo} alt="logo" />
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                            onClick={() => {
                                dispatch(toggleSidebar());
                            }}
                        >
                            <IconMenu className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="ltr:mr-2 rtl:ml-2 hidden sm:block">
                        {/* <ul className="flex items-center space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]"> */}
                        <ul className="flex items-center space-x-2 rtl:space-x-reverse dark:text-white">
                            <li>
                                <div className="block p-2 text-lg font-bold">{CompanyName}</div>
                            </li>
                        </ul>
                    </div>
                    <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto"></div>
                        <div className='dark:text-white'>{UserName}</div>
                        <div>
                            {themeConfig.theme === 'light' ? (
                                <button
                                    className={`${
                                        themeConfig.theme === 'light' &&
                                        'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('dark'));
                                    }}
                                >
                                    <IconSun />
                                </button>
                            ) : (
                                ''
                            )}
                            {themeConfig.theme === 'dark' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'dark' &&
                                        'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('light'));
                                    }}
                                >
                                    <IconMoon />
                                </button>
                            )}
                            {themeConfig.theme === 'system' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'system' &&
                                        'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('light'));
                                    }}
                                >
                                    <IconLaptop />
                                </button>
                            )}
                        </div>
                        <div className="dropdown shrink-0">
                            <AlertHeader />
                        </div>
                        <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={<ShieldIcon />}
                            >
                                <ul className="!py-0 text-dark dark:text-white-dark w-[230px] text-xs">
                                    <li className='cursor-default'>
                                        <div className="flex gap-2 py-1">
                                            <span className="px-3 dark:text-gray-500">
                                                <div className="font-semibold text-sm dark:text-white">App version: </div>
                                            </span>
                                            <span>
                                                <div className='dark:text-white-light/90'>{AppData?.versionNumber}</div>
                                            </span>
                                        </div>
                                    </li>
                                    <li className='cursor-default'>
                                        <div className="flex gap-2 py-1">
                                            <span className="px-3 dark:text-gray-500">
                                                <div className="font-semibold text-sm dark:text-white">Release Date: </div>
                                            </span>
                                            <span>
                                                {/* <div>{AppData?.createdAt.split(" ")[0]}</div> */}
                                                <div className='dark:text-white-light/90'>{moment(AppData?.createdAt).format('DD-MM-YYYY')}</div>
                                            </span>
                                        </div>
                                    </li>
                                    <li className='cursor-pointer' onClick={HandleDownloadUserManual}>
                                        <div className="flex gap-2 py-1">
                                            <span className="px-3 dark:text-gray-500">
                                                <div className="font-semibold text-sm dark:text-white">User Manual</div>
                                            </span>
                                            <span>
                                                {/* <div>{AppData?.createdAt.split(" ")[0]}</div> */}
                                                <div className='dark:text-white-light/90'>Click here to view</div>
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                        <div className="dropdown shrink-0 flex">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={
                                    <IconMenuUsers />
                                }
                            >
                                <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                                    {/* <li>
                                        <Link to="javascript:void(0)" className="dark:hover:text-white">
                                            <IconUser className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                            Settings
                                        </Link>
                                    </li> */}
                                    <li className="border-t border-white-light dark:border-white-light/10">
                                        <Link onClick={handleLogout} to={'/login'} className="text-danger !py-3">
                                            <IconLogout className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />
                                            Log out
                                        </Link>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
