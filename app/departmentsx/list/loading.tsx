// import Loader from "@/app/components/Loader";

import Skeleton from "react-loading-skeleton";

const LoadingPage = () => {
  const data = [1, 2, 3, 4, 5];
  return (
    <div className="p-3">
      <div
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, rgba(255, 255, 255, 0.6) , rgba(255, 255, 255, 0.1))",
          borderRadius: "15px",
          padding: "2px",
        }}
      >
        <div
          className="container-fluid p-3"
          style={{
            backgroundImage:
              "linear-gradient(to bottom left, rgba(239, 239, 239, 0.6) , rgba(255, 255, 255, 0.08))",
            borderRadius: "15px",
          }}
        >
          <div className="row p-3">
            {/* table header */}
            <div className="row d-flex m-0 p-3">
              <div className="col">
                <h4 className="fw-bold">
                  <Skeleton />
                </h4>
              </div>
              <div className="col text-end mt-1">
                <span className="fw-bold">
                  <Skeleton />
                </span>
              </div>
              <div className="col-auto">
                <Skeleton />
              </div>
            </div>
            <div className="row d-flex justify-content-between p-3 m-0">
              <div className="col-lg-6 col-md-5 col-sm-12">
                <p>
                  <Skeleton />
                </p>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                {/* search bar */}
              </div>
            </div>
            {/* table */}
            <div
              className="table-responsive p-0"
              style={{
                border: ".41px solid rgba(81,81,81,0.20)",
              }}
            >
              <table className="table table-hover mb-5">
                <thead>
                  <tr
                    className={`color-dark-blue cursor-pointer`}
                    style={{
                      border: ".41px solid rgba(81,81,81,0.20) !important",
                      fontSize: ".85rem",
                    }}
                  >
                    <th>ID</th>
                    <th>DEPARTMENT Name</th>
                    <th>PHONE NO</th>
                    <th>EMAIL</th>
                    <th>ADDRESS</th>
                    <th>LOGO</th>
                    <th colSpan={2}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((d) => (
                    <tr
                      style={{
                        border: ".41px solid rgba(81,81,81,0.20) !important",
                        fontSize: ".85rem",
                      }}
                      key={d}
                    >
                      <td>
                        <Skeleton />
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
