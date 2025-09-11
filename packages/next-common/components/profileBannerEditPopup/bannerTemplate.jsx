import { useState } from "react";
import { cn } from "next-common/utils";
import banner1 from "next-common/assets/imgs/banners/banner1.png";
import banner2 from "next-common/assets/imgs/banners/banner2.png";
import banner3 from "next-common/assets/imgs/banners/banner3.png";
import banner4 from "next-common/assets/imgs/banners/banner4.png";
import banner5 from "next-common/assets/imgs/banners/banner5.png";
import banner6 from "next-common/assets/imgs/banners/banner6.png";

export default function BannerTemplate({ setImageFile, setImageDataUrl }) {
  const [currentIndex, setIndex] = useState(null);

  const onSelectTemplate = async (src) => {
    const response = await fetch(src);
    if (response.ok) {
      setImageDataUrl(src);
      const blob = await response.blob();
      const file = new File([blob], "bannber.png", { type: blob.type });
      setImageFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-4">
      <h5 className="text14Bold text-textPrimary self-start">
        Banner Template
      </h5>
      <div className="flex gap-1 flex-wrap w-full">
        {[banner1, banner2, banner3, banner4, banner5, banner6].map(
          (item, index) => {
            return (
              <div
                key={item.src}
                className={cn(
                  "w-[49%] rounded  h-[50px] border border-transparent cursor-pointer bg-no-repeat bg-cover bg-center ",
                  currentIndex === index && " border-neutral400",
                )}
                style={{
                  backgroundImage: `url(${item.src})`,
                }}
                onClick={() => {
                  setIndex(index);
                  onSelectTemplate(location.origin + item.src);
                }}
              ></div>
            );
          },
        )}
      </div>
    </div>
  );
}
