import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import config from './config';

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
    axios
    .get("/getApiInfo")
    .then((response) => {
      console.log("getApiInfo:", JSON.stringify(response.data));
      console.log(response.data);
      localStorage.setItem('cardReaderInfo', JSON.stringify(response.data?.data?.cardReaderInfo))
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }

  useEffect(() => {
    axios
      .post("/openPaymentGateway",{
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
      axios
        .post("/startPaymentTransaction", {
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
      axios
        .post("/linkedRefund", {
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
    axios
      .post("/getPaymentTransactionStatus", {
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
    axios
      .post("/cancelPaymentTransaction", {
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
    <div className="mx-auto">
      <Container style={containerStyle}>
        <Row>
          <Col>
            <div className="mx-auto text-center">
              <img className="mb-3" src="logo-dark.png" alt="GrandCo" />
              <h2 className="mb-3">GrandCo Payment V2</h2>
            </div>
            
            <Form onSubmit={handleSubmit}>
              {!formData.refund ? (
                <>
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
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      name="cardEntry"
                      label="Card Manual Entry"
                      disabled={chanId}
                      checked={formData.cardEntry}
                      onChange={handleChange}
                    />
                  </Form.Group>{" "}
                </>
              ) : (
                <>
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

              {!formData.cardEntry && (
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
              )}

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
  );
}

export default PaymentForm;
