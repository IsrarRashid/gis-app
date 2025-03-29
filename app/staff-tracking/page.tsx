import dynamic from "next/dynamic";

const StaffTracking = dynamic(() => import("./components/StaffTracking"), {
  ssr: false,
});

const StaffTrackingPage = () => {
  return (
    <div className="p-3">
      <StaffTracking />
    </div>
  );
};

export default StaffTrackingPage;
