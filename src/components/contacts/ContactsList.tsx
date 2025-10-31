import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Building2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Settings,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useContacts, useDeleteContact } from "@/hooks/queries/useContacts";
import type { Contact } from "@/types/company";
import { Button } from "../ui/button";
import { formatPhone } from "@/lib/formatters";
import PaginationFooter from "@/components/Layout/PaginationFooter";
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
import { toast } from "sonner";

const DEFAULT_PAGE_SIZE = 10;

type SortField = "name" | "email" | "phone" | "company";
type SortOrder = "asc" | "desc" | null;

interface ContactsListProps {
  onEditContact: (contactId: number) => void;
}

const ContactsList = ({ onEditContact }: ContactsListProps) => {
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
    data: contactsData,
    isLoading,
    error,
    isFetching,
  } = useContacts({
    page,
    pageSize,
    search: debouncedSearch,
  });
  const contacts: Contact[] = useMemo(
    () => contactsData?.data ?? [],
    [contactsData],
  );
  const meta = contactsData?.meta;
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    contact: { id: number; name: string } | null;
  }>({ open: false, contact: null });
  const deleteContact = useDeleteContact();

  const handleEditClick = (contactId?: number) => {
    if (typeof contactId !== "number") {
      return;
    }
    onEditContact(contactId);
  };

  const handleDeleteClick = (contact: Contact) => {
    if (typeof contact.id !== "number") {
      return;
    }
    setDeleteDialog({
      open: true,
      contact: { id: contact.id, name: contact.name },
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.contact) {
      return;
    }

    try {
      await deleteContact.mutateAsync(deleteDialog.contact.id);
      toast.success("Contato desativado com sucesso!", {
        description: `${deleteDialog.contact.name} foi removido da lista ativa.`,
      });
      setDeleteDialog({ open: false, contact: null });
    } catch (deleteError) {
      console.error("Erro ao excluir contato:", deleteError);
      toast.error("Erro ao excluir contato", {
        description: "Não foi possível remover o contato. Tente novamente.",
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

  // Filtra e ordena os contatos
  const filteredContacts = useMemo(() => {
    const search = debouncedSearch.toLowerCase();
    if (!search) {
      return contacts;
    }

    return contacts.filter((contact: Contact) => {
      const normalizedPhone = contact.phone
        ? contact.phone.toString().toLowerCase()
        : "";
      const normalizedCompanyName = contact.company?.nomeFantasia
        ? contact.company.nomeFantasia.toLowerCase()
        : "";

      return (
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        normalizedPhone.includes(search) ||
        normalizedCompanyName.includes(search)
      );
    });
  }, [contacts, debouncedSearch]);

  const sortedContacts = useMemo(() => {
    if (!sortField || !sortOrder) {
      return filteredContacts;
    }

    return [...filteredContacts].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      if (sortField === "company") {
        aValue = a.company?.nomeFantasia || "";
        bValue = b.company?.nomeFantasia || "";
      } else {
        const aFieldValue = a[sortField];
        const bFieldValue = b[sortField];

        aValue =
          typeof aFieldValue === "number"
            ? aFieldValue.toString()
            : aFieldValue ?? "";
        bValue =
          typeof bFieldValue === "number"
            ? bFieldValue.toString()
            : bFieldValue ?? "";
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredContacts, sortField, sortOrder]);

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
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-red-500">Erro ao carregar contatos</p>
        </CardContent>
      </Card>
    );
  }

  if (!isFetching && (meta?.totalItems ?? 0) === 0 && !debouncedSearch) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contatos</CardTitle>
          <CardDescription>Nenhum contato cadastrado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Nenhum contato cadastrado ainda.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <div className="flex items-center gap-3 md:ml-auto">
            <div className="relative w-full md:w-80 md:ml-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Pesquisar por nome, email, telefone ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Nome
                    {getSortIcon("name")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("email")}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                    {getSortIcon("email")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("phone")}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Telefone
                    {getSortIcon("phone")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("company")}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <Building2 className="h-4 w-4" />
                    Empresa
                    {getSortIcon("company")}
                  </button>
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right sticky right-0 bg-background z-20 shadow-[0_0_0_1px_var(--border)]">
                  <div className="flex items-center justify-end gap-2">
                    <Settings className="h-4 w-4" />
                    Ações
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedContacts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {debouncedSearch
                      ? "Nenhum contato encontrado com os critérios de pesquisa."
                      : "Nenhum contato cadastrado."}
                  </TableCell>
                </TableRow>
              ) : (
                sortedContacts.map((contact: Contact) => (
                  <TableRow key={contact.id} className="hover:bg-yellow-100">
                    <TableCell className="font-medium">
                      {contact.name}
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>
                      {contact.phone ? formatPhone(String(contact.phone)) : "-"}
                    </TableCell>
                    <TableCell>
                      {contact.company ? (
                        <div className="text-sm">
                          <div className="font-medium">
                            {contact.company.nomeFantasia}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {contact.company.razaoSocial}
                          </div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          contact.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {contact.isActive ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right sticky right-0 bg-background z-10 shadow-[0_0_0_1px_var(--border)]">
                      <div className="flex justify-end gap-2">
                        <Button
                          className="hover:cursor-pointer hover:bg-yellow-400"
                          variant="ghost"
                          size="icon"
                          title="Editar"
                          onClick={() => handleEditClick(contact.id)}
                          disabled={typeof contact.id !== "number"}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          className="hover:cursor-pointer hover:bg-red-300"
                          variant="ghost"
                          size="icon"
                          title="Excluir"
                          onClick={() => handleDeleteClick(contact)}
                          disabled={deleteContact.isPending}
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
          setDeleteDialog((prev) => ({
            open,
            contact: open ? prev.contact : null,
          }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar contato?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.contact
                ? `Tem certeza de que deseja desativar ${deleteDialog.contact.name}?`
                : "Tem certeza de que deseja desativar este contato?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteContact.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteContact.isPending}
              className="bg-red-500 text-white hover:bg-red-400"
            >
              {deleteContact.isPending ? "Removendo..." : "Sim, desativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ContactsList;
