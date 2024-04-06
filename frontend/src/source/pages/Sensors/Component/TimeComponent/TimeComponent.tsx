import moment from "moment";
import React, { useState, useEffect } from "react";

const TimeComponent = () => {

    const [CurrentDate, setCurrentDate] = useState<string>(moment().format('DD/MM/YYYY, h:mm:ss A'));

    useEffect(() => {
        const DateInterval = setInterval(() => {
            setCurrentDate(moment().format('DD/MM/YYYY, h:mm:ss A'));
        }, 1000);

        return () => {
            clearInterval(DateInterval);
        };
    }, [])

    return (
        <div className="w-full flex flex-col justify-between py-5">
            <div className="text-xl dark:text-white">{CurrentDate.split(', ')[1]}</div>
            <div className="text-xl dark:text-white">{CurrentDate.split(', ')[0]}</div>
        </div>
    )

}

export default TimeComponent;
