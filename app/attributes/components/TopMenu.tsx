"use client";
import Form from "./Form";
import { attributesAPI } from "@/app/APIs";
import { getFormattedDate } from "@/app/utils";
import useAttributes from "@/app/hooks/useAttributes";

interface Props {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopMenu = ({ refresh, setRefresh }: Props) => {
  const { data } = useAttributes({ refresh });

  return (
    <>
      <div className="row d-flex p-3">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h4 className="fw-bold">Attributes</h4>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="row d-flex">
            <div className="col d-none d-lg-block"></div>
            <div className="col text-end">
              <span className="fw-bold">{getFormattedDate()}</span> Today
            </div>
            <div className="col text-end">
              <Form
                api={attributesAPI}
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
            Showing: <span className="fw-bold">{data?.length} Attributes</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default TopMenu;
