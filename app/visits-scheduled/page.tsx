import dynamic from "next/dynamic";

const VisitsScheduled = dynamic(() => import("./components/VisitsScheduled"), {
  ssr: false,
});

const VisitsScheduledPage = () => {
  return (
    <>
      <VisitsScheduled />
    </>
  );
};

export default VisitsScheduledPage;
