import dynamic from "next/dynamic";

const SuperGroup = dynamic(() => import("./components/SuperGroup"), {
  ssr: false,
});

const SuperGroupPage = () => {
  return (
    <>
      <SuperGroup />
    </>
  );
};

export default SuperGroupPage;
