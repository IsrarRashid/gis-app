import dynamic from "next/dynamic";

const List = dynamic(() => import("./list/components/List"), {
  ssr: false,
});

const ReportHistoryPage = () => {
  return (
    <div className="p-3 pt-0">
      <List />
    </div>
  );
};

export default ReportHistoryPage;
