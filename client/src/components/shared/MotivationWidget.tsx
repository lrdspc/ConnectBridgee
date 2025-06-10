import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sun, Battery, Coffee, 
  Brain, RefreshCw, Quote 
} from 'lucide-react';
import { cn } from '@/lib/utils';

type MoodType = 'energetic' | 'calm' | 'focused' | 'tired';

interface MotivationWidgetProps {
  className?: string;
}

export function MotivationWidget({ className }: MotivationWidgetProps) {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [mood, setMood] = useState<MoodType>('energetic');
  
  // Lista de mensagens motivacionais
  const quotes = [
    "Cada vistoria é uma oportunidade de fazer a diferença.",
    "Qualidade não é um ato, é um hábito. Continue o bom trabalho!",
    "Atenção aos detalhes transforma um bom relatório em um excelente relatório.",
    "Seu trabalho hoje traz segurança e tranquilidade para muitas pessoas.",
    "Pequenos detalhes fazem grandes diferenças. Confie no seu olhar técnico!",
    "Os desafios de hoje são as conquistas de amanhã.",
    "Cada linha de seu relatório é um passo em direção à excelência.",
    "O sucesso é construído tijolo por tijolo, telha por telha.",
    "A excelência é fazer tarefas comuns de forma extraordinária.",
    "Sua dedicação é notada e valorizada a cada relatório.",
  ];
  
  // Lista de dicas para cada tipo de humor
  const moodTips = {
    energetic: "Aproveite sua energia para adiantar os relatórios mais complexos!",
    calm: "É um bom momento para revisar seus documentos com atenção aos detalhes.",
    focused: "Sua concentração está ótima. Hora perfeita para análises técnicas.",
    tired: "Considere uma pequena pausa. Um café e 5 minutos de descanso podem ajudar muito."
  };
  
  // Rotacionar as mensagens motivacionais
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Função para obter o ícone de acordo com o humor
  const getMoodIcon = () => {
    switch (mood) {
      case 'energetic':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'calm':
        return <Coffee className="h-5 w-5 text-blue-400" />;
      case 'focused':
        return <Brain className="h-5 w-5 text-indigo-500" />;
      case 'tired':
        return <Battery className="h-5 w-5 text-gray-400" />;
      default:
        return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  // Função para mudar o humor
  const changeMood = (newMood: MoodType) => {
    setMood(newMood);
  };
  
  return (
    <Card className={cn("bg-gradient-to-br from-primary/10 to-primary/5", className)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <Quote className="h-4 w-4 mr-1.5 text-primary/80" />
            <span className="text-sm font-medium">Motivação Diária</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => setCurrentQuote((prev) => (prev + 1) % quotes.length)}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <div className="min-h-[60px] flex items-center">
          <p className="text-sm text-center py-1 italic text-muted-foreground">
            "{quotes[currentQuote]}"
          </p>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center mb-2">
            {getMoodIcon()}
            <span className="text-xs ml-1.5">Como você está se sentindo?</span>
          </div>
          
          <div className="flex space-x-1 justify-between">
            <Button
              variant={mood === 'energetic' ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2 flex-1"
              onClick={() => changeMood('energetic')}
            >
              <Sun className="h-3 w-3 mr-1" />
              Energético
            </Button>
            <Button
              variant={mood === 'calm' ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2 flex-1"
              onClick={() => changeMood('calm')}
            >
              <Coffee className="h-3 w-3 mr-1" />
              Calmo
            </Button>
            <Button
              variant={mood === 'focused' ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2 flex-1"
              onClick={() => changeMood('focused')}
            >
              <Brain className="h-3 w-3 mr-1" />
              Focado
            </Button>
            <Button
              variant={mood === 'tired' ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2 flex-1"
              onClick={() => changeMood('tired')}
            >
              <Battery className="h-3 w-3 mr-1" />
              Cansado
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            {moodTips[mood]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}