import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// import { RefreshIcon } from '../helpers/SVG';
import AnimateHeight from 'react-animate-height';
import { setPageTitle } from '@/store/themeConfigSlice';

const ErrorPage = ({ error }: any) => {
    const dispatch = useDispatch();
    const [currentError, setCurrentError] = useState<any>("");
    const [currentErrorStack, setCurrentErrorStack] = useState<any>("");
    const [active, setActive] = useState<string>('1');

    useEffect(() => {
        dispatch(setPageTitle('Error'));
    });
    const handleRefresh = () => {
        caches.keys().then(function(names) {
            for (let name of names) caches.delete(name);
        });
        window.location.reload();
    };
    const togglePara = (value: string) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    useEffect(() => {
        console.log("++++error++++");
        console.log(error);
        setCurrentError(error?.toString());
        setCurrentErrorStack(error?.stack)
    },[error]);
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-t from-[#093c6eab] to-[#0c3e700d]">
            <div className="text-center p-5">
                {/* <h2 className="text-3xl md:text-5xl mb-10 font-bold">Something went wrong</h2> */}
                <h4 className="mb-5 font-semibold text-xl sm:text-2xl text-primary">Thank you for visiting us.</h4>
                <p className="text-base">
                    We are currently working on making some improvements <br className="sm:block hidden" />
                    to give you better user experience. <br /> <br />
                    Please click refresh button for clear cache.
                </p>
                <div className='flex items-center justify-center mt-5'>
                    <button className="btn btn-primary flex items-start" onClick={handleRefresh}>
                        {/* <ReloadIcon /> */}
                        Refresh
                    </button>
                    <Link to="/" className="btn btn-primary ml-3 flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ltr:mr-1 rtl:ml-1" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13m7 7v-5h4v5zm2-15.586l6 6V15l.001 5H16v-5c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v5H6v-9.586z" /></svg>
                        Home
                    </Link>

                </div>
                <div className='flex items-center justify-center mt-5'>
                    {/* <p className='text-danger'>{currentError && <span>{currentError}</span>}</p> */}
                    {/* <p className=''>{currentErrorStack && <pre>{currentErrorStack}</pre>}</p> */}

                    <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                        <button
                            type="button"
                            className="p-4 w-full flex items-center dark:bg-[#1b2e4b] text-primary"
                            onClick={() => togglePara('1')}
                        >
                            <span>{currentError && currentError}</span>
                            <div className="ltr:ml-auto rtl:mr-auto rotate-180"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>
                        </button>
                        <div>
                            <AnimateHeight duration={300} height={active === '1' ? 'auto' : 0}>
                                <div className="space-y-2 p-4 text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b] text-black">
                                    {currentErrorStack && <pre>{currentErrorStack}</pre>}
                                </div>
                            </AnimateHeight>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
