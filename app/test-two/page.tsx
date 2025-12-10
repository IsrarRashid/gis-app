import { SECTOR_API } from "../APIs";

export const dynamic = "force-dynamic";

const TestTwoPage = async () => {
  const response = await fetch(
    (process.env.NEXT_PUBLIC_BACKEND_API as string) + SECTOR_API
  );

  const text = await response.text();
  return <p>{text}</p>;
};

export default TestTwoPage;
