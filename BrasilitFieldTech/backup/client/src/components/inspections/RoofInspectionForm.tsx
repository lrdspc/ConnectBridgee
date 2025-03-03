import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  inspectionSchema, 
  constructionTypes, 
  tileModels, 
  roofIssues, 
  regions,
  type Inspection,
  type TileSpec
} from "../../shared/inspectionSchema";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { X, Plus, Calendar, Camera, Save } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface RoofInspectionFormProps {
  visitId?: string;
  onComplete?: (inspectionId: string) => void;
}

export function RoofInspectionForm({ visitId, onComplete }: RoofInspectionFormProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Record<string, {id: string; dataUrl: string; notes?: string}[]>>({
    tiles: [],
    issues: [],
    general: []
  });
  
  // Estado para as especificações de telhas
  const [tileSpecs, setTileSpecs] = useState<TileSpec[]>([
    { 
      id: uuidv4(), 
      model: tileModels[0], 
      thickness: "", 
      dimensions: "", 
      count: "" 
    }
  ]);

  // Configuração do formulário com validação Zod
  const form = useForm<Inspection>({
    resolver: zodResolver(inspectionSchema.omit({ 
      id: true, 
      issues: true, 
      photos: true, 
      tileSpecs: true,
      createdAt: true,
      updatedAt: true,
      synced: true
    })),
    defaultValues: {
      visitId,
      clientName: "",
      dateInspected: new Date(),
      constructionType: constructionTypes[0],
      customConstructionType: "",
      address: "",
      city: "",
      inspectionSubject: "",
      protocolNumber: "",
      technicianId: "1", // ID do usuário logado
      technicianName: "Carlos Silva", // Nome do usuário logado
      department: "Assistência Técnica",
      unit: "Unidade São Paulo",
      region: "Sudeste",
      coordinatorName: "",
      managerName: "",
      conclusion: "",
      recommendations: ""
    },
  });

  // Manipulador para adicionar uma nova especificação de telha
  const handleAddTileSpec = () => {
    setTileSpecs([
      ...tileSpecs,
      { 
        id: uuidv4(), 
        model: tileModels[0], 
        thickness: "", 
        dimensions: "", 
        count: "" 
      }
    ]);
  };

  // Manipulador para remover uma especificação de telha
  const handleRemoveTileSpec = (id: string) => {
    if (tileSpecs.length > 1) {
      setTileSpecs(tileSpecs.filter(spec => spec.id !== id));
    } else {
      toast({
        title: "Atenção",
        description: "É necessário pelo menos uma especificação de telha",
      });
    }
  };

  // Manipulador para atualizar uma especificação de telha
  const handleTileSpecChange = (id: string, field: string, value: string) => {
    setTileSpecs(
      tileSpecs.map(spec => 
        spec.id === id ? { ...spec, [field]: value } : spec
      )
    );
  };

  // Manipulador para alternar seleção de problemas
  const handleIssueToggle = (issue: string) => {
    setSelectedIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  // Manipulador para capturar fotos
  const handlePhotoCapture = (category: string) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'environment';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setPhotos(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), {
              id: uuidv4(),
              dataUrl,
              notes: ""
            }]
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    
    fileInput.click();
  };

  // Manipulador para remover uma foto
  const handleRemovePhoto = (category: string, id: string) => {
    setPhotos(prev => ({
      ...prev,
      [category]: prev[category].filter(photo => photo.id !== id)
    }));
  };

  // Manipulador para adicionar notas a uma foto
  const handlePhotoNotes = (category: string, id: string, notes: string) => {
    setPhotos(prev => ({
      ...prev,
      [category]: prev[category].map(photo => 
        photo.id === id ? { ...photo, notes } : photo
      )
    }));
  };

  // Manipulador de submissão do formulário
  const onSubmit = async (data: Partial<Inspection>) => {
    setIsSubmitting(true);
    
    try {
      // Preparação dos dados para salvamento
      const allPhotos = Object.entries(photos).flatMap(([category, photoList]) => 
        photoList.map(photo => ({
          id: photo.id,
          category,
          dataUrl: photo.dataUrl,
          notes: photo.notes,
          timestamp: new Date().toISOString()
        }))
      );

      // Criação do objeto de inspeção completo
      const inspectionData: Inspection = {
        id: uuidv4(),
        visitId: data.visitId,
        clientName: data.clientName || "",
        dateInspected: data.dateInspected || new Date(),
        constructionType: data.constructionType || constructionTypes[0],
        customConstructionType: data.customConstructionType,
        address: data.address || "",
        city: data.city || "",
        inspectionSubject: data.inspectionSubject || "",
        protocolNumber: data.protocolNumber || "",
        technicianId: data.technicianId || "1",
        technicianName: data.technicianName || "",
        department: data.department || "",
        unit: data.unit || "",
        region: data.region || "",
        coordinatorName: data.coordinatorName || "",
        managerName: data.managerName || "",
        tileSpecs,
        issues: selectedIssues,
        photos: allPhotos,
        conclusion: data.conclusion || "",
        recommendations: data.recommendations || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        synced: false
      };

      // Aqui seria feita a chamada para salvar no backend ou banco local
      console.log("Inspeção a ser salva:", inspectionData);
      
      // Simulando uma chamada ao backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Inspeção salva",
        description: "A inspeção de telhado foi registrada com sucesso!",
      });
      
      // Callback para o componente pai
      if (onComplete) {
        onComplete(inspectionData.id);
      } else {
        // Navegação para lista de visitas se não houver callback
        setLocation("/visits");
      }
    } catch (error) {
      console.error("Erro ao salvar inspeção:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a inspeção. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-20">
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="client">Cliente</TabsTrigger>
            <TabsTrigger value="technician">Técnico</TabsTrigger>
            <TabsTrigger value="tiles">Telhas</TabsTrigger>
            <TabsTrigger value="issues">Problemas</TabsTrigger>
          </TabsList>
          
          {/* ---------- SEÇÃO CLIENTE E OBRA ---------- */}
          <TabsContent value="client" className="space-y-4 mt-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Dados do Cliente e da Obra</h2>
              
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do cliente ou empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dateInspected"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Data da Vistoria</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarUI
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="constructionType"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Tipo de Obra</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de obra" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {constructionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("constructionType") === "Outro" && (
                <FormField
                  control={form.control}
                  name="customConstructionType"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel>Especifique o tipo de obra</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Obra Mista" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço da obra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="inspectionSubject"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel>Assunto da Vistoria</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva brevemente o assunto da vistoria"
                        className="resize-none min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="protocolNumber"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel>Número de Protocolo</FormLabel>
                    <FormControl>
                      <Input placeholder="Protocolo da vistoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Fotos Gerais</h3>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handlePhotoCapture("general")}
                    className="w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" /> Adicionar Foto
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {photos.general?.map((photo) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.dataUrl}
                          alt="Foto geral"
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 flex flex-col justify-end">
                          <div className="p-1 bg-black bg-opacity-50 rounded-b-md">
                            <Input
                              placeholder="Adicionar nota"
                              value={photo.notes || ""}
                              onChange={(e) => handlePhotoNotes("general", photo.id, e.target.value)}
                              className="text-xs h-6 bg-transparent text-white border-0"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => handleRemovePhoto("general", photo.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* ---------- SEÇÃO DADOS DO TÉCNICO ---------- */}
          <TabsContent value="technician" className="space-y-4 mt-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Dados do Técnico Responsável</h2>
              
              <FormField
                control={form.control}
                name="technicianName"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Nome do Técnico</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do técnico responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento</FormLabel>
                      <FormControl>
                        <Input placeholder="Departamento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Unidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel>Região</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a região" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(regions).map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <FormField
                  control={form.control}
                  name="coordinatorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Coordenador</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do coordenador" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="managerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Gerente</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do gerente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* ---------- SEÇÃO ESPECIFICAÇÕES DAS TELHAS ---------- */}
          <TabsContent value="tiles" className="space-y-4 mt-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Especificações das Telhas</h2>
              
              <div className="space-y-4">
                {tileSpecs.map((spec, index) => (
                  <Card key={spec.id} className="border border-slate-200">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-slate-700">Telha {index + 1}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveTileSpec(spec.id)}
                          disabled={tileSpecs.length <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label htmlFor={`model-${spec.id}`}>Modelo</Label>
                          <Select 
                            defaultValue={spec.model} 
                            onValueChange={(val) => handleTileSpecChange(spec.id, "model", val)}
                          >
                            <SelectTrigger id={`model-${spec.id}`}>
                              <SelectValue placeholder="Selecione o modelo" />
                            </SelectTrigger>
                            <SelectContent>
                              {tileModels.map((model) => (
                                <SelectItem key={`${spec.id}-${model}`} value={model}>
                                  {model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {spec.model === "Outro" && (
                          <div>
                            <Label htmlFor={`customModel-${spec.id}`}>Especifique o modelo</Label>
                            <Input
                              id={`customModel-${spec.id}`}
                              placeholder="Ex: Modelo especial"
                              value={spec.customModel || ""}
                              onChange={(e) => handleTileSpecChange(spec.id, "customModel", e.target.value)}
                            />
                          </div>
                        )}
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor={`thickness-${spec.id}`}>Espessura</Label>
                            <Input
                              id={`thickness-${spec.id}`}
                              placeholder="Ex: 6mm"
                              value={spec.thickness}
                              onChange={(e) => handleTileSpecChange(spec.id, "thickness", e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`dimensions-${spec.id}`}>Dimensões</Label>
                            <Input
                              id={`dimensions-${spec.id}`}
                              placeholder="Ex: 2.44 x 1.10m"
                              value={spec.dimensions}
                              onChange={(e) => handleTileSpecChange(spec.id, "dimensions", e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`count-${spec.id}`}>Quantidade</Label>
                            <Input
                              id={`count-${spec.id}`}
                              placeholder="Ex: 150"
                              value={spec.count}
                              onChange={(e) => handleTileSpecChange(spec.id, "count", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddTileSpec}
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Especificação
                </Button>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Fotos das Telhas</h3>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handlePhotoCapture("tiles")}
                    className="w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" /> Adicionar Foto
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {photos.tiles?.map((photo) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.dataUrl}
                          alt="Foto de telha"
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 flex flex-col justify-end">
                          <div className="p-1 bg-black bg-opacity-50 rounded-b-md">
                            <Input
                              placeholder="Adicionar nota"
                              value={photo.notes || ""}
                              onChange={(e) => handlePhotoNotes("tiles", photo.id, e.target.value)}
                              className="text-xs h-6 bg-transparent text-white border-0"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => handleRemovePhoto("tiles", photo.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* ---------- SEÇÃO NÃO CONFORMIDADES ---------- */}
          <TabsContent value="issues" className="space-y-4 mt-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Não Conformidades Identificadas</h2>
              
              <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                {roofIssues.map((issue) => (
                  <div key={issue} className="flex items-start space-x-2">
                    <Checkbox
                      id={`issue-${issue}`}
                      checked={selectedIssues.includes(issue)}
                      onCheckedChange={() => handleIssueToggle(issue)}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`issue-${issue}`}
                      className="text-sm leading-tight cursor-pointer"
                    >
                      {issue}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Fotos dos Problemas</h3>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handlePhotoCapture("issues")}
                    className="w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" /> Adicionar Foto
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {photos.issues?.map((photo) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.dataUrl}
                          alt="Foto de problema"
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 flex flex-col justify-end">
                          <div className="p-1 bg-black bg-opacity-50 rounded-b-md">
                            <Input
                              placeholder="Adicionar nota"
                              value={photo.notes || ""}
                              onChange={(e) => handlePhotoNotes("issues", photo.id, e.target.value)}
                              className="text-xs h-6 bg-transparent text-white border-0"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => handleRemovePhoto("issues", photo.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="conclusion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conclusão</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Conclusão da vistoria técnica"
                          className="resize-none min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="recommendations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recomendações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Recomendações técnicas"
                          className="resize-none min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-slate-200 shadow-md">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Inspeção
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}