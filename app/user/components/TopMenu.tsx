import Form from "./Form";
import { userAPI } from "@/app/APIs";
import { getFormattedDate } from "@/app/utils";
import useUsers from "@/app/hooks/useUsers";

interface ForForm {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopMenu = ({ refresh, setRefresh }: ForForm) => {
  const { data } = useUsers({ refresh });

  return (
    <>
      <div className="row d-flex p-3">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h4 className="fw-bold">Users</h4>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="row d-flex ">
            <div className="col d-none d-lg-block"></div>
            <div className="col text-end">
              <span className="fw-bold">{getFormattedDate()}</span> Today
            </div>
            <div className="col text-end">
              <Form
                api={userAPI}
                method="POST"
                setRefresh={setRefresh}
                refresh={refresh}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row p-3">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <p>
            Showing: <span className="fw-bold">{data?.length} Users</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default TopMenu;
