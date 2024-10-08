import { FC } from 'react';

interface IconUndoLeftProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconUndoLeft: FC<IconUndoLeftProps> = ({ className, fill = false, duotone = false }) => {
    // return (
    //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    //         <path opacity={duotone ? '0.5' : '1'} d="M6.5 9.50026H14.0385C15.9502 9.50026 17.5 11.05 17.5 12.9618C17.5 14.8736 15.9502 16.4233 14.0385 16.4233H9.5M6.5 9.50026L8.75 7.42334M6.5 9.50026L8.75 11.5772" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    //         <path opacity={duotone ? '0.5' : '1'} d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"/>
    //     </svg>
    // );
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path opacity={duotone ? '0.5' : '1'} d="M6.5 9.50026H14.0385C15.9502 9.50026 17.5 11.05 17.5 12.9618C17.5 14.8736 15.9502 16.4233 14.0385 16.4233H9.5M6.5 9.50026L8.75 7.42334M6.5 9.50026L8.75 11.5772" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path opacity={duotone ? '0.5' : '1'} d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );
};

export default IconUndoLeft;
