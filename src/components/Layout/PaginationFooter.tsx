import { Button } from "@/components/ui/button";

interface PaginationFooterProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  disablePrevious?: boolean;
  disableNext?: boolean;
}

const PaginationFooter = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  isLoading = false,
  disablePrevious,
  disableNext,
}: PaginationFooterProps) => {
  const safeTotalPages = Math.max(totalPages, 1);
  const previousDisabled =
    disablePrevious !== undefined ? disablePrevious : page <= 1 || isLoading;
  const nextDisabled =
    disableNext !== undefined
      ? disableNext
      : page >= safeTotalPages || isLoading;
  const options = pageSizeOptions ?? [10, 20, 50];

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <span className="text-sm text-muted-foreground">
          Página {page} de {safeTotalPages} • {totalItems} resultados (até {pageSize} por página)
        </span>
        {onPageSizeChange && options.length > 0 && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Itens por página
            <select
              className="rounded-md border border-input bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              disabled={isLoading}
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="hover:bg-yellow-400 hover:cursor-pointer bg-yellow-500"
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={previousDisabled}
        >
          Anterior
        </Button>
        <span className="text-sm font-medium">
          {page} / {safeTotalPages}
        </span>
        <Button
          variant="outline"
          className="hover:cursor-pointer bg-yellow-500 hover:bg-yellow-400"
          onClick={() => onPageChange(Math.min(page + 1, safeTotalPages))}
          disabled={nextDisabled}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

export default PaginationFooter;
