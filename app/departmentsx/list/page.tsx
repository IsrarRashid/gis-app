import { DEPARTMENT_API, SECTOR_API } from "../../APIs";
import { cookies } from "next/headers";
import { DM_Sans, Inter } from "next/font/google";
import { addDayToFormattedDate, getFormattedDate } from "../../utils";
import Form from "./components/Form";
import DeleteButton from "./components/DeleteButton";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface Department {
  id: number;
  name: string;
  logo: string;
  address: string;
  email: string;
  phoneNumber: string;
}

// async function getCookieData() {
//   const cookieData = cookies().getAll();
//   return new Promise<typeof cookieData>((resolve) =>
//     setTimeout(() => {
//       resolve(cookieData);
//     }, 1000)
//   );
// }
const getCookieData = async () => cookies().getAll();

const DepartmentsPage = async () => {
  // const incomingHeaders = headers();
  // console.log(
  //   "Incoming Headers on Server:",
  //   Object.fromEntries(incomingHeaders.entries())
  // );

  // const authorizationHeader = incomingHeaders.get("authorization");
  // console.log("Authorization Header Value:", authorizationHeader);

  const cookieData = await getCookieData();
  console.log("Cookie Store:", cookieData); // Log the entire cookie store

  const accessToken = cookieData.find(
    (cookie) => cookie.name === "token",
  )?.value; // Assuming your cookie is named 'accessToken'

  if (!accessToken) {
    console.error("Access token not found in cookies on the server");
    // Handle the case where the token is not present.
    // This might involve redirecting to a login page or rendering
    // a different UI for unauthenticated users.
    return <div>Authentication required</div>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}${SECTOR_API}`,
      {
        cache: "no-store",
        headers: {
          accept: "text/plain",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      },
    );
    // console.log(
    //   "Headers after api call:",
    //   Object.fromEntries(incomingHeaders.entries())
    // );
    // const errorText = await res.text();
    // console.error("Error Body:", errorText);
    // console.log("error body ends");
    if (res.status === 500) {
      console.log("departments api response: ", res);
      console.error(`Fetch error: ${res.status} - ${res.statusText}`);
      const errorText = await res.text();
      console.error("Error Body:", errorText);
      return <div>Error fetching departments</div>;
    }

    const response = await res.json();
    const data: Department[] = response.data;
    console.log("departments: ", data);
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
                  <h4 className="fw-bold">Depeartment Rights</h4>
                </div>
                <div className="col text-end mt-1">
                  <span className="fw-bold">
                    {new Date().toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  &nbsp;Today
                </div>
                <div className="col-auto">
                  <Form
                    api={DEPARTMENT_API + "/CreateAdministrativeDepartment"}
                    method={"POST"}
                  />
                </div>
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
                      className={`color-dark-blue cursor-pointer ${inter.className}`}
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
                        className={dmSans.className}
                        style={{
                          border: ".41px solid rgba(81,81,81,0.20) !important",
                          fontSize: ".85rem",
                        }}
                        key={d.id}
                      >
                        <td>{d.id}</td>
                        <td>{d.name}</td>
                        <td>{d.phoneNumber}</td>
                        <td>{d.email}</td>
                        <td>{d.address}</td>
                        <td>{d.logo}</td>
                        <td>
                          <DeleteButton id={d.id} />
                        </td>
                        <td>
                          <Form api={DEPARTMENT_API} method="PUT" id={d.id} />
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
    return <div>Error fetching departments</div>;
  }
};

export default DepartmentsPage;
