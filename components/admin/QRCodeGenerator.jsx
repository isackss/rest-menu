"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Usamos Canvas porque es más fácil de descargar como imagen

export default function QRCodeGenerator({ slug }) {
  const [menuUrl, setMenuUrl] = useState("");

  // Usamos useEffect para obtener la URL base del navegador (localhost en desarrollo, o tu dominio en producción)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Construimos la URL absoluta: ej. http://localhost:3000/pizzeria-napoli
      setMenuUrl(`${window.location.origin}/${slug}`);
    }
  }, [slug]);

  // Función para descargar el QR como imagen PNG
  const downloadQR = () => {
    const canvas = document.getElementById("restaurant-qr");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_Menu_${slug}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  if (!menuUrl) return null; // Evitamos renderizar hasta tener la URL completa

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Tu Código QR</h3>
      <p className="text-sm text-gray-500 mb-6">
        Imprime este código para que tus clientes lo escaneen en sus mesas.
      </p>

      {/* El componente que dibuja el QR */}
      <div className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl mb-6">
        <QRCodeCanvas
          id="restaurant-qr"
          value={menuUrl}
          size={200} // Tamaño en píxeles
          bgColor={"#ffffff"} // Fondo blanco
          fgColor={"#000000"} // Código negro (ideal para alto contraste al imprimir)
          level={"H"} // Nivel de corrección de errores Alto (permite que se lea aunque se ensucie un poco)
          includeMargin={true}
        />
      </div>

      <button
        onClick={downloadQR}
        className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        Descargar Imagen PNG
      </button>

      <div className="mt-4 pt-4 border-t border-gray-100 w-full">
        <p className="text-xs text-gray-400 mb-1">Enlace directo:</p>
        <a
          href={menuUrl}
          target="_blank"
          className="text-sm text-blue-600 hover:underline break-all"
        >
          {menuUrl}
        </a>
      </div>
    </div>
  );
}
