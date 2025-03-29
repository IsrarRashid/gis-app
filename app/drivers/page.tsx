import dynamic from "next/dynamic";

const Drivers = dynamic(() => import("./components/Drivers"), {
  ssr: false,
});

const DriversPage = () => {
  return (
    <>
      <Drivers />
    </>
  );
};

export default DriversPage;
