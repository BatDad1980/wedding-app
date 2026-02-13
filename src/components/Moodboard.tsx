import React, { useRef } from 'react';
import { Plus, X, Camera, Image as ImageIcon } from 'lucide-react';
import { MoodImage } from '../types';

interface Props {
  images: MoodImage[];
  setImages: React.Dispatch<React.SetStateAction<MoodImage[]>>;
}

const Moodboard: React.FC<Props> = ({ images, setImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImg: MoodImage = {
            id: Math.random().toString(36).substr(2, 9),
            url: reader.result as string,
            prompt: file.name // We use the filename as a label
          };
          setImages(prev => [newImg, ...prev]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const deleteImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <div className="animate-slideUp pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Inspiration Board</h2>
          <p className="text-xs text-stone-400">Capture your favorite wedding vibes</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 bg-stone-800 text-rose-200 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Hidden inputs for iPhone gallery/camera */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Masonry-style Grid */}
      <div className="columns-2 gap-4 space-y-4">
        {images.map(img => (
          <div key={img.id} className="relative group break-inside-avoid">
            <img
              src={img.url}
              alt="Inspiration"
              className="w-full rounded-2xl shadow-md border border-stone-100 hover:brightness-95 transition-all"
            />
            <button
              onClick={() => deleteImage(img.id)}
              className="absolute top-2 right-2 bg-white/80 backdrop-blur-md p-1.5 rounded-full text-stone-500 shadow-sm"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-200 text-stone-300">
          <div className="flex justify-center gap-4 mb-4 opacity-20">
            <Camera size={40} />
            <ImageIcon size={40} />
          </div>
          <p className="italic serif">Tap the + to add photos of your dress,<br />flowers, or venue ideas!</p>
        </div>
      )}
    </div>
  );
};

export default Moodboard;
