import React from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

function Header({ followObj }) {
  return (
    <div className="header bg-gradient-dark pb-6 pt-4 pt-md-8">
      <Container fluid>
        <div className="header-body">
          <Row>
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        FOLLOWERS
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {followObj["followers"]}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <i class="fas fa-users"></i>
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span
                      className={`${
                        followObj["followers_percentage"] < 0
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      <i
                        className={`fa ${
                          followObj["followers_percentage"] < 0
                            ? "fa-arrow-down"
                            : "fa-arrow-up"
                        } mr-2`}
                      />
                      {followObj["followers_percentage"] < 0
                        ? Math.abs(followObj["followers_percentage"])
                        : followObj["followers_percentage"]}
                      %
                    </span>
                    <span className="ml-2 text-nowrap">Since last 7 days</span>
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        FOLLOWINGS
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {followObj["followings"]}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i class="fas fa-people-arrows"></i>
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span
                      className={`${
                        followObj["followings_percentage"] < 0
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      <i
                        className={`fa ${
                          followObj["followings_percentage"] < 0
                            ? "fa-arrow-down"
                            : "fa-arrow-up"
                        } mr-2`}
                      />
                      {followObj["followings_percentage"] < 0
                        ? Math.abs(followObj["followings_percentage"])
                        : followObj["followings_percentage"]}
                      %
                    </span>
                    <span className="ml-2 text-nowrap">Since last 7 days</span>
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default Header;
