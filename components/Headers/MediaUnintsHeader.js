import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
  Badge,
} from "reactstrap";
import { ministries } from "../../utils/HelperData";

function MediaUnintsHeader({ openMediaUnit, setOpenMediaUnit }) {
  return (
    <React.Fragment>
      <div className="header bg-gradient-dark pb-3 pt-md-7">
        <Container fluid>
          <div className="header-body">
            <Row>
              {[...ministries].map((unit, index) => {
                return (
                  <Col key={index} className="pb-3" lg="6" xl="3">
                    <Card className="card-stats mb-4 mb-xl-0">
                      <CardBody>
                        <Row>
                          <div className="col">
                            <CardTitle
                              tag="h5"
                              className="text-uppercase text-muted mb-0"
                            >
                              {unit.mediaUnit}
                            </CardTitle>
                          </div>
                          <Col className="col-auto">
                            <span className="avatar avatar-lg rounded-circle">
                              <img alt="..." src={unit.displayURL} />
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <div className="col">
                            {index === 0 ? (
                              <Badge
                                style={{
                                  marginBottom: "5px",
                                  cursor: "pointer",
                                }}
                                color="success"
                                className="badge-md"
                                onClick={() => setOpenMediaUnit(!openMediaUnit)}
                              >
                                View More
                              </Badge>
                            ) : (
                              <Badge
                                style={{
                                  marginBottom: "5px",
                                  cursor: "pointer",
                                }}
                                color="warning"
                                className="badge-md"
                              >
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default MediaUnintsHeader;
