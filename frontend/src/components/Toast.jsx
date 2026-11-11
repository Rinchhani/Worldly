import { useAtlas } from '../context/AtlasContext';

export default function Toast() {
  const { toast } = useAtlas();

  return (
    <div
      className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-primary-container text-on-primary px-4 py-2 rounded-xl shadow-xl text-label-md flex items-center gap-2 transition-all duration-300 ${
        toast.visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <span className="material-symbols-outlined text-secondary-container text-[18px]">info</span>
      <span>{toast.message}</span>
    </div>
  );
}

