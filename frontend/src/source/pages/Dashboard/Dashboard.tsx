import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { setPageTitle } from '../../../store/themeConfigSlice';

import './Dashboard.css';
import DashboardTable from './Component/DashboardTable/DashboardTable';
import Map from './Component/Map/Map';
import Alerts from './Component/Alerts/Alerts';
import themeConfig from '../../../theme.config';

const Dashboard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    });
    const ApiURL = themeConfig.apiURL;
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [loading] = useState(false);
    const [MapDetails, setMapDetails] = useState<Array<any>>([]);
    const [Image, setImage] = useState<any>({})

    return (
        <>
            <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-6 mb-6">
                <DashboardTable setMapDetails={setMapDetails} setImage={setImage} />

                <div className="relative panel h-full !p-0 rounded-xl">
                    <div className="bg-white dark:bg-black rounded-xl">
                        {loading ? (
                            <div className="min-h-[350px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                            </div>
                        ) : <Map markers={MapDetails} />}
                    </div>
                    {Image.showImage && <div className="g-white dark:bg-black rounded-lg absolute top-0 h-full w-full">
                        <div className="bg-white h-full w-full">
                            <img src={`${ApiURL.split('api/')[0]}${Image.image[0]?.image}`} className='w-full h-full' />
                        </div>
                    </div>}
                </div>
            </div>

            <Alerts />
        </>
    );
};

export default Dashboard;
