import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import Header from "../components/layout/Header";
import ChecklistItem from "../components/visits/ChecklistItem";
import { GenerateReportModal } from "../components/visits/GenerateReportModal";
import { useVisits } from "../hooks/useVisits";
import { Visit, VisitStatus, VisitPhoto, ChecklistItem as ChecklistItemType } from "../lib/db";
import { 
  Play, 
  Calendar, 
  CheckCircle, 
  Camera, 
  Expand,
  AlertTriangle,
  FileText,
  Navigation,
  MapPin
} from "lucide-react";
import { gerarLinkGoogleMaps, gerarLinkWaze } from "../lib/geocoding";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { syncVisitsToServer } from "../lib/sync";
import { useOfflineStatus } from "../hooks/useOfflineStatus";
import { formatDate } from "../lib/utils";

const VisitDetailsPage = () => {
  const [, params] = useRoute("/visits/:id");
  const [, setLocation] = useLocation();
  const { getVisit, updateVisit } = useVisits();
  const { isOffline } = useOfflineStatus();
  
  const [visit, setVisit] = useState<Visit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<VisitPhoto | null>(null);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const loadVisit = async () => {
      if (params && params.id) {
        const visitData = await getVisit(params.id);
        if (visitData) {
          setVisit(visitData);
          setNotes(visitData.notes || "");
        } else {
          // Visit not found, redirect to visits list
          setLocation("/visits");
        }
      }
      setIsLoading(false);
    };

    loadVisit();
  }, [params, getVisit, setLocation]);

  const handleStartVisit = async () => {
    if (!visit) return;
    
    const updatedVisit: Visit = {
      ...visit,
      status: "in-progress",
      updatedAt: new Date().toISOString(),
      synced: false
    };
    
    await updateVisit.mutateAsync(updatedVisit);
    setVisit(updatedVisit);
    
    // Try to sync if online
    if (!isOffline) {
      syncVisitsToServer([updatedVisit]).catch(console.error);
    }
  };

  const handleCompleteVisit = async () => {
    if (!visit) return;
    
    const updatedVisit: Visit = {
      ...visit,
      status: "completed",
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes,
      synced: false
    };
    
    await updateVisit.mutateAsync(updatedVisit);
    setVisit(updatedVisit);
    
    // Try to sync if online
    if (!isOffline) {
      syncVisitsToServer([updatedVisit]).catch(console.error);
    }
    
    // Navigate back to visits list
    setLocation("/visits");
  };

  const handleRescheduleVisit = () => {
    // Would typically open a dialog for rescheduling
    alert("Funcionalidade de reagendamento será implementada em breve!");
  };

  const handleChecklistItemChange = async (itemId: string, completed: boolean) => {
    if (!visit || !visit.checklist) return;
    
    const updatedChecklist = visit.checklist.map(item => 
      item.id === itemId ? { ...item, completed } : item
    );
    
    const updatedVisit: Visit = {
      ...visit,
      checklist: updatedChecklist,
      updatedAt: new Date().toISOString(),
      synced: false
    };
    
    await updateVisit.mutateAsync(updatedVisit);
    setVisit(updatedVisit);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleOpenCamera = () => {
    // Would typically open the device camera for photo capture
    alert("Funcionalidade de câmera será implementada em breve!");
  };

  const handleOpenPhoto = (photo: VisitPhoto) => {
    setSelectedPhoto(photo);
    setShowPhotoDialog(true);
  };

  const handleOpenMap = () => {
    // Usa as novas funções para abrir o Google Maps usando o endereço
    if (visit && visit.address) {
      window.open(gerarLinkGoogleMaps(visit.address), '_blank');
    }
  };
  
  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100">
        <Header title="Carregando..." showBackButton={true} />
        <div className="p-4 animate-pulse">
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="h-6 bg-neutral-200 rounded w-40 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="min-h-screen bg-neutral-100">
        <Header title="Erro" showBackButton={true} />
        <div className="p-4">
          <Card className="p-4">
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Visita não encontrada</h2>
              <p className="text-neutral-600 mb-4">
                A visita solicitada não existe ou foi removida.
              </p>
              <Button onClick={() => setLocation("/visits")}>
                Voltar para Lista de Visitas
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const formattedDate = formatDate(new Date(visit.date), "DD/MM/YYYY");
  const statusText = 
    visit.status === "scheduled" ? "Agendada" :
    visit.status === "in-progress" ? "Em Andamento" :
    visit.status === "pending" ? "Pendente" :
    visit.status === "completed" ? "Concluída" :
    visit.status === "urgent" ? "Urgente" : "Desconhecido";
  
  const statusColorClass = 
    visit.status === "scheduled" ? "bg-success bg-opacity-10 text-success" :
    visit.status === "in-progress" ? "bg-info bg-opacity-10 text-info" :
    visit.status === "pending" ? "bg-warning bg-opacity-10 text-warning" :
    visit.status === "completed" ? "bg-primary bg-opacity-10 text-primary" :
    visit.status === "urgent" ? "bg-error bg-opacity-10 text-error" :
    "bg-neutral-200 text-neutral-700";

  const typeText = 
    visit.type === "installation" ? "Instalação" :
    visit.type === "maintenance" ? "Manutenção" :
    visit.type === "inspection" ? "Inspeção" :
    visit.type === "repair" ? "Reparo" :
    visit.type === "emergency" ? "Emergência" : "Outro";

  return (
    <div className="page page-transition" id="visitDetails">
      <Header 
        title={visit.clientName} 
        showBackButton={true} 
        address={visit.address}
        onMapOpen={handleOpenMap}
      />

      <div className="p-4">
        {/* Visit Info Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Informações da Visita</h2>
            <span className={`${statusColorClass} text-xs px-2 py-1 rounded-full`}>
              {statusText}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">Data:</span>
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">Horário:</span>
              <span className="text-sm font-medium">{visit.time || "Não definido"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">Tipo:</span>
              <span className="text-sm font-medium">{typeText}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">Prioridade:</span>
              <span className={`text-sm font-medium ${
                visit.priority === "urgent" ? "text-error" :
                visit.priority === "high" ? "text-warning" :
                "text-primary"
              }`}>
                {visit.priority === "urgent" ? "Urgente" :
                 visit.priority === "high" ? "Alta" :
                 "Normal"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">Contato:</span>
              <span className="text-sm font-medium">{visit.contactInfo || "Não definido"}</span>
            </div>
          </div>
          
          {visit.description && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm text-neutral-600">{visit.description}</p>
            </div>
          )}
        </div>
        
        {/* Visit Actions */}
        <div className="flex space-x-2 mb-4">
          {visit.status === "scheduled" || visit.status === "pending" ? (
            <>
              <Button 
                className="bg-primary text-white py-2 px-4 rounded-lg w-1/2 flex items-center justify-center" 
                onClick={handleStartVisit}
              >
                <Play className="mr-2 h-4 w-4" />
                Iniciar Visita
              </Button>
              <Button 
                className="bg-neutral-200 text-neutral-700 py-2 px-4 rounded-lg w-1/2 flex items-center justify-center" 
                variant="outline"
                onClick={handleRescheduleVisit}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Reagendar
              </Button>
            </>
          ) : visit.status === "in-progress" ? (
            <Button 
              className="bg-success text-white py-2 px-4 rounded-lg w-full flex items-center justify-center" 
              onClick={handleCompleteVisit}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Finalizar Visita
            </Button>
          ) : null}
        </div>
        
        {/* Checklist Section */}
        {visit.checklist && visit.checklist.length > 0 && (
          <div className="mb-4">
            <h2 className="font-semibold mb-3">Checklist de Inspeção</h2>
            
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              {visit.checklist.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  onChange={handleChecklistItemChange}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Photo Documentation Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Documentação Fotográfica</h2>
            <button 
              className="text-primary text-sm flex items-center"
              onClick={handleOpenCamera}
            >
              <Camera className="mr-1 h-4 w-4" />
              Adicionar
            </button>
          </div>
          
          {visit.photos && visit.photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {visit.photos.map((photo) => (
                <div 
                  key={photo.id}
                  className="aspect-square bg-neutral-200 rounded-lg relative overflow-hidden"
                  onClick={() => handleOpenPhoto(photo)}
                >
                  <img 
                    src={photo.dataUrl} 
                    alt="Foto da visita" 
                    className="object-cover w-full h-full"
                  />
                  <button className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 text-xs">
                    <Expand className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <p className="text-neutral-500 text-sm">Nenhuma foto adicionada</p>
            </div>
          )}
        </div>
        
        {/* Notes Section */}
        <div className="mb-4">
          <h2 className="font-semibold mb-3">Anotações</h2>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Textarea
              className="w-full border border-neutral-300 rounded-lg p-3 h-24 text-sm"
              placeholder="Adicione observações sobre a visita..."
              value={notes}
              onChange={handleNotesChange}
            />
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <a 
            href={gerarLinkGoogleMaps(visit.address)}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium"
          >
            <MapPin className="mr-2 h-5 w-5" />
            Google Maps
          </a>
          <a 
            href={gerarLinkWaze(visit.address)}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-sky-500 hover:bg-sky-600 text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium"
          >
            <Navigation className="mr-2 h-5 w-5" />
            Waze
          </a>
        </div>
            
        {/* Report Button */}
        <div className="mb-4">
          <Button 
            className="bg-primary text-white py-3 px-4 rounded-lg w-full flex items-center justify-center font-medium" 
            onClick={handleGenerateReport}
          >
            <FileText className="mr-2 h-5 w-5" />
            Gerar Relatório em Word
          </Button>
        </div>
        
        {/* Complete Visit Button */}
        {visit.status === "in-progress" && (
          <Button 
            className="bg-success text-white py-3 px-4 rounded-lg w-full flex items-center justify-center mb-8 font-medium" 
            onClick={handleCompleteVisit}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Finalizar Visita
          </Button>
        )}
      </div>

      {/* Photo Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="max-w-md mx-auto p-0 overflow-hidden">
          {selectedPhoto && (
            <div className="relative">
              <img 
                src={selectedPhoto.dataUrl} 
                alt="Foto ampliada" 
                className="w-full"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3">
                <p className="text-sm">{selectedPhoto.notes || "Sem descrição"}</p>
                <p className="text-xs text-neutral-300 mt-1">
                  {new Date(selectedPhoto.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <DialogClose className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2">
            &times;
          </DialogClose>
        </DialogContent>
      </Dialog>
      
      {/* Report Generation Modal */}
      {visit && (
        <GenerateReportModal
          visit={visit}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};

export default VisitDetailsPage;
