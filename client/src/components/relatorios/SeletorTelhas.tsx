import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { 
  Telha,
  ComprimentoTelha,
  telhaEspecificacoes, 
  espessurasTelhas, 
  largurasTelhas, 
  comprimentosTelhas, 
  modelosTelhas
} from "@shared/relatorioVistoriaSchema";

interface SeletorTelhasProps {
  telhas: Telha[];
  onChange: (telhas: Telha[]) => void;
}

export function SeletorTelhas({ telhas, onChange }: SeletorTelhasProps) {
  const [telhasState, setTelhasState] = useState<Telha[]>(telhas);

  useEffect(() => {
    // Atualiza as telhas quando o prop mudar (para inicialização)
    if (telhas.length > 0 && telhasState.length === 0) {
      setTelhasState(telhas);
    }
  }, [telhas]);

  // Quando o estado interno muda, propaga para o parent
  useEffect(() => {
    onChange(telhasState);
  }, [telhasState, onChange]);

  // Adiciona uma nova telha com valores padrão
  const adicionarTelha = () => {
    const novaTelha: Telha = {
      id: uuidv4(),
      espessura: "6",
      largura: "1.10",
      comprimento: "2.44",
      quantidade: 0,
      area: 0,
      peso: 32.5, // Peso correspondente à combinação 6mm x 1.10m x 2.44m
      modelo: "Ondulada"
    };
    
    setTelhasState([...telhasState, novaTelha]);
  };

  // Remove uma telha pelo ID
  const removerTelha = (id: string) => {
    setTelhasState(telhasState.filter(telha => telha.id !== id));
  };

  // Atualiza uma propriedade específica de uma telha
  const atualizarTelha = (id: string, campo: keyof Telha, valor: any) => {
    setTelhasState(telhasState.map(telha => {
      if (telha.id === id) {
        const telhaNova = { ...telha, [campo]: valor };
        
        // Propriedades que, quando mudam, precisam recalcular outras
        if (campo === 'espessura' || campo === 'largura') {
          // Verifica se o comprimento atual está disponível para essa combinação
          const comprimentosDisponiveis = getComprimentosDisponiveis(telhaNova.espessura, telhaNova.largura);
          const comprimentoAtual = telhaNova.comprimento as ComprimentoTelha;
          if (!comprimentosDisponiveis.includes(comprimentoAtual)) {
            // Se não estiver disponível, seleciona o primeiro disponível
            telhaNova.comprimento = comprimentosDisponiveis[0];
          }
          
          // Atualiza o peso
          telhaNova.peso = getPeso(telhaNova.espessura, telhaNova.largura, telhaNova.comprimento);
        }
        
        if (campo === 'comprimento') {
          // Atualiza o peso
          telhaNova.peso = getPeso(telhaNova.espessura, telhaNova.largura, telhaNova.comprimento);
        }
        
        // Recalcula a área sempre que dimensões ou quantidade mudarem
        if (['espessura', 'largura', 'comprimento', 'quantidade'].includes(campo)) {
          telhaNova.area = calcularArea(telhaNova);
        }
        
        return telhaNova;
      }
      return telha;
    }));
  };

  // Obtém comprimentos disponíveis para uma combinação de espessura e largura
  const getComprimentosDisponiveis = (espessura: string, largura: string): ComprimentoTelha[] => {
    const comprimentosMap = telhaEspecificacoes[espessura]?.[largura] || {};
    return Object.keys(comprimentosMap).filter(
      comp => comprimentosMap[comp] !== null
    ) as ComprimentoTelha[];
  };
  
  // Obtém o peso para uma combinação específica
  const getPeso = (espessura: string, largura: string, comprimento: string): number => {
    return telhaEspecificacoes[espessura]?.[largura]?.[comprimento] || 0;
  };
  
  // Calcula a área de uma telha
  const calcularArea = (telha: Telha): number => {
    const comp = Number(telha.comprimento);
    const larg = Number(telha.largura);
    const qtd = telha.quantidade;
    
    const area = qtd * comp * larg;
    return Math.round(area * 100) / 100; // Arredonda para 2 casas decimais
  };
  
  // Calcula a área total de todas as telhas
  const calcularAreaTotal = (): number => {
    const total = telhasState.reduce((soma, telha) => soma + telha.area, 0);
    return Math.round(total * 100) / 100; // Arredonda para 2 casas decimais
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Telhas</h3>
          <p className="text-sm text-muted-foreground">
            Adicione os tipos de telhas utilizados no projeto
          </p>
        </div>
        <Button 
          onClick={adicionarTelha} 
          size="sm"
          variant="outline"
        >
          <Plus className="mr-1 h-4 w-4" />
          Adicionar Telha
        </Button>
      </div>

      {telhasState.length === 0 ? (
        <Card className="border-dashed border-muted">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Nenhuma telha adicionada. Clique em "Adicionar Telha" para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {telhasState.map((telha, index) => (
            <Card key={telha.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    Telha {index + 1}
                    {telha.modelo && (
                      <Badge variant="outline" className="ml-2">
                        {telha.modelo}
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removerTelha(telha.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remover</span>
                  </Button>
                </div>
                <CardDescription>
                  {telha.espessura}mm x {telha.largura}m x {telha.comprimento}m
                  {telha.peso && telha.peso > 0 && ` • Peso: ${telha.peso}kg`}
                  {telha.area > 0 && ` • Área: ${telha.area}m²`}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`espessura-${telha.id}`}>Espessura</Label>
                    <Select
                      value={telha.espessura}
                      onValueChange={(value) => atualizarTelha(telha.id, 'espessura', value)}
                    >
                      <SelectTrigger id={`espessura-${telha.id}`}>
                        <SelectValue placeholder="Selecione a espessura" />
                      </SelectTrigger>
                      <SelectContent>
                        {espessurasTelhas.map((esp) => (
                          <SelectItem key={esp} value={esp}>
                            {esp}mm
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`largura-${telha.id}`}>Largura</Label>
                    <Select
                      value={telha.largura}
                      onValueChange={(value) => atualizarTelha(telha.id, 'largura', value)}
                    >
                      <SelectTrigger id={`largura-${telha.id}`}>
                        <SelectValue placeholder="Selecione a largura" />
                      </SelectTrigger>
                      <SelectContent>
                        {largurasTelhas.map((larg) => (
                          <SelectItem key={larg} value={larg}>
                            {larg}m
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`comprimento-${telha.id}`}>Comprimento</Label>
                    <Select
                      value={telha.comprimento}
                      onValueChange={(value) => atualizarTelha(telha.id, 'comprimento', value)}
                    >
                      <SelectTrigger id={`comprimento-${telha.id}`}>
                        <SelectValue placeholder="Selecione o comprimento" />
                      </SelectTrigger>
                      <SelectContent>
                        {getComprimentosDisponiveis(telha.espessura, telha.largura).map((comp) => (
                          <SelectItem key={comp} value={comp}>
                            {comp}m
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor={`quantidade-${telha.id}`}>Quantidade</Label>
                    <Input
                      id={`quantidade-${telha.id}`}
                      type="number"
                      min="0"
                      value={telha.quantidade}
                      onChange={(e) => atualizarTelha(telha.id, 'quantidade', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`modelo-${telha.id}`}>Modelo</Label>
                    <Select
                      value={telha.modelo || ""}
                      onValueChange={(value) => atualizarTelha(telha.id, 'modelo', value)}
                    >
                      <SelectTrigger id={`modelo-${telha.id}`}>
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        {modelosTelhas.map((modelo) => (
                          <SelectItem key={modelo} value={modelo}>
                            {modelo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              {telha.area > 0 && (
                <CardFooter className="pt-0 pb-3">
                  <div className="text-sm text-muted-foreground w-full flex justify-between">
                    <span>Peso Total: {Math.round((telha.peso || 0) * telha.quantidade * 100) / 100}kg</span>
                    <span>Área: {telha.area}m²</span>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
          
          {telhasState.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium">
                    Área Total: {calcularAreaTotal()}m²
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {telhasState.length} {telhasState.length === 1 ? 'tipo' : 'tipos'} de telha
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}