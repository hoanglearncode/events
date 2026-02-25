import React from "react";
import Image from "next/image";

const renderImages = (images: File[]) => {
  const urls = images.map((f) => URL.createObjectURL(f));
  const count = urls.length;

  // 1 ảnh
  if (count === 1) {
    return (
      <div className="w-full h-full">
        <Image src={urls[0]} alt="" fill className="object-cover rounded-xl" />
      </div>
    );
  }

  // 2 ảnh
  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 w-full h-full">
        {urls.map((src, i) => (
          <div key={i} className="relative">
            <Image src={src} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  // 3 ảnh
  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-1 w-full h-full">
        <div className="relative row-span-2">
          <Image src={urls[0]} alt="" fill className="object-cover" />
        </div>
        {urls.slice(1).map((src, i) => (
          <div key={i} className="relative">
            <Image src={src} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  // 4 ảnh
  if (count === 4) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full">
        {urls.map((src, i) => (
          <div key={i} className="relative">
            <Image src={src} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  // 5+ ảnh
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full">
      <div className="relative row-span-2">
        <Image src={urls[0]} alt="" fill className="object-cover" />
      </div>

      {urls.slice(1, 4).map((src, i) => (
        <div key={i} className="relative">
          <Image src={src} alt="" fill className="object-cover" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-3xl font-bold">
        +{count - 4}
      </div>
    </div>
  );
};

export default renderImages;
