"use client"; // Necesario porque usaremos usePathname para saber la ruta activa y useState para el menú móvil

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Definimos las rutas del panel de administración
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Editor de Menú", href: "/menu-builder", icon: "🍔" },
    // Secciones preparadas para futuros módulos del restaurante:
    { name: "Costos y Escandallos", href: "/escandallos", icon: "⚖️" },
    { name: "Reseñas y Meseros", href: "/reviews", icon: "⭐" },
    { name: "Lector QR Interno", href: "/scanner", icon: "📷" },
    { name: "Configuración", href: "/settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* --- MENÚ MÓVIL (Navbar superior solo visible en pantallas pequeñas) --- */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center shadow-md z-20">
        <h1 className="font-bold text-lg tracking-wide">Admin Panel</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 focus:outline-none focus:bg-gray-800 rounded-lg"
        >
          {/* Icono de Hamburguesa / Cerrar */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* --- SIDEBAR LATERAL --- */}
      <aside
        className={`
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 
        transform top-0 left-0 w-64 bg-gray-900 text-gray-300 fixed md:static h-full z-10 
        transition-transform duration-300 ease-in-out flex flex-col shadow-xl
      `}
      >
        <div className="p-6 hidden md:block border-b border-gray-800">
          <h2 className="text-2xl font-black text-white tracking-tight">
            MenúApp<span className="text-blue-500">.</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Gestión de Restaurante</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto mt-16 md:mt-0">
          {navItems.map((item) => {
            // Verificamos si la ruta actual coincide con el href del enlace para marcarlo como "activo"
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)} // Cierra el menú en móvil al hacer clic
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Botón de Cerrar Sesión (Mockup por ahora) */}
        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium">
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      {/* El 'flex-1' hace que ocupe el resto del espacio disponible */}
      <main className="flex-1 w-full overflow-y-auto">
        <div className="p-4 md:p-8">
          {/* Aquí Next.js inyectará automáticamente el contenido de page.jsx (Dashboard, Editor, etc.) */}
          {children}
        </div>
      </main>

      {/* Overlay oscuro para móviles cuando el menú está abierto */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-0 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}
