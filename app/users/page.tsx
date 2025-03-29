import dynamic from "next/dynamic";

const Users = dynamic(() => import("./components/Users"), {
  ssr: false,
});

const UsersPage = () => {
  return (
    <>
      <Users />
    </>
  );
};

export default UsersPage;
