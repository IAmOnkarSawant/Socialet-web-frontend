import React from "react";
import { randomPercentage } from "../../utils/formatter";

function Bars({ ...props }) {
  const handleSelectRandomTime = (index) => {
    console.log("handleSelectRandomTime logged!");
  };

  return (
    <div
      style={{ height: "320px", width: "100%" }}
      className="d-flex flex-row justify-content-center"
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
    </div>
  );
}

export default Bars;
