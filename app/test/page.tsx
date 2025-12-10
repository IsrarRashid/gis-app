export const dynamic = "force-dynamic";

const TestPage = async () => {
  const response = await fetch("/api/v1/sectors", { cache: "no-store" });

  const text = await response.text();
  return <p>{text}</p>;
};

export default TestPage;
