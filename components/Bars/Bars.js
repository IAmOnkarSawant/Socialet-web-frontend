import React from "react";
import { Card } from "reactstrap";
import { randomPercentage } from "../../utils/formatter";

function Bars({ ...props }) {
  const handleSelectRandomTime = (index) => {
    console.log("handleSelectRandomTime logged!");
  };

  return (
    <Card
      style={{ height: "320px", width: "100%" }}
      className="d-flex flex-row justify-content-center shadow-lg rounded-lg mb-4 pt-5"
    >
      {Array.from({ length: 8 })
        .reduce((prevValue, currValue, index, array) => {
          if (index === 0) prevValue[index] = 0;
          else prevValue[index] = prevValue[index - 1] + 3;
          return prevValue;
        }, [])
        .map((day, index) => (
          <div
            key={index}
            style={{ height: "100%" }}
            className="d-flex flex-column justify-content-end mx-1"
          >
            <div
              onClick={(e) => {
                if (index < 3) {
                  e.preventDefault();
                  return;
                }
                handleSelectRandomTime(index);
              }}
              style={{
                height: randomPercentage(),
                width: "40px",
                cursor: index < 3 ? "not-allowed" : "pointer",
              }}
              className={`${
                index < 3 ? "bg-light" : "bg-primary"
              } shadow-lg rounded-top`}
            />
            <span className="mt-1 mx-auto">{day}</span>
          </div>
        ))}
    </Card>
  );
}

export default Bars;
