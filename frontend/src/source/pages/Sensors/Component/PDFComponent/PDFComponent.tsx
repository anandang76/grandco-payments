import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import CustomToast from '@/helpers/CustomToast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PDFComponent = ({ openModal, setOpenModal, defaultdata, locationsData, limitsData, rangeInterval, segretionInterval, imageData, trendSensorData }: any) => {

    const [pdf, setPDF] = useState<any>(null);

    const [modal2, setModal2] = useState(false);

    const handleClose = () => {
        setModal2(false);
        setOpenModal(false);
    }

    const generatePdf = () => {
        const doc = new jsPDF('landscape',);

        const TrendsHeading = `Trends of Sensor (${defaultdata?.sensorTag})`;
        const pageWidthMissing = doc.internal.pageSize.getWidth();
        const textWidthMissing = doc.getStringUnitWidth(TrendsHeading) * (doc.getFontSize() / doc.internal.scaleFactor);
        const xCoordinateMissing = (pageWidthMissing - textWidthMissing) / 2;

        doc.text(TrendsHeading, xCoordinateMissing, 10);

        const LocationsHeading = ['Location', 'Branch', 'Facility', 'Building', 'Floor', 'Zone', 'Device', 'Sensor'];
        const totalLocationsHeading: Array<any> = [];
        totalLocationsHeading.push([locationsData?.locationName, locationsData?.branchName, locationsData?.facilityName, locationsData?.buildingName, locationsData?.floorName, locationsData?.zoneName, locationsData?.deviceName, locationsData?.sensor]);
        const headerTotalData = LocationsHeading.map((header, index) => [header, totalLocationsHeading[0][index]]);
        autoTable(doc, {
            startY: 25,
            theme: 'grid',
            body: headerTotalData,
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 35 },
            },
            tableWidth: 'auto',
            margin: { left: 30 },
        });

        const LimitsHeading = ['Critical Maximum', 'Critical Minimum', 'Critical Alert ','Warning Maximum', 'Warning Minimum','Warning Alert', 'Stel', 'Twa'];
        const totalLimitsHeading: Array<any> = [];
        totalLimitsHeading.push([limitsData?.cMax, limitsData?.cMin, limitsData?.cAlert, limitsData?.wMax, limitsData?.wMin, limitsData?.wAlert, limitsData?.stel, limitsData?.twa]);
        const headerLimitedData = LimitsHeading.map((header, index) => [header, totalLimitsHeading[0][index]]);
        autoTable(doc, {
            startY: 25,
            theme: 'grid',
            body: headerLimitedData,
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 35 },
            },
            tableWidth: 'auto',
            margin: { left: 115 },
        });

        const unitsHeading = ['Unit'];
        const totalunitsHeading: Array<any> = [];
        totalunitsHeading.push([limitsData?.unit]);
        const headerUnitData = unitsHeading.map((header, index) => [header, totalunitsHeading[0][index]]);
        autoTable(doc, {
            startY: 45,
            theme: 'grid',
            body: headerUnitData,
            columnStyles: {
                0: { cellWidth: 45 },
                1: { cellWidth: 45 },
            },
            tableWidth: 'auto',
            margin: { left: 200 },
        });

        const rangeIntervalHeading = [rangeInterval == "Custom Date" ? "Custom Date" : "Last", 'Grouping Interval'];
        const totalrangeIntervalHeading = [[`${rangeInterval}`, `${segretionInterval}`]];
        const headerIntervalData = rangeIntervalHeading.map((heading, index) => [heading, totalrangeIntervalHeading[0][index]]);
        autoTable(doc, {
            startY: 25,
            theme: 'grid',
            body: headerIntervalData,
            columnStyles: {
                0: { cellWidth: 45 },
                1: { cellWidth: 45 },
            },
            tableWidth: 'auto',
            margin: { left: 200 },
        });

        if (imageData) {
            doc.addImage(imageData, 'JPEG', 20, 100, 250, 100);
        }

        doc.addPage();

        const newSensorData: Array<any> = [];
        const sensorDataHeaderCells = ['SL NO', 'Date and Time', 'Value', 'Status'];
        trendSensorData.forEach((data: any, index: any, array: any) => {
            const serialNumber = index + 1;
            newSensorData.push([serialNumber, data?.collectedTime || 'NULL', data?.avgScaledVal || "NULL", data?.info || 'Null']);
        });

        autoTable(doc, {
            theme: 'grid',
            startY: 20,
            // startX: 50,
            head: [sensorDataHeaderCells], // Pass the header cells as an array of arrays
            body: newSensorData,
            headStyles: {
                fillColor: [25, 118, 210],
                textColor: [255, 255, 255],
                lineWidth: 0.2,
                lineColor: 'gray',
                halign: 'center',
                valign: 'middle'
            },
            columnStyles: {
                0: { cellWidth: 25, halign: 'center', valign: 'middle' }, // Width for SL NO column
                1: { cellWidth: 55, halign: 'center', valign: 'middle' },
                2: { cellWidth: 55, halign: 'center', valign: 'middle' },
                3: { cellWidth: 55, halign: 'center', valign: 'middle' },
            },
            // Center the table on the page horizontally
            margin: {
                horizontal: 50
            },
            styles: {
                halign: 'center',
                valign: 'middle',
            }
        })


        const pdfData = doc.output('blob');
        setPDF(URL.createObjectURL(pdfData));
    }

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdf;
        link.download = `Trends of ${defaultdata?.sensorTag}.pdf`; // Set the desired filename here
        link.click();
    }

    useEffect(() => {
        if(openModal){
            generatePdf();
        }
        setModal2(openModal);
    }, [openModal])

    return (
        <Transition appear show={modal2} as={Fragment}>
            <Dialog as="div" open={modal2} onClose={handleClose}>
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
                                    <h5 className="text-lg font-bold">Trends of Sensors {defaultdata?.sensorTag} </h5>
                                </div>
                                <div className="p-5">
                                    <div>
                                        <iframe
                                            title="PDF Viewer"
                                            src={pdf}
                                            width="100%"
                                            height="500px"
                                            allowFullScreen
                                        />
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-primary" onClick={handleDownload}>
                                            Download
                                        </button>
                                        <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={handleClose}>
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

export default PDFComponent;
