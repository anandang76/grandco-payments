import React, { useState } from 'react'
// import { apiCall } from './../helper/client.jsx'; 

export default function RefundForm({paymentId}) {

    const [formData, setFormData] = useState({
        amount: "10",
        isManualEntry: false,
      });
    const [cardType, setCardType] = useState('present');
    const [formError, setFormError] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeCardType = (event:any) => {
        console.log(event.target.value)
        setCardType(event.target.value);
        if(event.target.value == 'present'){
          setFormData({
            ...formData,
            isManualEntry: false,
          });
        }else{
          setFormData({
            ...formData,
            isManualEntry: true,
          });
        }
    };

    const handleChange = (e:any) => {
        const { name, value, checked } = e.target;
        const re = /^[1-9]\d*\.?\d*$/;
        if (name === "amount" || name === "refundAmount") {
          if (value === "" || re.test(value)) {
            setFormData({
              ...formData,
              [name]: value,
            });
          }
        } else {
          if (name === "cardEntry" || name === "refund") {
            setFormData({
              ...formData,
              [name]: checked,
            });
          } else {
            setFormData({
              ...formData,
              [name]: value,
            });
          }
        }
    };

    const isValid = () => {
        let valid = true;
        var error:any = {};
        if(formData?.amount == "" ){
            error.amount = 'Please enter amount';
            valid = false;
        }
        setFormError({...error})
        return valid;
    }

    const onSubmit = async () => {
        setIsLoading(true);
        if(!isValid()){
            setIsLoading(false);
            return false;
        }
        let data: any = formData;
        console.log(data);
    }

    // const handleSubmit1 = (e) => {
    //     e.preventDefault();
    //     const cardReaderInfo = localStorage.getItem('cardReaderInfo') ? JSON.parse(localStorage.getItem('cardReaderInfo')) : {};
    //     if (!formData.refund) {
    //       apiCall("/startPaymentTransaction", 'post',{
    //           amount: formData.amount,
    //           isManualEntry: formData.cardEntry,
    //           cardType: formData.cardType,
    //           paymentId,
    //           cardReaderInfo
    //         })
    //         .then((response) => {
    //           console.log(
    //             "startPaymentTransaction:",
    //             JSON.stringify(response.data)
    //           );
    //           const chanIdData =
    //             response?.data?.data?.paymentGatewayCommand?.chanId;
    //           setChanId(chanIdData);
    //         })
    //         .catch((error) => {
    //           console.error("Error:", error);
    //         });
    //     } else {
    //       apiCall("/linkedRefund", 'post',{
    //           refundAmount: formData.refundAmount,
    //           paymentGatewayId: paymentId,
    //           transId: formData.transId,
    //         })
    //         .then((response) => {
    //           console.log("linkedRefund:", JSON.stringify(response.data));
    //           const refundChanIdData =
    //             response?.data?.data?.paymentGatewayCommand?.chanId;
    //           axios
    //             .post("/getPaymentTransactionStatus", {
    //               paymentGatewayId: paymentId,
    //               chanId: refundChanIdData,
    //             })
    //             .then((response) => {
    //               const status =
    //                 response?.data?.data?.paymentGatewayCommand?.eventQueue;
    //               const result =
    //                 response?.data?.data?.paymentGatewayCommand
    //                   ?.paymentTransactionData?.result;
    //               const completed =
    //                 response?.data?.data?.paymentGatewayCommand?.completed;
    //               if (status?.lenght > 1) {
    //                 setStatus(status?.[status.lenght - 1]?.statusDetails);
    //               } else {
    //                 setStatus(status?.[0]?.statusDetails);
    //               }
    
    //               setChanId("");
    //               setStatus(result);
    
    //               console.log(
    //                 "getPaymentTransactionStatus:",
    //                 JSON.stringify(response.data)
    //               );
    //             })
    //             .catch((error) => {
    //               console.error("Error:", error);
    //             });
    //         })
    //         .catch((error) => {
    //           console.error("Error:", error);
    //         });
    //     }
    
    //     console.log(formData);
    //   };

    return (
        <div>
            <form className="space-y-5">
                <div>
                    <label htmlFor="gridAddress1">Transaction ID</label>
                    <input type="text" placeholder="Transaction ID" className="form-input" value={paymentId} />
                </div>

                <div>
                    <label htmlFor="gridAddress1">Refund Amount</label>
                    <div className="flex">
                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                            $
                        </div>
                        <input type="number" 
                        name="amount"
                        placeholder="Enter amount" 
                        value={formData.amount}
                        onChange={handleChange}
                        className="form-input ltr:rounded-l-none rtl:rounded-r-none flex-1" />
                    </div>       
                    {formError?.amount &&<span className="text-danger text-[15px] inline-block mt-1">{formError?.amount}</span>}
                </div>
              
                <div className="grid">
                    <button type="button" onClick={onSubmit} className="btn btn-primary btn-block !mt-2">
                        {isLoading && <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>}
                        Pay Now
                    </button>
                </div>
            </form>
        </div>
    )
}
