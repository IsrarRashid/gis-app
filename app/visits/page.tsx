import dynamic from "next/dynamic";

const Visits = dynamic(() => import("./components/Visits"), {
  ssr: false,
});

const VisitsPage = () => {
  return (
    <>
      <Visits />
    </>
  );
};

export default VisitsPage;
