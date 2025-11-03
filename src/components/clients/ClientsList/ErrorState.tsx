import { Card, CardContent } from "@/components/ui/card";

export function ErrorState() {
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
