import dynamic from "next/dynamic";

const NotAuthorized = dynamic(() => import("./components/NotAuthorized"), {
  ssr: false,
});

const NotAuthorizedPage = () => {
  return <NotAuthorized />;
};

export default NotAuthorizedPage;
