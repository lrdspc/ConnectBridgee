import { useParams, useLocation } from "wouter";
import Header from "../../components/Layout/Header";
import { RoofInspectionForm } from "../../components/inspections/RoofInspectionForm";
import { useToast } from "@/hooks/use-toast";

const RoofInspectionPage = () => {
  const { visitId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleInspectionComplete = (inspectionId: string) => {
    toast({
      title: "Inspeção concluída",
      description: "A inspeção de telhado foi registrada com sucesso!",
    });
    
    // Redirecionar para a página de visitas ou detalhes da visita
    if (visitId) {
      setLocation(`/visits/${visitId}`);
    } else {
      setLocation("/visits");
    }
  };

  return (
    <div className="page page-transition">
      <Header 
        title="Inspeção de Telhado" 
        showBackButton={true} 
      />
      
      <div className="p-4 pb-20">
        <RoofInspectionForm 
          visitId={visitId} 
          onComplete={handleInspectionComplete}
        />
      </div>
    </div>
  );
};

export default RoofInspectionPage;