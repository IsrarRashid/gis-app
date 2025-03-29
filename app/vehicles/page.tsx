import dynamic from "next/dynamic";

const Vehicles = dynamic(() => import("./components/Vehicles"), {
  ssr: false,
});

const VehiclesPage = () => {
  return (
    <>
      <Vehicles />
    </>
  );
};

export default VehiclesPage;
