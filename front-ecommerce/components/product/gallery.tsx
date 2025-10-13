'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from 'components/grid/tile';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import Image from 'next/image';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const imageIndex = state.image ? parseInt(state.image) : 0;

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-[#00B207] flex items-center justify-center text-[#2C742F]';

  return (
    <form className="flex flex-col items-center lg:flex-row lg:items-start gap-4">
      {images.length > 1 ? (
        <ul className="flex flex-row lg:flex-col gap-2 overflow-auto lg:max-h-[550px]">
          {images.map((image, index) => {
            const isActive = index === imageIndex;

            return (
              <li key={image.src} className="h-20 w-20">
                <button
                  formAction={() => {
                    const newState = updateImage(index.toString());
                    updateURL(newState);
                  }}
                  aria-label="Select product image"
                  className="h-full w-full"
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden lg:w-4/5">
        {images[imageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-[#84D187] bg-white/90 text-[#2C742F] backdrop-blur-sm">
              <button
                aria-label="Previous product image"
                className={buttonClassName}
                onClick={() => { updateImage(previousImageIndex.toString()); updateURL({ image: previousImageIndex.toString() }); }}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-[#84D187]"></div>
              <button
                aria-label="Next product image"
                className={buttonClassName}
                onClick={() => { updateImage(nextImageIndex.toString()); updateURL({ image: nextImageIndex.toString() }); }}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
