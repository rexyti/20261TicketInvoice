import { ChevronRight } from "lucide-react";

export type StepType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface Step {
  id: StepType;
  label: string;
  description: string;
  tipo: "lectura" | "accion";
  color: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    label: "Resumen de Ventas",
    description: "Consultarresumen consolidado",
    tipo: "lectura",
    color: "purple",
  },
  {
    id: 2,
    label: "Estado Ingreso",
    description: "Consultar check-in tickets",
    tipo: "lectura",
    color: "blue",
  },
  {
    id: 3,
    label: "Ingresos Tickets",
    description: "Consolidado financiero",
    tipo: "lectura",
    color: "green",
  },
  {
    id: 4,
    label: "Tipo Recinto",
    description: "Consultar tipo de recinto",
    tipo: "lectura",
    color: "indigo",
  },
  {
    id: 5,
    label: "Config. Liquidación",
    description: "Configurar tipo de liquidación",
    tipo: "accion",
    color: "orange",
  },
  {
    id: 6,
    label: "Comisión Recinto",
    description: "Registrar valor comisión",
    tipo: "accion",
    color: "red",
  },
  {
    id: 7,
    label: "Distribución Recaudo",
    description: "Calcular y consultar distribución",
    tipo: "accion",
    color: "pink",
  },
];

interface StepsNavigatorProps {
  currentStep: StepType;
  onStepChange: (step: StepType) => void;
}

export function StepsNavigator({ currentStep, onStepChange }: StepsNavigatorProps) {
  const getColorClasses = (color: string, active: boolean) => {
    const colors: Record<string, Record<string, string>> = {
      purple: {
        bg: active ? "bg-purple-100" : "bg-gray-50",
        border: active ? "border-purple-300" : "border-gray-200",
        text: active ? "text-purple-900" : "text-gray-700",
        dot: active ? "bg-purple-600" : "bg-gray-400",
      },
      blue: {
        bg: active ? "bg-blue-100" : "bg-gray-50",
        border: active ? "border-blue-300" : "border-gray-200",
        text: active ? "text-blue-900" : "text-gray-700",
        dot: active ? "bg-blue-600" : "bg-gray-400",
      },
      green: {
        bg: active ? "bg-green-100" : "bg-gray-50",
        border: active ? "border-green-300" : "border-gray-200",
        text: active ? "text-green-900" : "text-gray-700",
        dot: active ? "bg-green-600" : "bg-gray-400",
      },
      indigo: {
        bg: active ? "bg-indigo-100" : "bg-gray-50",
        border: active ? "border-indigo-300" : "border-gray-200",
        text: active ? "text-indigo-900" : "text-gray-700",
        dot: active ? "bg-indigo-600" : "bg-gray-400",
      },
      orange: {
        bg: active ? "bg-orange-100" : "bg-gray-50",
        border: active ? "border-orange-300" : "border-gray-200",
        text: active ? "text-orange-900" : "text-gray-700",
        dot: active ? "bg-orange-600" : "bg-gray-400",
      },
      red: {
        bg: active ? "bg-red-100" : "bg-gray-50",
        border: active ? "border-red-300" : "border-gray-200",
        text: active ? "text-red-900" : "text-gray-700",
        dot: active ? "bg-red-600" : "bg-gray-400",
      },
      pink: {
        bg: active ? "bg-pink-100" : "bg-gray-50",
        border: active ? "border-pink-300" : "border-gray-200",
        text: active ? "text-pink-900" : "text-gray-700",
        dot: active ? "bg-pink-600" : "bg-gray-400",
      },
    };

    return colors[color] || colors.purple;
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="grid grid-cols-7 gap-2">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isPassed = step.id < currentStep;
            const classes = getColorClasses(step.color, isActive);

            return (
              <div key={step.id}>
                <button
                  onClick={() => onStepChange(step.id)}
                  className={`w-full p-4 rounded-lg border transition-all text-left hover:shadow-sm ${classes.bg} ${classes.border}`}
                  disabled={step.tipo === "accion" && !isPassed && !isActive}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold ${classes.dot.replace("bg-", "text-")}`}>
                          {step.id}
                        </span>
                      </div>
                      <p className={`text-xs font-semibold ${classes.text}`}>{step.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                    </div>
                    {isActive && <ChevronRight className={`w-4 h-4 ${classes.dot.replace("bg-", "text-")}`} />}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
