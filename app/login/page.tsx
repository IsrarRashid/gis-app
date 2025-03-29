import dynamic from "next/dynamic";

const Login = dynamic(() => import("../components/Login"), {
  ssr: false,
});

const LoginPage = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default LoginPage;
