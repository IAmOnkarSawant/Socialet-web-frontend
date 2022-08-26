import React from "react";
import { Card, CardBody } from "reactstrap";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

// const data = [
// 	{ name: "fear", value: 400 },
// 	{ name: "anger", value: 300 },
// 	{ name: "sadness", value: 300 },
// 	{ name: "surprise", value: 200 },
// 	{ name: "joy", value: 200 },
// 	{ name: "love", value: 200 },
// 	{ name: "neutral", value: 200 },
// ];

const COLORS = ["#172b4d", "#5e72e4", "#11cdef", "#2dce89", "#f5365c"];

function AnalysisCard({ data, ...props }) {
  const dataUpdated = Object.entries(data).map(([key, value], index) => {
    return {
      name: key,
      value,
    };
  });
  console.log(dataUpdated);
  return (
    <Card className="card-frame">
      <CardBody>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <PieChart width={800} height={400}>
              <Legend layout="vertical" verticalAlign="top" align="right" />
              <Pie
                data={dataUpdated}
                cx={500}
                cy={200}
                innerRadius={80}
                outerRadius={110}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
                labelLine
              >
                {dataUpdated.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}

export default AnalysisCard;
