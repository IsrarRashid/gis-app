import List from "./List";

const AttributeGroups = () => {
  return (
    <>
      <div
        className={"container p-3 mt-3 mb-4 shadow"}
        style={{
          background: "rgba(209, 209, 209, 0.4)",
          border: "1px solid #ededed",
          borderRadius: "15px",
        }}
      >
        <div className="row p-3">
          <List />
        </div>
      </div>
    </>
  );
};

export default AttributeGroups;
