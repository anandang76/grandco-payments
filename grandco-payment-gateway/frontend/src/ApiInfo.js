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
                {apiInfo && Object.keys(apiInfo)?.length > 0 && <pre>{JSON.stringify(apiInfo)}</pre>}
            </Container>
        </div>
    )
}

export default ApiInfo;