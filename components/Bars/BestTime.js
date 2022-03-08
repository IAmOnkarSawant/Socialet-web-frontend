import React from "react";
import { Card, CardHeader, Row } from "reactstrap";
import { WeekDay } from "../../utils/HelperData";

function BestTime() {
  return (
    <Card className="shadow-lg rounded-lg mb-4 p-4">
      <CardHeader className="bg-transparent mb-4">
        <Row className="align-items-center">
          <div className="col">
            <h3 className="text-uppercase text-default ls-1 mb-1 pl-3">
              best times to post on Twitter
            </h3>
          </div>
        </Row>
      </CardHeader>
      {[
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].map((day, dayIndex) => {
        return (
          <div
            key={dayIndex}
            className="d-flex flex-row justify-content-between"
          >
            <div className="text-uppercase d-flex flex-row justify-content-center align-items-center text-muted shdaow-lg ml-5 rounded-sm mb-2">
              {day.substring(0, 3)}
            </div>
            <div className="d-flex flex-row justify-content-start">
              {[...WeekDay[day]].map((time, timeIndex) => {
                return (
                  <div
                    key={timeIndex}
                    style={{
                      width: "35px",
                      height: "35px",
                      background: `rgba(42, 162, 245,${time["0-1 value"]})`,
                      cursor: "pointer",
                    }}
                    className="scale-up-transition shdaow-lg rounded-sm mr-2 mb-2"
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      <div
        style={{ marginLeft: 110 }}
        className="d-flex flex-row justify-content-center align-items-center"
      >
        {[...Array.from({ length: 24 })].map((time, index) => {
          return (
            <div
              key={index}
              style={{ width: "35px", height: "35px" }}
              className="text-sm d-flex flex-row justify-content-center align-items-center text-muted shdaow-lg rounded-sm mr-2 mb-2"
            >
              {index < 10 ? "0" + index : index}
            </div>
          );
        })}
      </div>

      {/* ignore */}
      <div style={{ width: "90%" }} className="ml-auto mt-5 mr-2">
        <div className="d-flex flex-row justify-content-end align-items-center">
          {[0.1, 0.2, 0.4, 0.6, 0.8, 1].map((label, index) => {
            return (
              <div
                key={index}
                style={{
                  height: "14px",
                  width: "20%",
                  background: `rgba(42, 162, 245,${label})`,
                }}
                className="border border-white"
              />
            );
          })}
        </div>
        <div className="mt-3 d-flex flex-row justify-content-between">
          <p className="font-weight-bold text-muted text-default">
            LOWEST ENGAGEMENT
          </p>
          <p className="font-weight-bold text-muted text-default">
            HIGHEST ENGAGEMENT
          </p>
        </div>
      </div>
    </Card>
  );
}

export default BestTime;
