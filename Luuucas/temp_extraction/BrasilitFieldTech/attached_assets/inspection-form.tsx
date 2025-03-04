import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInspectionSchema, type InsertInspection } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Constantes e dados de configuração
const constructionTypes = ["Residencial", "Comercial", "Industrial", "Outro"];
const regions = {
  "Sul": ["PR", "SC", "RS"],
  "Sudeste": ["SP", "RJ", "MG", "ES"],
  "Norte": ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
  "Nordeste": ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
  "Centro-Oeste": ["DF", "GO", "MT", "MS"]
};

const roofIssues = [
  "Armazenagem Incorreta",
  "Carga Permanente sobre as Telhas",
  "Corte de Canto Incorreto ou Ausente",
  // ... outros problemas
];

export function InspectionForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [photos, setPhotos] = useState<Record<string, string[]>>({});
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const form = useForm<InsertInspection>({
    resolver: zodResolver(insertInspectionSchema.partial()),
    defaultValues: {
      technicianId: user?.id || 1,
      clientName: "",
      dateInspected: new Date(),
      // ... outros campos
    },
  });

  const onSubmit = async (data: InsertInspection) => {
    try {
      const inspection = {
        ...data,
        technicianId: user?.id || 1,
        dateInspected: data.dateInspected || new Date(),
        issues: selectedIssues,
        photos: Object.values(photos).flat(),
      };

      const localId = await saveInspection(inspection);
      
      if (localId) {
        await queryClient.invalidateQueries({ queryKey: ["inspections"] });
        toast({
          title: "Vistoria salva com sucesso",
          description: "A vistoria foi salva localmente.",
        });
        setLocation('/inspections');
      }
    } catch (error) {
      console.error("Erro ao salvar vistoria:", error);
      toast({
        title: "Erro ao salvar vistoria",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar a vistoria.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Campos do formulário aqui */}
      </form>
    </Form>
  );
}
