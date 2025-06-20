import { cookies } from "next/headers";
import { Sector } from "../hooks/useSectors";
import { addDayToFormattedDate, getFormattedDate } from "../utils";

async function getCookieData() {
  const cookieData = cookies().getAll();
  return new Promise<typeof cookieData>((resolve) =>
    setTimeout(() => {
      resolve(cookieData);
    }, 1000)
  );
}
const SectorsPage = async () => {
  const cookieData = await getCookieData();

  const accessToken = cookieData.find(
    (cookie) => cookie.name === "token"
  )?.value; // Assuming your cookie is named 'accessToken'

  if (!accessToken) {
    console.error("Access token not found in cookies on the server");
    // Handle the case where the token is not present.
    // This might involve redirecting to a login page or rendering
    // a different UI for unauthenticated users.
    return <div>Authentication required</div>;
  }

  try {
    const res = await fetch(`http://110.39.184.210:154/api/Sectors`, {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
    // const errorText = await res.text();
    // console.error("Error Body:", errorText);
    // console.log("error body ends");
    if (res.status === 500) {
      console.log("sectors api response: ", res);
      console.error(`Fetch error: ${res.status} - ${res.statusText}`);
      const errorText = await res.text();
      console.error("Error Body:", errorText);
      return <div>Error fetching sectors</div>;
    }

    const response = await res.json();
    const data: Sector[] = response.data;
    console.log("sectors: ", data);
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
                  <h4 className="fw-bold">Sectors X</h4>
                </div>
                <div className="col text-end mt-1">
                  <span className="fw-bold">
                    {addDayToFormattedDate(
                      getFormattedDate(new Date(), "short")!
                    )}
                  </span>
                  &nbsp;Today
                </div>
                <div className="col-auto"></div>
              </div>
              <div className="row d-flex justify-content-between p-3 m-0">
                <div className="col-lg-6 col-md-5 col-sm-12">
                  <p>
                    Showing:{" "}
                    <span className="fw-bold">
                      {data?.length}{" "}
                      {data?.length > 1 ? "Departments" : "Department"}
                    </span>
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
                      className={`color-dark-blue cursor-pointer `}
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
                        key={d.id}
                      >
                        <td>{d.id}</td>
                        <td>{d.name}</td>
                        <td>{/* <DeleteButton id={d.id} /> */}</td>
                        <td>
                          {/* <Form api={DEPARTMENT_API} method="PUT" id={d.id} /> */}
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
  } catch (error) {
    console.error("Fetch Error:", error);
    return <div>Error fetching sectors</div>;
  }
};

export default SectorsPage;
