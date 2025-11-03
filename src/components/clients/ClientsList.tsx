import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import PaginationFooter from "@/components/Layout/PaginationFooter";
import { useCompanies } from "@/hooks/queries/useCompanies";
import type { Company } from "@/types/company";

// Components
import { LoadingState } from "./ClientsList/LoadingState";
import { ErrorState } from "./ClientsList/ErrorState";
import { ClientsSearchBar } from "./ClientsList/ClientsSearchBar";
import { ClientsTableHeader } from "./ClientsList/ClientsTableHeader";
import { ClientsTableRow } from "./ClientsList/ClientsTableRow";
import { DeleteConfirmDialog } from "./ClientsList/DeleteConfirmDialog";
import { useClientsSearch } from "@/hooks/Clients/useClientsSearch";
import { useClientsSort } from "@/hooks/Clients/useClientsSort";
import { useDeleteDialog } from "@/hooks/Clients/useDeleteDialog";

// Hooks

const DEFAULT_PAGE_SIZE = 10;

const ClientsList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Custom hooks
  const { searchTerm, setSearchTerm, debouncedSearch } = useClientsSearch();
  const { handleSort, getSortState, sortCompanies } = useClientsSort();
  const {
    deleteDialog,
    setDeleteDialog,
    handleDeleteClick,
    handleConfirmDelete,
    closeDeleteDialog,
    isDeleting,
  } = useDeleteDialog();

  // Data fetching
  const {
    data: companiesData,
    isLoading,
    error,
    isFetching,
  } = useCompanies({ page, pageSize, search: debouncedSearch });

  const companies = companiesData?.data ?? [];
  const meta = companiesData?.meta;
  const sortedCompanies = sortCompanies(companies);

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <Card>
      <CardHeader>
        <ClientsSearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <ClientsTableHeader
              onSort={handleSort}
              getSortState={getSortState}
            />
            <TableBody>
              {sortedCompanies.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchTerm
                      ? "Nenhum cliente encontrado com os critérios de pesquisa."
                      : "Nenhum cliente cadastrado."}
                  </TableCell>
                </TableRow>
              ) : (
                sortedCompanies.map((company: Company) => (
                  <ClientsTableRow
                    key={company.id}
                    company={company}
                    onDeleteClick={handleDeleteClick}
                    isDeleting={isDeleting}
                  />
                ))
              )}
            </TableBody>
          </Table>
          {isFetching && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
      <CardContent>
        <PaginationFooter
          page={page}
          totalPages={meta?.totalPages ?? 0}
          totalItems={meta?.totalItems ?? 0}
          pageSize={pageSize}
          onPageChange={(newPage) => {
            const safeTotalPages = meta?.totalPages ?? 1;
            const clampedPage = Math.min(
              Math.max(newPage, 1),
              Math.max(safeTotalPages, 1)
            );
            setPage(clampedPage);
          }}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(1);
          }}
          pageSizeOptions={[10, 20, 50]}
          isLoading={isFetching}
        />
      </CardContent>

      <DeleteConfirmDialog
        deleteDialog={deleteDialog}
        onOpenChange={(open) =>
          setDeleteDialog({ open, company: deleteDialog.company })
        }
        onConfirmDelete={handleConfirmDelete}
        onCancel={closeDeleteDialog}
        isDeleting={isDeleting}
      />
    </Card>
  );
};

export default ClientsList;
