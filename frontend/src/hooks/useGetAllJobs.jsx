// src/hooks/useGetAllJobs.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";
import api from "@/utils/axiosInstance"; // <- central Axios with token + withCredentials

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((state) => state.job);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    // AbortController lets us cancel if component unmounts
    const controller = new AbortController();

    const fetchAllJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await api.get("/job/get", {
          params : { keyword: searchedQuery || "" },
          signal : controller.signal,          // important for abort
        });

        if (data.success) {
          dispatch(setAllJobs(data.jobs));
        } else {
          setError(data.message || "Unknown error");
        }
      } catch (err) {
        // Ignore abort errors
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error(err);
          setError(
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch jobs"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();

    // Cleanup: cancel request if component unmounts or query changes quickly
    return () => controller.abort();
  }, [searchedQuery, dispatch]);

  // ⬇️ Hook returns flags so callers can show UI feedback
  return { loading, error };
};

export default useGetAllJobs;
