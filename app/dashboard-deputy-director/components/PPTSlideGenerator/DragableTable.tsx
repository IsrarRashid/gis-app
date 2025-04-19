import { RxHamburgerMenu } from "react-icons/rx";

const DragableTable = ({ sectors }: { sectors: string[] }) => {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Sr</th>
            <th scope="col">Sectors</th>
            <th scope="col">Drag</th>
          </tr>
        </thead>
        <tbody>
          {sectors.map((sector, i) => (
            <tr key={i}>
              <th scope="row">{i + 1}</th>
              <td>{sector}</td>
              <td>
                <RxHamburgerMenu />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DragableTable;
