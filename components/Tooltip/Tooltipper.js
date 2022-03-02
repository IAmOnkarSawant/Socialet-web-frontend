import React from "react";
import { Tooltip } from "reactstrap";

function Tooltipper({ target, placement = "top", text, ...props }) {
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  return (
    <Tooltip
      isOpen={tooltipOpen}
      placement={placement}
      target={target}
      toggle={() => setTooltipOpen(!tooltipOpen)}
      style={{ fontSize: "13px" }}
    >
      {text}
    </Tooltip>
  );
}

export default Tooltipper;
