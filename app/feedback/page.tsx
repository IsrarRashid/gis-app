import dynamic from "next/dynamic";

const Feedback = dynamic(() => import("./components/Feedback"), {
  ssr: false,
});

const FeedbackPage = () => {
  return (
    <div className="p-3">
      <Feedback />
    </div>
  );
};

export default FeedbackPage;
