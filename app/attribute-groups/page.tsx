import dynamic from "next/dynamic";

const AttributeGroups = dynamic(() => import("./components/AttributeGroups"), {
  ssr: false,
});

const AttributeGroupsPage = () => {
  return (
    <>
      <AttributeGroups />
    </>
  );
};

export default AttributeGroupsPage;
