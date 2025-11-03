import { Loader2, Mail, Pencil, Phone, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Contact } from "@/types/company";

interface ContactsTableProps {
  contacts: Contact[];
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contactId: number, contactName: string) => void;
  isDeleting: boolean;
}

export function ContactsTable({
  contacts,
  onEditContact,
  onDeleteContact,
  isDeleting,
}: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum contato encontrado com os critérios de pesquisa.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </div>
            </TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="hover:bg-yellow-100">
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>
                {contact.phone ? String(contact.phone) : "-"}
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
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    className="hover:cursor-pointer hover:bg-yellow-400!"
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditContact(contact)}
                    title="Editar contato"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    className="hover:bg-red-300! text-red-500! hover:cursor-pointer"
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isDeleting}
                    onClick={() => onDeleteContact(contact.id!, contact.name)}
                    title="Excluir contato"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
