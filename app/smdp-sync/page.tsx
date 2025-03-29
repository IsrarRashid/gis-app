import dynamic from "next/dynamic";

const SmdpSync = dynamic(() => import("./components/SmdpSync"), {
  ssr: false,
});

const SmdpSyncPage = () => {
  return (
    <>
      <SmdpSync />
    </>
  );
};

export default SmdpSyncPage;
