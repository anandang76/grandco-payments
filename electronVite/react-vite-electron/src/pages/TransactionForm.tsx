import React, { useState } from 'react'
// import { apiCall } from './../helper/client.jsx';
import axios from 'axios';

export default function TransactionForm({ paymentId }:any) {

  const [formData, setFormData] = useState({
    amount: "10",
    isManualEntry: false,
  });
  const [cardType, setCardType] = useState('present');
  const [formError, setFormError] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chanId, setChanId] = useState(null);
  const [status, setStatus] = useState(null);

  const handleChangeCardType = (event: any) => {
    console.log(event.target.value)
    setCardType(event.target.value);
    if (event.target.value == 'present') {
      setFormData({
        ...formData,
        isManualEntry: false,
      });
    } else {
      setFormData({
        ...formData,
        isManualEntry: true,
      });
    }
  };

  const handleChange = (e: any) => {
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
    var error: any = {};
    if (formData?.amount == "") {
      error.amount = 'Please enter amount';
      valid = false;
    }
    setFormError({ ...error })
    return valid;
  }

  const onSubmit = async () => {
    setIsLoading(true);
    if (!isValid()) {
      setIsLoading(false);
      return false;
    }
    const cardReaderInfo = localStorage.getItem('cardReaderInfo') ? JSON.parse(localStorage.getItem('cardReaderInfo')) : {};
    // apiCall("/startPaymentTransaction", 'post', {
    //   amount: formData.amount,
    //   isManualEntry: formData.isManualEntry,
    //   paymentId: paymentId,
    //   cardReaderInfo: cardReaderInfo
    // })
    // .then((response: any) => {
    //   console.log(
    //     "startPaymentTransaction:",
    //     JSON.stringify(response.data)
    //   );
    //   const chanIdData = response?.data?.data?.paymentGatewayCommand?.chanId;
    //   setChanId(chanIdData);
    // })
    // .catch((error: any) => {
    //   console.error("Error:", error);
    //   setChanId("Test");
    // });
  }


  const handlePaymentTransactionStatus = (e: any) => {
    // apiCall("/getPaymentTransactionStatus", 'post', {
    //   paymentGatewayId: paymentId,
    //   chanId: chanId,
    // })
    //   .then((response: any) => {
    //     const status = response?.data?.data?.paymentGatewayCommand?.eventQueue;
    //     const result =
    //       response?.data?.data?.paymentGatewayCommand?.paymentTransactionData
    //         ?.result;
    //     const completed =
    //       response?.data?.data?.paymentGatewayCommand?.completed;
    //     if (status?.lenght > 1) {
    //       setStatus(status?.[status.lenght - 1]?.statusDetails);
    //     } else {
    //       setStatus(status?.[0]?.statusDetails);
    //     }
    //     if (result === "APPROVED") {
    //       axios
    //         .post("/printReceipt", {
    //           paymentGatewayId: paymentId,
    //         })
    //         .then((response: any) => {
    //           console.log("printReceipt:", JSON.stringify(response.data));
    //           const responseData = response?.data?.data?.paymentGatewayCommand;
    //           console.log(responseData);
    //         })
    //         .catch((error) => {
    //           console.error("Error:", error);
    //         });
    //       setChanId(null);
    //       setStatus(result);
    //     } else {
    //       if (completed) {
    //         setChanId(null);
    //         setStatus(result);
    //       }
    //     }
    //     console.log(
    //       "getPaymentTransactionStatus:",
    //       JSON.stringify(response.data)
    //     );
    //   })
    //   .catch((error: any) => {
    //     console.error("Error:", error);
    //     setChanId("Test");
    //     setStatus("APPROVED");
    //   });
  };

  const handleCancelPaymentTransaction = (e: any) => {
    // apiCall("/cancelPaymentTransaction", 'post', {
    //   paymentGatewayId: paymentId,
    //   chanId: chanId,
    // })
    //   .then((response: any) => {
    //     const status = response?.data?.data?.paymentGatewayCommand?.eventQueue;
    //     if (status?.lenght > 1) {
    //       setStatus(status?.[status.lenght - 1]?.statusDetails);
    //     } else {
    //       setStatus(status?.[0]?.statusDetails);
    //     }
    //     setChanId(null);
    //     console.log(
    //       "getCancelPaymentTransaction:",
    //       JSON.stringify(response.data)
    //     );
    //   })
    //   .catch((error: any) => {
    //     console.error("Error:", error);
    //   });
  };

  const handleNewPayment = () => {
    setStatus(null);
    setChanId(null);
    setIsLoading(false);
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
        {!status ?
          <div>
            <div>
              <label htmlFor="gridAddress1">Payment ID</label>
              <input type="text" readOnly placeholder="Payment ID" className="form-input" value={paymentId} />
            </div>

            {!chanId ?
              <div>
                <div>
                  <label htmlFor="gridAddress1">Amount</label>
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
                  {formError?.amount && <span className="text-danger text-[15px] inline-block mt-1">{formError?.amount}</span>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <div className="flex items-center cursor-pointer mt-1">
                      <label className="inline-flex mt-1 cursor-pointer">
                        <input type="radio"
                          value="present"
                          name="card_type"
                          className="form-radio"
                          checked={cardType === 'present'}
                          onChange={handleChangeCardType}
                        />
                        <span className="text-white-dark1">Card present</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center cursor-pointer mt-1">
                      <label className="inline-flex mt-1 cursor-pointer">
                        <input type="radio"
                          name="card_type"
                          value="not_present"
                          className="form-radio"
                          checked={cardType === 'not_present'}
                          onChange={handleChangeCardType}
                        />
                        <span className="text-white-dark1">Card not present</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid mt-3">
                  <button type="button" onClick={onSubmit} className="btn btn-primary btn-block !mt-2">
                    {isLoading && <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>}
                    Pay Now
                  </button>
                </div>
              </div>
              :
              <div>
                <div>
                  <strong className='text-warning'>Transaction being processed &nbsp;
                    <svg className="inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><circle cx="4" cy="12" r="3" fill="currentColor"><animate id="svgSpinners3DotsBounce0" attributeName="cy" begin="0;svgSpinners3DotsBounce1.end+0.25s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12" /></circle><circle cx="12" cy="12" r="3" fill="currentColor"><animate attributeName="cy" begin="svgSpinners3DotsBounce0.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12" /></circle><circle cx="20" cy="12" r="3" fill="currentColor"><animate id="svgSpinners3DotsBounce1" attributeName="cy" begin="svgSpinners3DotsBounce0.begin+0.2s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12" /></circle></svg>
                  </strong>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button type="button" onClick={handlePaymentTransactionStatus} className="btn btn-primary">Print</button>
                  <button type="button" className="btn btn-primary" onClick={handleCancelPaymentTransaction}
                  >Cancel</button>
                </div>

              </div>
            }
          </div>
          :
          <div className="p-6 text-center font-semibold">

            {status == "APPROVED" ?

              <div className="relative">
                <div className="-mt-8 font-semibold dark:text-white">
                  <h2 className="mb-3 text-2xl font-bold text-primary md:text-2xl">

                    <svg className="text-[200px] text-center mx-auto text-success" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z" /></svg>

                  </h2>
                </div>
                <div className=" font-semibold dark:text-white">
                  <h2 className="mb-2 text-2xl font-bold text-success md:text-2xl">Transaction proceed successfully!!!</h2>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button type="button" onClick={handleNewPayment} className="btn btn-primary">New Payment</button>
                  <button type="button" className="btn btn-primary" onClick={handleNewPayment}
                  >Close</button>
                </div>
              </div>

              :

              <div className="relative">
                <div className="-mt-8 font-semibold dark:text-white">
                  <h2 className="mb-3 text-2xl font-bold text-primary md:text-2xl"><svg className="text-[200px] text-center mx-auto text-red-500" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 22C6.468 21.994 1.996 17.515 2 11.993C2.004 6.472 6.482 1.998 12.003 2C17.525 2.002 22 6.478 22 12c-.003 5.525-4.485 10.002-10.01 10ZM4 12.172A8 8 0 1 0 4 12v.172ZM13 17h-2v-2h2v2Zm0-4h-2V7h2v6Z" /></svg></h2>
                </div>
                <div className=" font-semibold dark:text-white">
                  <h2 className="mb-2 text-2xl font-bold text-red-500 md:text-2xl">Transaction is failed</h2>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button type="button" onClick={handleNewPayment} className="btn btn-primary">New Payment</button>
                  <button type="button" className="btn btn-primary" onClick={handleNewPayment}
                  >Close</button>
                </div>
              </div>
            }


          </div>
        }
      </form>
    </div>
  )
}
