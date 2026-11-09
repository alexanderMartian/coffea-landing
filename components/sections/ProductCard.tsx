import Image from "next/image";
import { Heart } from "lucide-react";

export interface ProductCardProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  price: string;
  cta: string;
  /** Pass the section id for the first card; omit (empty string) for the rest. */
  specPrefix?: string;
}

export default function ProductCard({
  image,
  imageAlt,
  title,
  description,
  price,
  cta,
  specPrefix,
}: ProductCardProps) {
  const s = specPrefix || undefined;

  return (
    <article
      data-spec={s && `${s}-card`}
      className="group/card snap-start shrink-0 flex flex-col
        w-[85%] md:w-[calc(50%-0.25rem)] lg:w-[calc(33.333%-4px)] 3xl:w-[22.875rem]
        bg-warm-surface/20 border border-warm-surface rounded-[1.125rem] p-4 gap-4"
    >
      <div
        data-spec={s && `${s}-card-image`}
        className="relative overflow-hidden rounded-[0.75rem]"
      >
        <div className="relative aspect-[334/364]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover transition-[scale] duration-(--motion-base) ease-standard motion-safe:group-hover/card:scale-105"
            sizes="(min-width: 1920px) 332px, (min-width: 1024px) calc((min(100vw - 4rem, 110rem) - 9rem) / 3 - 38px), (min-width: 768px) calc(50vw - 70px), calc((100vw - 2rem) * 0.85 - 34px)"
          />
        </div>
        {/* TODO: favorites logic */}
        {/* Button offset by -10px (p-2.5) so the icon stays at top-[18px] right-[27px] from the image edge */}
        <button
          type="button"
          aria-label="Add to favorites"
          className="absolute top-[8px] right-[17px] p-2.5 hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Heart
            data-spec={s && `${s}-card-heart`}
            size={33}
            className="stroke-background fill-none"
            aria-hidden
          />
        </button>
      </div>

      {/* Figma desc frame is fixed 47px (Fill × 47) with Vertical Trim; trimmed text ~43px,
          so the 4px empty frame is added to the gap (12 + 4 = 16) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <h3
            data-spec={s && `${s}-card-title`}
            className="font-sans font-semibold text-xl lg:text-2xl 3xl:text-[2.375rem] text-foreground"
          >
            {title}
          </h3>
          <p
            data-spec={s && `${s}-card-desc`}
            className="font-sans font-normal text-base lg:text-xl leading-[1.4] text-dark-roast [text-box:trim-both_cap_alphabetic]"
          >
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span
            data-spec={s && `${s}-card-price`}
            className="font-alt font-semibold text-base lg:text-xl leading-[1.5] text-dark-roast"
          >
            {price}
          </span>
          <button
            data-spec={s && `${s}-card-btn`}
            type="button"
            className="font-alt font-medium text-sm bg-dark-roast text-white rounded-[0.5rem] py-3 px-[1.625rem] 3xl:py-[0.625rem] hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-roast"
          >
            {cta}
          </button>
        </div>
      </div>
    </article>
  );
}
