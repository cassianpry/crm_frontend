import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2,
  Pencil,
  Trash2,
  FileText,
  Building2,
  Briefcase,
  Factory,
  MapPin,
  User,
  Settings,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { formatCNPJ } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PaginationFooter from "@/components/Layout/PaginationFooter";
import { useCompanies, useDeleteCompany } from "@/hooks/queries/useCompanies";
import type { Company } from "@/types/company";

type SortField =
  | "cnpj"
  | "nomeFantasia"
  | "razaoSocial"
  | "industria"
  | "cidade";
type SortOrder = "asc" | "desc" | null;

const DEFAULT_PAGE_SIZE = 10;

const ClientsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 1500);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  const {
    data: companiesData,
    isLoading,
    error,
    isFetching,
  } = useCompanies({ page, pageSize, search: debouncedSearch });
  const companies = companiesData?.data ?? [];
  const meta = companiesData?.meta;
  const deleteCompany = useDeleteCompany();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    company: { id: number; nomeFantasia: string } | null;
  }>({ open: false, company: null });

  const handleDeleteClick = (id: number, nomeFantasia: string) => {
    setDeleteDialog({ open: true, company: { id, nomeFantasia } });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.company) return;

    try {
      await deleteCompany.mutateAsync(deleteDialog.company.id);
      setDeleteDialog({ open: false, company: null });
      toast.success("Cliente excluído com sucesso!", {
        description: `${deleteDialog.company.nomeFantasia} foi removido do sistema.`,
      });
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast.error("Erro ao excluir cliente", {
        description: "Não foi possível excluir o cliente. Tente novamente.",
      });
    }
  };

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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    if (sortOrder === "asc") {
      return <ArrowUp className="h-4 w-4" />;
    }
    if (sortOrder === "desc") {
      return <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  };

  // Filtra e ordena os clientes
  const sortedCompanies =
    sortField && sortOrder
      ? [...companies].sort((a, b) => {
          let aValue = a[sortField];
          let bValue = b[sortField];

          if (sortField === "cidade") {
            aValue = `${a.cidade}/${a.estado}`;
            bValue = `${b.cidade}/${b.estado}`;
          }

          if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
          if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
          return 0;
        })
      : companies;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-red-500">
            Erro ao carregar clientes. Tente novamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <div className="relative w-full md:w-80 md:ml-auto">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Pesquisar por nome, CNPJ ou razão social..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort("nomeFantasia")}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <Building2 className="h-4 w-4" />
                    Nome Fantasia
                    {getSortIcon("nomeFantasia")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("razaoSocial")}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <Briefcase className="h-4 w-4" />
                    Razão Social
                    {getSortIcon("razaoSocial")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("cnpj")}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    CNPJ
                    {getSortIcon("cnpj")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("industria")}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <Factory className="h-4 w-4" />
                    Indústria
                    {getSortIcon("industria")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("cidade")}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    Cidade/Estado
                    {getSortIcon("cidade")}
                  </button>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Contato
                  </div>
                </TableHead>
                <TableHead className="text-right sticky right-0 bg-background z-20 shadow-[0_0_0_1px_var(--border)]">
                  <div className="flex items-center justify-end gap-2">
                    <Settings className="h-4 w-4" />
                    Ações
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
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
                  <TableRow key={company.id} className="hover:bg-yellow-100">
                    <TableCell>{company.nomeFantasia}</TableCell>
                    <TableCell>{company.razaoSocial}</TableCell>
                    <TableCell className="font-medium">
                      {formatCNPJ(company.cnpj)}
                    </TableCell>
                    <TableCell>{company.industria}</TableCell>
                    <TableCell>
                      {company.cidade}/{company.estado}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {company.contacts[0]?.name || "-"}
                        </div>
                        {company.contacts[0]?.phone && (
                          <div className="text-muted-foreground">
                            {company.contacts[0].phone}
                          </div>
                        )}
                        <div className="text-muted-foreground text-xs">
                          {company.contacts[0]?.email || "-"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right sticky right-0 bg-background z-10 shadow-[0_0_0_1px_var(--border)]">
                      <div className="flex justify-end gap-2">
                        <Button
                          className="hover:cursor-pointer hover:bg-yellow-400"
                          variant="ghost"
                          size="icon"
                          title="Editar"
                          onClick={() =>
                            navigate(`/clientes/${company.id}/editar`)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          className="hover:cursor-pointer hover:bg-red-300"
                          variant="ghost"
                          size="icon"
                          title="Excluir"
                          onClick={() =>
                            handleDeleteClick(company.id, company.nomeFantasia)
                          }
                          disabled={deleteCompany.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
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

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, company: deleteDialog.company })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente{" "}
              <span className="font-semibold">
                {deleteDialog.company?.nomeFantasia}
              </span>
              ? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteDialog({ open: false, company: null })}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteCompany.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ClientsList;
