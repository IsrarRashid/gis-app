import dynamic from "next/dynamic";

const VisitsNew = dynamic(() => import("./components/VisitsNew"), {
  ssr: false,
});

const VisitsNewPage = () => {
  return (
    <>
      <VisitsNew />
    </>
  );
};

export default VisitsNewPage;
