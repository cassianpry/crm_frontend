import { useEffect, useState } from "react";

export function useClientsSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 1500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearch,
  };
}
