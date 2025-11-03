import { useState } from "react";
import type { Company, SortField, SortOrder } from "@/types/company";

export function useClientsSort() {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Ciclo: asc -> desc -> null
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortOrder(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortState = (field: SortField) => {
    if (sortField !== field) {
      return "none";
    }
    if (sortOrder === "asc") {
      return "asc";
    }
    if (sortOrder === "desc") {
      return "desc";
    }
    return "none";
  };

  const sortCompanies = (companies: Company[]) => {
    if (!sortField || !sortOrder) return companies;

    return [...companies].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "cidade") {
        aValue = `${a.cidade}/${a.estado}`;
        bValue = `${b.cidade}/${b.estado}`;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  return {
    sortField,
    sortOrder,
    handleSort,
    getSortState,
    sortCompanies,
  };
}
