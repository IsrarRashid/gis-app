import dynamic from "next/dynamic";

const Rights = dynamic(() => import("./components/Rights"), {
  ssr: false,
});

const RightsPage = () => {
  return (
    <>
      <Rights />
    </>
  );
};

export default RightsPage;
