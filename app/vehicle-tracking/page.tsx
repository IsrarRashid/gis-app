import dynamic from "next/dynamic";

const VehicleTracking = dynamic(() => import("./components/VehicleTracking"), {
  ssr: false,
});

const VehicleTrackingPage = () => {
  return (
    <div className="p-3">
      <VehicleTracking />
    </div>
  );
};

export default VehicleTrackingPage;
