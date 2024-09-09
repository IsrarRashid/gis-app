import { useEffect, useState } from "react";
import List from "./List";
import TopMenu from "./TopMenu";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AttributeGroups = () => {
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <TopMenu refresh={refresh} setRefresh={setRefresh} />
      <div className="row p-3">
        <List refresh={refresh} setRefresh={setRefresh} />
      </div>
    </>
  );
};

export default AttributeGroups;
