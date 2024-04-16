import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

function ApiInfo() {
    const [apiInfo, setApiInfo] = useState({});


    const handleGetApiInfo = (e) => {
        axios
          .get("/getApiInfo")
          .then((response) => {
            setApiInfo(response?.data);
            console.log(
              "getApiInfo:",
              JSON.stringify(response.data)
            );
          })
          .catch((error) => {
            console.error("Error:", error);
          });
    };

    useEffect(() => {
        console.log(apiInfo);
    }, [apiInfo]);


    return(
        <div className="d-flex align-items-center">
            <Container style={{width: '400px'}}>
                <Button
                    onClick={handleGetApiInfo}
                    variant="primary"
                    type="button"
                >
                    Show API Info 
                </Button>
                {/* {apiInfo && Object.keys(apiInfo)?.length > 0 && <code>{JSON.stringify(apiInfo)}</code>} */}
                {apiInfo && Object.keys(apiInfo)?.length > 0 && <div>
                    <p>Name : {apiInfo?.data?.cardReaderInfo?.name}</p>
                    <p>Serial Number : {apiInfo?.data?.cardReaderInfo?.serialNumber}</p>
                    <p>Payment App Name : {apiInfo?.data?.cardReaderInfo?.paymentAppName}</p>
                    <code>{JSON.stringify(apiInfo)}</code>
                </div>}

            </Container>
        </div>
    )
}

export default ApiInfo;