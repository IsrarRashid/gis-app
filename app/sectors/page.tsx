import dynamic from "next/dynamic";

const Sectors = dynamic(() => import("./components/Sectors"), {
  ssr: false,
});

const SectorsPage = () => {
  return (
    <>
      <Sectors />
    </>
  );
};

export default SectorsPage;
