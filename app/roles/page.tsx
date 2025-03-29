import dynamic from "next/dynamic";

const Roles = dynamic(() => import("./components/Roles"), {
  ssr: false,
});

const RolesPage = () => {
  return (
    <>
      <Roles />
    </>
  );
};

export default RolesPage;
