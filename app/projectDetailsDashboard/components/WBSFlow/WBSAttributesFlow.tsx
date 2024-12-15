import React from "react";
import ReactFlow, { MiniMap, Controls, Background, Node } from "reactflow";
import "reactflow/dist/style.css";
import { Groups } from "../ProjectDetailsDashboard";

interface Props {
  majorDeliverables: Groups;
}

const WBSAttributesFlow = ({ majorDeliverables }: Props) => {
  // Generate unique IDs for nodes and edges
  const getNodeId = (prefix: any, id: any) => `${prefix}-${id}`;

  // Transform data into nodes
  const nodes = [
    // Major Deliverable Node
    {
      id: getNodeId("major", majorDeliverables?.id),
      type: "default",
      data: {
        label: (
          <div
            className="col p-2 d-inline-block shadow"
            style={{
              // "linear-gradient(to bottom right, #14BAE3 , #13B1E6, #11AADF,#0B98C5)",
              background: "linear-gradient(to bottom right, #1090b0 , #0a4582)",
              borderRadius: "8px",
              border: "0px",
            }}
          >
            <p className="fs17px fw-bold m-0">{majorDeliverables?.name}</p>
            <p className="fs24px fw-bold m-0">
              {majorDeliverables?.attributes &&
                majorDeliverables.attributes
                  .filter(
                    (attribute) =>
                      attribute.attributeId !== 68 &&
                      attribute.attributeId !== 69 &&
                      attribute?.values[0]?.value
                  )
                  .reduce(
                    (sum, attribute) =>
                      sum +
                      (Math.round(parseFloat(attribute.values[0].value)) || 0),
                    0
                  )}
              %
            </p>
          </div>
        ),
      },
      position: { x: 350 + majorDeliverables?.attributes?.length * 100, y: 50 },
      style: nodeStyle,
    },
    // Attribute Nodes
    ...majorDeliverables.attributes
      .filter(
        (attribute) =>
          attribute.attributeId !== 68 && attribute.attributeId !== 69
      )
      .map((attribute, index) => ({
        id: getNodeId("attribute", attribute.attributeId),
        type: "default",
        data: {
          label: (
            <div
              className="col shadow px-3"
              style={{
                background: "rgba(12, 140, 233, 0.2)",
                borderTopRightRadius: "50px",
                borderBottomRightRadius: "50px",
                border: "1px solid rgba(12, 140, 233, 0.4)",
              }}
            >
              <div className="col p-2">
                <p className="fs17px fw-bold m-0 text-wrap text-center text-break">
                  {attribute.label}
                </p>
              </div>
              <div className="row d-flex m-0">
                <div className="col">
                  <p className="fs24px fw-bold m-0 mt-3 text-end">
                    {attribute.weightage}%
                  </p>
                </div>
                <div className="col pb-2">
                  <div
                    className="rounded-circle fw-bold fs20px text-white text-center ms-2 me-2 my-auto text-wrap text-break"
                    style={{
                      width: "80px",
                      height: "80px",
                      background:
                        "linear-gradient(to bottom right, #0C8CE9, #074F83)",
                    }}
                  >
                    <p className="py-4">
                      {attribute?.values[0]?.value &&
                        Math.round(parseFloat(attribute?.values[0]?.value))}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        position: { x: 400 + index * 350, y: 200 },
        style: attributeNodeStyle,
      })),
  ];

  // Transform data into edges
  const edges = [
    // Edges from Major Deliverable to Groups
    ...majorDeliverables.attributes.map((attribute) => ({
      id: `edge-major-${attribute.attributeId}`,
      source: getNodeId("major", majorDeliverables.id),
      target: getNodeId("attribute", attribute.attributeId),
      animated: false,
      style: edgeStyle,
      type: "step",
    })),
  ];

  return (
    <div style={{ height: "100vh" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        {/* <MiniMap /> */}
        <Controls />
        {/* <Background color="#aaa" gap={16} /> */}
      </ReactFlow>
    </div>
  );
};

// Styles for nodes and edges
const nodeStyle = {
  borderRadius: "8px",
  background: "#2B2B38",
  color: "#fff",
  fontWeight: "bold",
  width: "auto",
  padding: "0px",
  border: "0px",
};

const attributeNodeStyle = {
  background: "rgba(255,255,255,0)",
  color: "#fff",
  fontWeight: "bold",
  width: "20%",
  padding: "0px",
  border: "0px",
  borderTopRightRadius: "50px",
  borderBottomRightRadius: "50px",
};

const edgeStyle = {
  stroke: "#009688",
};

const majorDeliverableStyle = {
  textAlign: "center",
  fontSize: "16px",
};

// const attributeNodeStyle = {
//   textAlign: "center",
//   fontSize: "14px",
// };

// const attributeNodeStyle = {
//   textAlign: "center",
//   fontSize: "12px",
// };

export default WBSAttributesFlow;
