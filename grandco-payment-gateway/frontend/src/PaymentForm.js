import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import config from './config';
import { apiCall } from './helper/client'; 
const containerStyle = {
  width: "400px",
};

function PaymentForm() {
  const [formData, setFormData] = useState({
    amount: "",
    cardEntry: false,
    transId: "",
    refundAmount: "",
    refund: false,
  });
  const [paymentId, setPaymentId] = useState(null);
  const [chanId, setChanId] = useState(null);
  const [status, setStatus] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const [selectedOption, setSelectedOption] = useState('option1');

  const handleChangeOption = (event) => {
    console.log(event.target.value)
    setSelectedOption(event.target.value);
    if(event.target.value == 'option1'){
      setFormData({
        ...formData,
        cardEntry: true,
      });
    }else{
      setFormData({
        ...formData,
        cardEntry: false,
      });
    }
  };

  const handleChange = (e) => {
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


  const getApiInfoDetails = () => {
    
    apiCall("/getApiInfo")
    .then((response) => {
      console.log("getApiInfo:");
      console.log(response.data);
      if(response.data.success){
        localStorage.setItem('cardReaderInfo', JSON.stringify(response.data?.data?.cardReaderInfo))
        setIsConnected(true)
      }else{
        setIsConnected(false)
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }

  useEffect(() => {
    apiCall("/openPaymentGateway",'post',{
        deviceID: config.deviceID,
      })
      .then((response) => {
        console.log("openPaymentGateway:", JSON.stringify(response.data));
        const paymentIdData =
          response?.data?.data?.paymentGatewayCommand?.openPaymentGatewayData
            ?.paymentGatewayId;

        setPaymentId(paymentIdData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    getApiInfoDetails();
  }, []);

  useEffect(() => {
    if (chanId === "") {
      setFormData({
        amount: "",
      });
    }
  }, [chanId]);

  useEffect(() => {
    setFormData({
      amount: "",
      cardEntry: false,
      transId: "",
      refundAmount: "",
      refund: formData.refund,
    });
  }, [formData.refund]);

  useEffect(() => {
    setTimeout(() => {
      setStatus("");
    }, 3000);
  }, [status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cardReaderInfo = localStorage.getItem('cardReaderInfo') ? JSON.parse(localStorage.getItem('cardReaderInfo')) : {};
    if (!formData.refund) {
      apiCall("/startPaymentTransaction", 'post',{
          amount: formData.amount,
          isManualEntry: formData.cardEntry,
          cardType: formData.cardType,
          paymentId,
          cardReaderInfo
        })
        .then((response) => {
          console.log(
            "startPaymentTransaction:",
            JSON.stringify(response.data)
          );
          const chanIdData =
            response?.data?.data?.paymentGatewayCommand?.chanId;
          setChanId(chanIdData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      apiCall("/linkedRefund", 'post',{
          refundAmount: formData.refundAmount,
          paymentGatewayId: paymentId,
          transId: formData.transId,
        })
        .then((response) => {
          console.log("linkedRefund:", JSON.stringify(response.data));
          const refundChanIdData =
            response?.data?.data?.paymentGatewayCommand?.chanId;
          axios
            .post("/getPaymentTransactionStatus", {
              paymentGatewayId: paymentId,
              chanId: refundChanIdData,
            })
            .then((response) => {
              const status =
                response?.data?.data?.paymentGatewayCommand?.eventQueue;
              const result =
                response?.data?.data?.paymentGatewayCommand
                  ?.paymentTransactionData?.result;
              const completed =
                response?.data?.data?.paymentGatewayCommand?.completed;
              if (status?.lenght > 1) {
                setStatus(status?.[status.lenght - 1]?.statusDetails);
              } else {
                setStatus(status?.[0]?.statusDetails);
              }

              setChanId("");
              setStatus(result);

              console.log(
                "getPaymentTransactionStatus:",
                JSON.stringify(response.data)
              );
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    console.log(formData);
  };

  const handlePaymentTransactionStatus = (e) => {
    apiCall("/getPaymentTransactionStatus",'post', {
        paymentGatewayId: paymentId,
        chanId: chanId,
      })
      .then((response) => {
        const status = response?.data?.data?.paymentGatewayCommand?.eventQueue;
        const result =
          response?.data?.data?.paymentGatewayCommand?.paymentTransactionData
            ?.result;
        const completed =
          response?.data?.data?.paymentGatewayCommand?.completed;
        if (status?.lenght > 1) {
          setStatus(status?.[status.lenght - 1]?.statusDetails);
        } else {
          setStatus(status?.[0]?.statusDetails);
        }
        if (result === "APPROVED") {
          axios
            .post("/printReceipt", {
              paymentGatewayId: paymentId,
            })
            .then((response) => {
              console.log("printReceipt:", JSON.stringify(response.data));
              const responseData = response?.data?.data?.paymentGatewayCommand;
              console.log(responseData);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
          setChanId("");
          setStatus(result);
        } else {
          if (completed) {
            setChanId("");
            setStatus(result);
          }
        }
        console.log(
          "getPaymentTransactionStatus:",
          JSON.stringify(response.data)
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCancelPaymentTransaction = (e) => {
    apiCall("/cancelPaymentTransaction", 'post',{
        paymentGatewayId: paymentId,
        chanId: chanId,
      })
      .then((response) => {
        const status = response?.data?.data?.paymentGatewayCommand?.eventQueue;
        if (status?.lenght > 1) {
          setStatus(status?.[status.lenght - 1]?.statusDetails);
        } else {
          setStatus(status?.[0]?.statusDetails);
        }
        setChanId("");
        console.log(
          "getCancelPaymentTransaction:",
          JSON.stringify(response.data)
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      
       <div className="position-absolute top-0 end-0 m-3">
        {!isConnected ? 
            <svg onClick={getApiInfoDetails} className="shake-animation" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10M12 6.25a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0V7a.75.75 0 0 1 .75-.75M12 17a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clipRule="evenodd"/></svg>
          :
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><defs><mask id="ipSSuccess0"><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"><path fill="#fff" stroke="#fff" d="m24 4l5.253 3.832l6.503-.012l1.997 6.188l5.268 3.812L41 24l2.021 6.18l-5.268 3.812l-1.997 6.188l-6.503-.012L24 44l-5.253-3.832l-6.503.012l-1.997-6.188l-5.268-3.812L7 24l-2.021-6.18l5.268-3.812l1.997-6.188l6.503.012z"/><path stroke="#000" d="m17 24l5 5l10-10"/></g></mask></defs><path fill="green" d="M0 0h48v48H0z" mask="url(#ipSSuccess0)"/></svg>
        }
        </div>
      <div className="d-flex align-items-center" style={{ minHeight: "100vh" }}>
      <div className="mx-auto" test>
        <Container style={containerStyle}>
          <Row>
            <Col>
              <div className="mx-auto text-center">
                <img className="mb-3" src="logo-dark.png" alt="GrandCo" />
                <img className="mb-3" src="dabadu-logo.svg" alt="Dabadu" style={{marginLeft: '10px', width: '180px'}} />
                <h2 className="mb-3">GrandCo Payment V2</h2>
                <p class="h5">Dabadu</p>
              </div>
              
              <Form onSubmit={handleSubmit}>
                {!formData.refund ? (
                  <>
                  <p class="h5">Transaction</p>
                    <Form.Group className="mb-3">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        autoComplete="off"
                        type="text"
                        name="amount"
                        value={formData.amount}
                        disabled={chanId}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    {/* <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        name="cardEntry"
                        label="Card Manual Entry"
                        disabled={chanId}
                        checked={formData.cardEntry}
                        onChange={handleChange}
                      />
                    </Form.Group> */}
                    {" "}

                    <div className="mb-3">
                      <div className="mb-1">
                        <input
                          className="form-check-input mr-2"
                          type="radio"
                          id="radioOption1"
                          name="radioGroup"
                          value="option1"
                          checked={selectedOption === 'option1'}
                          onChange={handleChangeOption}
                        />
                        <label className="form-check-label" htmlFor="radioOption1">
                          &emsp;Card present
                        </label>
                      </div>
                      <div className="mb-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="radioOption2"
                          name="radioGroup"
                          value="option2"
                          checked={selectedOption === 'option2'}
                          onChange={handleChangeOption}
                        />
                        <label className="form-check-label" htmlFor="radioOption2">
                        &emsp;Card not present
                        </label>
                      </div>
                    </div>


                  </>
                ) : (
                  <>
                  <p class="h5">Refund</p>
                    <Form.Group className="mb-3">
                      <Form.Label>Transaction Id</Form.Label>
                      <Form.Control
                        autoComplete="off"
                        type="text"
                        name="transId"
                        value={formData.transId}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Refund Amount</Form.Label>
                      <Form.Control
                        autoComplete="off"
                        type="text"
                        name="refundAmount"
                        value={formData.refundAmount}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </>
                )}

                {/* {!formData.cardEntry && (
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      name="refund"
                      label="Refund"
                      disabled={formData.cardEntry}
                      checked={formData.refund}
                      onChange={handleChange}
                    />
                  </Form.Group>
                )} */}

                {/* <Form.Group className="mb-3">
                  <Form.Label>Card Type</Form.Label>
                  <Form.Select
                    name="cardType"
                    aria-label="Default select example"
                    value={formData.cardType}
                    onChange={handleChange}
                  >
                    <option value="">Choose the Card Type</option>
                    <option value="AX">AX</option>
                    <option value="DI">DI</option>
                    <option value="MC">MC</option>
                    <option value="VI">VI</option>
                  </Form.Select>
                </Form.Group> */}
                {/* <Form.Group className="mb-3">
                  <Form.Label>Customers</Form.Label>
                  <Form.Select
                    name="customer"
                    aria-label="Default select example"
                    value={formData.customer}
                    onChange={handleChange}
                  >
                    <option value="">Choose the customer</option>
                    <option value="james">James</option>
                    <option value="siva">Siva</option>
                    <option value="anand">Anand</option>
                  </Form.Select>
                </Form.Group> */}

                {!chanId && !formData.refund ? (
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={formData.amount === ""}
                  >
                    Pay Now
                  </Button>
                ) : null}

                {formData.refund ? (
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={
                      formData.refundAmount === "" && formData.transId === ""
                    }
                  >
                    Refund
                  </Button>
                ) : null}
              </Form>


              <hr/>
              <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      name="refund"
                      label="Refund"
                      // disabled={formData.cardEntry}
                      checked={formData.refund}
                      onChange={handleChange}
                    />
                  </Form.Group>
              {chanId ? (
                <>
                  <Button
                    className="mt-3 me-3"
                    variant="primary"
                    type="submit"
                    onClick={handlePaymentTransactionStatus}
                  >
                    Print
                  </Button>
                  <Button
                    className="mt-3"
                    variant="primary"
                    type="submit"
                    onClick={handleCancelPaymentTransaction}
                  >
                    Cancel
                  </Button>
                </>
              ) : null}

              {status ? <p className="mt-3">{status}</p> : null}
            </Col>
          </Row>
        </Container>
      </div>
      </div>
    </div>
  );
}

export default PaymentForm;
