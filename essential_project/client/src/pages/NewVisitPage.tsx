import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "../components/layout/Header";
import { useVisits } from "../hooks/useVisits";
import { checklistTemplates, Visit, VisitType, VisitPriority } from "../lib/db";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type FormData = {
  clientName: string;
  address: string;
  date: string;
  time: string;
  type: VisitType;
  priority: VisitPriority;
  contactInfo: string;
  description: string;
  checklistTemplate: string;
};

const initialFormData: FormData = {
  clientName: "",
  address: "",
  date: new Date().toISOString().split("T")[0], // Today's date as default
  time: "",
  type: "installation",
  priority: "normal",
  contactInfo: "",
  description: "",
  checklistTemplate: "none"
};

const NewVisitPage = () => {
  const [, setLocation] = useLocation();
  const { createVisit } = useVisits();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when it's changed
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when it's changed
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.clientName.trim()) errors.clientName = "Nome do cliente é obrigatório";
    if (!formData.address.trim()) errors.address = "Endereço é obrigatório";
    if (!formData.date) errors.date = "Data é obrigatória";
    if (!formData.type) errors.type = "Tipo de visita é obrigatório";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a new visit with the form data
      const newVisit: Omit<Visit, "id"> = {
        clientName: formData.clientName,
        address: formData.address,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        status: "scheduled",
        priority: formData.priority,
        description: formData.description,
        contactInfo: formData.contactInfo,
        checklist: (formData.checklistTemplate && formData.checklistTemplate !== "none") ? 
          [...checklistTemplates[formData.checklistTemplate as keyof typeof checklistTemplates]] : 
          [],
        photos: [],
        documents: [],
        notes: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        synced: false
      };
      
      await createVisit.mutateAsync(newVisit);
      
      toast({
        title: "Visita criada",
        description: "A visita foi agendada com sucesso!",
      });
      
      // Navigate to visits list
      setLocation("/visits");
    } catch (error) {
      console.error("Error creating visit:", error);
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a visita. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // This would typically use a reverse geocoding service
          // to convert coordinates to an address
          // For now, we'll just show the coordinates
          setFormData(prev => ({
            ...prev,
            address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
          }));
        },
        (error) => {
          console.error("Geolocation error:", error);
          
          toast({
            title: "Erro de localização",
            description: "Não foi possível obter sua localização atual.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="page page-transition" id="newVisit">
      <Header title="Nova Visita" showBackButton={true} />

      <div className="p-4">
        <form id="newVisitForm" onSubmit={handleSubmit}>
          <Card className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="mb-4">
              <Label htmlFor="clientName" className="block text-sm font-medium text-neutral-700 mb-1">
                Nome do Cliente*
              </Label>
              <Input
                type="text"
                id="clientName"
                name="clientName"
                className={`w-full border ${formErrors.clientName ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}
                placeholder="Nome do cliente ou empresa"
                value={formData.clientName}
                onChange={handleInputChange}
                required
              />
              {formErrors.clientName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.clientName}</p>
              )}
            </div>
            
            <div className="mb-4">
              <Label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                Endereço*
              </Label>
              <Input
                type="text"
                id="address"
                name="address"
                className={`w-full border ${formErrors.address ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}
                placeholder="Endereço completo"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              <Button
                type="button"
                variant="link"
                size="sm"
                className="mt-2 text-primary text-sm p-0 flex items-center"
                onClick={handleGetCurrentLocation}
              >
                <MapPin className="mr-1 h-4 w-4" />
                Usar localização atual
              </Button>
              {formErrors.address && (
                <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="date" className="block text-sm font-medium text-neutral-700 mb-1">
                  Data*
                </Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  className={`w-full border ${formErrors.date ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.date && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>
                )}
              </div>
              <div>
                <Label htmlFor="time" className="block text-sm font-medium text-neutral-700 mb-1">
                  Hora
                </Label>
                <Input
                  type="time"
                  id="time"
                  name="time"
                  className="w-full border border-neutral-300 rounded-lg p-3 text-sm"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1">
                Tipo de Visita*
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className="w-full border border-neutral-300 rounded-lg p-3 text-sm">
                  <SelectValue placeholder="Selecione o tipo de visita" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="installation">Instalação</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                  <SelectItem value="inspection">Inspeção</SelectItem>
                  <SelectItem value="repair">Reparo</SelectItem>
                  <SelectItem value="emergency">Emergência</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.type && (
                <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>
              )}
            </div>
            
            <div className="mb-4">
              <Label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-1">
                Prioridade
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange("priority", value as VisitPriority)}
              >
                <SelectTrigger className="w-full border border-neutral-300 rounded-lg p-3 text-sm">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="contactInfo" className="block text-sm font-medium text-neutral-700 mb-1">
                Informações de Contato
              </Label>
              <Input
                type="text"
                id="contactInfo"
                name="contactInfo"
                className="w-full border border-neutral-300 rounded-lg p-3 text-sm"
                placeholder="Nome e telefone do contato"
                value={formData.contactInfo}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                Descrição
              </Label>
              <Textarea
                id="description"
                name="description"
                className="w-full border border-neutral-300 rounded-lg p-3 text-sm h-24"
                placeholder="Detalhes adicionais sobre a visita..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </Card>
          
          <div className="mb-4">
            <h2 className="font-semibold mb-3">Modelo de Checklist</h2>
            <Card className="bg-white rounded-xl p-4 shadow-sm">
              <Select
                value={formData.checklistTemplate}
                onValueChange={(value) => handleSelectChange("checklistTemplate", value)}
              >
                <SelectTrigger className="w-full border border-neutral-300 rounded-lg p-3 text-sm">
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="installation">Instalação de Telhas</SelectItem>
                  <SelectItem value="maintenance">Manutenção Preventiva</SelectItem>
                  <SelectItem value="inspection">Inspeção de Infiltração</SelectItem>
                  <SelectItem value="repair">Reparo</SelectItem>
                  <SelectItem value="quality">Controle de Qualidade</SelectItem>
                  <SelectItem value="vistoriafar">Vistoria Técnica FAR</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          </div>
          
          <Button
            type="submit"
            className="bg-primary text-white py-3 px-4 rounded-lg w-full flex items-center justify-center mb-8 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Salvando...
              </>
            ) : (
              <>
                <span className="mr-2">💾</span>
                Salvar Visita
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewVisitPage;
