import dynamic from "next/dynamic";

const Attributes = dynamic(() => import("./components/Attributes"), { ssr: false });

const AttributesPage = () => {
  return (
    <>
      <Attributes />
    </>
  );
};

export default AttributesPage;
