import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface DadosVistoriaTecnica {
  dataVistoria: string;
  cliente: string;
  nomeEmpreendimento: string;
  cidade: string;
  endereco: string;
  protocolo: string;
  assunto: string;
  tecnico: string;
  departamento: string;
  unidade: string;
  coordenador: string;
  gerente: string;
  regional: string;
  quantidadeTelhas: number;
  modeloTelha: string;
  espessuraTelha?: number;
  comprimentoTelha?: number;
  larguraTelha?: number;
  areaCoberta: number;
  naoConformidades: {
    [key: string]: boolean;
  };
}

const FormularioRelatórioVistoriaTécnica: React.FC = () => {
  const [dadosFormulario, setDadosFormulario] = useState<DadosVistoriaTecnica>({
    dataVistoria: new Date().toISOString().split('T')[0],
    cliente: '',
    nomeEmpreendimento: 'Residencial',
    cidade: 'Sarandi',
    endereco: '',
    protocolo: '',
    assunto: 'AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral',
    tecnico: '',
    departamento: 'Assistência Técnica',
    unidade: 'PR',
    coordenador: 'Marlon Weingartner',
    gerente: 'Elisabete Kudo',
    regional: 'Sul',
    quantidadeTelhas: 100,
    modeloTelha: 'ondulada',
    espessuraTelha: 6,
    comprimentoTelha: 2.44,
    larguraTelha: 1.10,
    areaCoberta: 0,
    naoConformidades: {
      armazenamentoIncorreto: false,
      cargaPermanente: false,
      corteCanto: false,
      estruturaDesalinhada: false,
      fixacaoTelhasIrregular: false,
      inclinacaoInsuficiente: false,
      marcasCaminhamento: false,
      beiralIncorreto: false,
      apoiosInsuficientes: false,
      recobrimentoIncorreto: false,
      sentidoMontagem: false,
      cumeeiraCeramica: false,
      usoArgamassa: false,
      fixacaoAcessoriosInadequada: false
    }
  });

  const handleMudancaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosFormulario(anterior => ({
      ...anterior,
      [name]: value
    }));
  };

  const handleMudancaCheckbox = (chaveNaoConformidade: string) => {
    setDadosFormulario(anterior => ({
      ...anterior,
      naoConformidades: {
        ...anterior.naoConformidades,
        [chaveNaoConformidade]: !anterior.naoConformidades[chaveNaoConformidade]
      }
    }));
  };

  const gerarRelatorio = () => {
    console.log('Dados do relatório:', dadosFormulario);
    alert('Funcionalidade de geração de relatório a ser implementada');
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Formulário de Relatório de Vistoria Técnica</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4">Informações Básicas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data da Vistoria</Label>
                  <Input 
                    type="date" 
                    name="dataVistoria"
                    value={dadosFormulario.dataVistoria}
                    onChange={handleMudancaInput}
                  />
                </div>
                <div>
                  <Label>Cliente</Label>
                  <Input 
                    name="cliente"
                    value={dadosFormulario.cliente}
                    onChange={handleMudancaInput}
                  />
                </div>
                <div>
                  <Label>Cidade</Label>
                  <Input 
                    name="cidade"
                    value={dadosFormulario.cidade}
                    onChange={handleMudancaInput}
                  />
                </div>
                <div>
                  <Label>Endereço</Label>
                  <Input 
                    name="endereco"
                    value={dadosFormulario.endereco}
                    onChange={handleMudancaInput}
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Detalhes das Telhas</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Modelo da Telha</Label>
                  <Select
                    value={dadosFormulario.modeloTelha}
                    onValueChange={(value) => setDadosFormulario(prev => ({
                      ...prev, 
                      modeloTelha: value === 'outro' ? '' : value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ondulada">Ondulada</SelectItem>
                      <SelectItem value="plana">Plana</SelectItem>
                      <SelectItem value="estrutural">Estrutural</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  {dadosFormulario.modeloTelha === 'outro' && (
                    <Input 
                      className="mt-2"
                      placeholder="Digite o modelo da telha"
                      value={dadosFormulario.modeloTelha}
                      onChange={handleMudancaInput}
                      name="modeloTelha"
                    />
                  )}
                </div>
                <div>
                  <Label>Espessura (mm)</Label>
                  <Select
                    value={String(dadosFormulario.espessuraTelha)}
                    onValueChange={(value) => setDadosFormulario(prev => ({
                      ...prev, 
                      espessuraTelha: Number(value)
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a espessura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 mm</SelectItem>
                      <SelectItem value="5">5 mm</SelectItem>
                      <SelectItem value="6">6 mm</SelectItem>
                      <SelectItem value="8">8 mm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Dimensões (m)</Label>
                  <div className="flex space-x-2">
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="Comprimento"
                      name="comprimentoTelha"
                      value={dadosFormulario.comprimentoTelha}
                      onChange={handleMudancaInput}
                    />
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="Largura"
                      name="larguraTelha"
                      value={dadosFormulario.larguraTelha}
                      onChange={handleMudancaInput}
                    />
                  </div>
                </div>
                <div>
                  <Label>Quantidade de Telhas</Label>
                  <Input 
                    type="number"
                    name="quantidadeTelhas"
                    value={dadosFormulario.quantidadeTelhas}
                    onChange={handleMudancaInput}
                  />
                </div>
                <div>
                  <Label>Área Coberta (m²)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    name="areaCoberta"
                    value={dadosFormulario.areaCoberta}
                    onChange={handleMudancaInput}
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Não Conformidades</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(dadosFormulario.naoConformidades).map(key => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox 
                      id={key} 
                      checked={dadosFormulario.naoConformidades[key]}
                      onCheckedChange={() => handleMudancaCheckbox(key)}
                    />
                    <Label htmlFor={key} className="capitalize">
                      {key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, char => char.toUpperCase())
                        .trim()
                      }
                    </Label>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={gerarRelatorio}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Gerar Relatório
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormularioRelatórioVistoriaTécnica;
