import dynamic from "next/dynamic";

const DirectionsTest = dynamic(() => import("./components/DirectionsTest"), {
  ssr: false,
});

const DirectionsIntro = () => {
  return <DirectionsTest />;
};

export default DirectionsIntro;
