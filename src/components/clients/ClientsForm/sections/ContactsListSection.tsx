import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContactsTable } from "../ContactsTable";
import type { Contact } from "@/types/company";

interface ContactsListSectionProps {
  contacts: Contact[];
  filteredContacts: Contact[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddContact: () => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contactId: number, contactName: string) => void;
  isDeleting: boolean;
}

export function ContactsListSection({
  contacts,
  filteredContacts,
  searchTerm,
  onSearchChange,
  onAddContact,
  onEditContact,
  onDeleteContact,
  isDeleting,
}: ContactsListSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Contatos Cadastrados</CardTitle>
            <CardDescription>
              Lista de todos os contatos vinculados a este cliente
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            {contacts.length > 0 && (
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Pesquisar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
            <Button
              type="button"
              onClick={onAddContact}
              className="bg-yellow-500 hover:bg-yellow-400 hover:cursor-pointer whitespace-nowrap text-black"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Contato
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum contato cadastrado ainda.</p>
            <p className="text-sm mt-2">
              Clique em "Adicionar Contato" para incluir o primeiro contato.
            </p>
          </div>
        ) : (
          <ContactsTable
            contacts={filteredContacts}
            onEditContact={onEditContact}
            onDeleteContact={onDeleteContact}
            isDeleting={isDeleting}
          />
        )}
      </CardContent>
    </Card>
  );
}
