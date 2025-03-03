import React, { useState, useEffect } from 'react';
import { Sunrise, Sunset, Sun, Moon } from 'lucide-react';

type MoodType = 'energetic' | 'calm' | 'focused' | 'tired';

// Frases motivacionais baseadas no humor
const motivationalPhrases = {
  energetic: [
    "Hoje é dia de conquistar o mundo! 🚀",
    "Nada pode te parar hoje. Vá em frente! 💪",
    "Sua energia hoje vai resolver qualquer problema! ⚡"
  ],
  calm: [
    "Respire fundo. Um passo de cada vez. 🧘",
    "Hoje é dia de resolver tudo com calma e precisão. 🌊",
    "Tranquilidade e foco são suas forças hoje. 🍃"
  ],
  focused: [
    "Concentração total para um dia produtivo. 🎯",
    "Mantenha o foco e verá os resultados. 👁️",
    "Dia perfeito para terminar aquelas tarefas pendentes. ✓"
  ],
  tired: [
    "Vá no seu ritmo hoje. Qualidade sobre quantidade. 🐢",
    "Mesmo cansado, cada passo te leva adiante. ⏱️",
    "Priorize o que é importante. Você consegue! 🌟"
  ]
};

interface MotivationWidgetProps {
  className?: string;
}

const MotivationWidget: React.FC<MotivationWidgetProps> = ({ className = "" }) => {
  const [currentMood, setCurrentMood] = useState<MoodType>("energetic");
  const [motivationalPhrase, setMotivationalPhrase] = useState("");

  // Determina o humor com base na hora do dia
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 9) {
      setCurrentMood("energetic"); // Manhã cedo - energia
    } else if (hour >= 9 && hour < 14) {
      setCurrentMood("focused");   // Horário comercial - foco
    } else if (hour >= 14 && hour < 19) {
      setCurrentMood("calm");      // Tarde - calma
    } else {
      setCurrentMood("tired");     // Noite - cansado
    }

    // Seleciona uma frase aleatória com base no humor atual
    const randomIndex = Math.floor(Math.random() * motivationalPhrases[currentMood].length);
    setMotivationalPhrase(motivationalPhrases[currentMood][randomIndex]);
  }, [currentMood]);

  const getMoodIcon = () => {
    switch (currentMood) {
      case "energetic": return <Sunrise className="h-5 w-5 text-amber-500" />;
      case "focused": return <Sun className="h-5 w-5 text-orange-500" />;
      case "calm": return <Sunset className="h-5 w-5 text-blue-500" />;
      case "tired": return <Moon className="h-5 w-5 text-indigo-500" />;
    }
  };

  return (
    <div 
      className={`mx-4 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm ${className}`}
      data-tutorial="motivation-widget"
    >
      <div className="flex items-center">
        {getMoodIcon()}
        <p className="ml-2 text-sm text-neutral-700">
          {motivationalPhrase}
        </p>
      </div>
    </div>
  );
};

export default MotivationWidget;