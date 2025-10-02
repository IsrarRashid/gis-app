"use client";
import { SECTOR_API } from "@/app/APIs";
import DeleteModal from "@/app/components/DeleteModal";
import Loader from "@/app/components/Loader";
import Actions from "@/app/components/Table/Actions";
import Pagination from "@/app/components/Table/Pagination";
import RowHeader from "@/app/components/Table/RowHeader";
import TableData from "@/app/components/Table/TableData";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import useSectors, { Sector } from "@/app/hooks/useSectors";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getFormattedDate } from "@/app/utils";
import { sort } from "fast-sort";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import SectorForm from "./SectorForm";

interface SectorsTableProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const SectorsTable = ({ refresh, setRefresh }: SectorsTableProps) => {
  const { data, setData, setError, isLoading } = useSectors({ refresh });
  const deleteMessage = "Deleted Successfully!";
  const [isPageLimit, setPageLimit] = useState<boolean>(false);
  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Sector[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      [item.id.toString(), item.name, item.description, item.sortId.toString()]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(e.target.value.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e);
  };

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Sector;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Sector) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    const sortedData = sort(data)[direction](key);
    setSortConfig({ key, direction });
    setData([...sortedData]);
  };

  // for selecting rows per page
  const [rows, setRows] = useState(10); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Paginate data to display only the current page's rows
  // const paginatedData = (searchTerm ? filteredData : data).slice(
  //   (currentPage - 1) * rows,
  //   currentPage * rows
  // );

  const getParentSector = (parsentSectorId: number, data: Sector[]) => {
    const sector = data.find((sector) => sector.id === parsentSectorId);
    return sector?.name;
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${SECTOR_API}/${id}`);
      // remove the deleted item from the data array
      // seTableDataata((prevData) => prevData.filter((item) => item.id !== id));
      setRefresh((prev) => !prev);
      notifyCreate(deleteMessage);
      console.log("item deleted successfully");
    } catch (err) {
      console.error("failed to delete item", err);
      setError((err as AxiosError).message);
      notifyError((err as AxiosError).message);
    }
  };

  // inside your component (client)
  const MEASURE_LIMIT = 200; // sample size — increase if rows are very tall/complex

  const containerRef = useRef<HTMLDivElement | null>(null);
  const measurementRef = useRef<HTMLTableSectionElement | null>(null);

  const effectiveData = searchTerm ? filteredData : data;

  // paginatedData uses rows
  const paginatedData = effectiveData.slice(
    (currentPage - 1) * rows,
    currentPage * rows
  );

  // effect to measure rows that fit
  useEffect(() => {
    if (!containerRef.current) return;
    if (isPageLimit) return;

    let rafId = 0;
    const calculateRows = () => {
      // ensure measurement DOM is present
      const container = containerRef.current!;
      const measureTbody = measurementRef.current;
      if (!measureTbody) return;

      const availableHeight = container.clientHeight - 80; // inner height
      const allRows = Array.from(measureTbody.querySelectorAll("tr"));
      let acc = 0;
      let count = 0;

      for (const row of allRows) {
        const h = row.getBoundingClientRect().height;
        if (acc + h <= availableHeight) {
          acc += h;
          count++;
        } else {
          break;
        }
      }

      // fallback: at least 1 row
      if (count <= 0) count = 1;

      // don't exceed total data length
      const finalCount = Math.min(count, effectiveData.length || count);

      // update only if changed
      setRows((prev) => {
        if (prev !== finalCount) {
          // if current page would be out of range, reset to 1 (or clamp)
          const maxPage = Math.max(
            1,
            Math.ceil((effectiveData.length || 1) / finalCount)
          );
          if (currentPage > maxPage) setCurrentPage(1);
          return finalCount;
        }
        return prev;
      });
    };

    // wrapper for ResizeObserver + rAF
    const onResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(calculateRows);
    };

    // initial calc after next paint so measurement elements are in DOM
    rafId = requestAnimationFrame(calculateRows);

    // Observe container and measurement area
    const ro = new ResizeObserver(onResize);
    ro.observe(containerRef.current);
    if (measurementRef.current) ro.observe(measurementRef.current);

    // also fallback to window resize just in case
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
    // re-run when data set changes, search/filter changes, etc.
  }, [effectiveData, currentPage, isPageLimit]);

  return (
    <>
      {isLoading && <Loader />}
      <TableHeader
        heading="Sectors"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <SectorForm
              api={SECTOR_API}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
              setData={setData}
              data={data}
            />
          </div>
        }
      />
      <div className="table-responsive mb-2" style={{ margin: "0px -12px" }}>
        <div
          style={{ height: "calc(100vh - 260px)", overflow: "auto" }}
          ref={containerRef}
        >
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <TableHeading name="id" handleSort={() => handleSort("id")} />
                <TableHeading
                  name="name"
                  handleSort={() => handleSort("name")}
                />
                <TableHeading
                  name="description"
                  handleSort={() => handleSort("description")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="parent sector"
                  handleSort={() => handleSort("parentId")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="sort id"
                  handleSort={() => handleSort("sortId")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="created at"
                  handleSort={() => handleSort("createdAt")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="update at"
                  handleSort={() => handleSort("updateAt")}
                />
                <TableHeading name="ACTIONS" textClassName="text-center" />
              </tr>
            </thead>
            <tbody
              ref={measurementRef}
              aria-hidden="true"
              style={{
                position: "absolute",
                visibility: "hidden",
                left: -9999,
                top: 0,
                width: "auto",
                pointerEvents: "none",
              }}
            >
              {effectiveData.slice(0, MEASURE_LIMIT).map((d) => (
                <tr key={d.id}>
                  <RowHeader>{d.id}</RowHeader>
                  <TableData>{d.name}</TableData>
                  <TableData>{d.description}</TableData>
                  <TableData>{getParentSector(d.parentId, data)}</TableData>
                  <TableData className="text-center">{d.sortId}</TableData>
                  <TableData>
                    {d.createdAt &&
                      getFormattedDate(new Date(d.createdAt), "short")}
                  </TableData>
                  <TableData>
                    {d.updateAt &&
                      getFormattedDate(new Date(d.updateAt), "short")}
                  </TableData>
                  <TableData>
                    <Actions
                      deleteNode={
                        <div style={{ width: "44px", height: "36px" }}></div>
                      }
                      formNode={
                        <div style={{ width: "44px", height: "36px" }}></div>
                      }
                    />
                  </TableData>
                </tr>
              ))}
            </tbody>
            {/* Visible tbody: only render paginated rows */}
            <tbody>
              <AnimatePresence>
                {paginatedData.map((d) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RowHeader>{d.id}</RowHeader>
                    <TableData>{d.name}</TableData>
                    <TableData>{d.description}</TableData>
                    <TableData>{getParentSector(d.parentId, data)}</TableData>
                    <TableData className="text-center">{d.sortId}</TableData>
                    <TableData>
                      {d.createdAt &&
                        getFormattedDate(new Date(d.createdAt), "short")}
                    </TableData>
                    <TableData>
                      {d.updateAt &&
                        getFormattedDate(new Date(d.updateAt), "short")}
                    </TableData>
                    <TableData>
                      <Actions
                        deleteNode={
                          <DeleteModal handleDelete={handleDelete} id={d.id} />
                        }
                        formNode={
                          <SectorForm
                            api={SECTOR_API}
                            method="PUT"
                            id={d.id}
                            setRefresh={setRefresh}
                            refresh={refresh}
                            setData={setData}
                            data={data}
                          />
                        }
                      />
                    </TableData>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        rows={rows}
        setRows={setRows}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setPageLimit={setPageLimit}
      />
    </>
  );
};

export default SectorsTable;
