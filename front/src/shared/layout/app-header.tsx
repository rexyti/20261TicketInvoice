import { User } from "lucide-react";

export function AppHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-28 bg-[#241c47] z-50">
      <div className="h-full px-8 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-[#9c98aa]" />
          <button
            type="button"
            className="text-[#d8d4e6] font-semibold text-5xl leading-none"
            onClick={() => window.location.assign("/")}
          >
            Ticket Seller
          </button>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-[#d8d4e6] text-2xl font-medium">Administrador Financiero</p>
          <div className="w-16 h-16 rounded-full bg-[#d8d4e6] flex items-center justify-center">
            <User className="w-8 h-8 text-[#241c47]" />
          </div>
        </div>
      </div>
    </header>
  );
}
