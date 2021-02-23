import { useEffect, useState} from "react";
import { AppData, getData } from "../data"

export function useData() {
  const [data, setData] = useState<AppData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setError("");
      setLoading(true);
      try {
        setData(await getData());
        setLoading(false);
        setError("");
      } catch (e) {
        setLoading(false);
        setError("Failed to fetch data");
      }
    })();
  }, []);

  return { data, loading, error }
}