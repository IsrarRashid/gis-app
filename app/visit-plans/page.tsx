import dynamic from "next/dynamic";

const VisitPlans = dynamic(() => import("./components/VisitPlans"), {
  ssr: false,
});

const VisitPlansPage = () => {
  return (
    <>
      <VisitPlans />
    </>
  );
};

export default VisitPlansPage;
