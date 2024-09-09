import { useEffect, useState } from "react";
import apiClient, { AxiosError, CanceledError } from "../services/api-client";
import { sectorAPI } from "../APIs";

export interface Data {
  id: number;
  parentId: number;
  name: "";
  description: "";
  createdAt: "";
  updateAt: "";
  sortId: number;
  parentName: "";
}

interface Props {
  refresh: boolean;
}

const useSectors = ({ refresh }: Props) => {
  const [data, setData] = useState<Data[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      const controller = new AbortController();
      setLoading(true);
      try {
        const response = await apiClient.get(sectorAPI, {
          signal: controller.signal,
        });
        setData(response.data.data);
        setLoading(false);
        console.log("api Data:", data);
      } catch (err) {
        if (err instanceof CanceledError) return;
        setError((err as AxiosError).message);
        setLoading(false);
      }

      return () => controller.abort();
    };
    loadItems();
  }, [refresh, data]);

  return { data, setData, error, setError, isLoading };
};

export default useSectors;
