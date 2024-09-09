import { useEffect, useState } from "react";
import List from "./List";
import TopMenu from "./TopMenu";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Users = () => {
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
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

export default Users;
