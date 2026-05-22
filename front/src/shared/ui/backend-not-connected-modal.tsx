import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface BackendNotConnectedModalProps {
  open: boolean;
  onClose: () => void;
  onGoMenu: () => void;
}

export function BackendNotConnectedModal({ open, onClose, onGoMenu }: BackendNotConnectedModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/45 flex items-center justify-center p-6">
      <div className="w-full max-w-[620px] rounded-xl bg-white border border-[#dddbe6] shadow-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-7 h-7 text-[#c1463a] mt-1 shrink-0" />
          <div>
            <h3 className="text-2xl font-semibold text-[#1f1a37]">No está conectado al backend</h3>
            <p className="text-[#6f6990] mt-2">
              Esta acción de guardado aún no está integrada con servicios. Por ahora es solo visual.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
          <Button className="bg-[#6351a0] hover:opacity-95" onClick={onGoMenu}>Ir al menú</Button>
        </div>
      </div>
    </div>
  );
}
