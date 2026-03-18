"use client";

export default function FloatingCategoryNav({ categories }) {
  // Si hay 1 o ninguna categoría, no tiene sentido mostrar la barra
  if (!categories || categories.length <= 1) return null;

  // Función para hacer scroll suave hasta la sección elegida
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    // Contenedor fijo en la parte inferior. 'pointer-events-none' evita que el contenedor
    // invisible bloquee clics en el menú detrás de él.
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      {/* La barra en sí. Recuperamos 'pointer-events-auto' para que los botones funcionen */}
      <nav
        className="bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 rounded-full p-1.5 flex gap-1.5 overflow-x-auto max-w-full pointer-events-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Oculta la barra de scroll visual en la barra
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `nav::-webkit-scrollbar { display: none; }`,
          }}
        />

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleScroll(cat._id)}
            className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold text-slate-600 bg-transparent hover:bg-slate-100 hover:text-slate-900 active:bg-blue-600 active:text-white transition-colors flex-shrink-0"
          >
            {cat.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
