import { cn } from "@/lib/utils";
import CarouselRow from "./CarouselRow";
import ProductCard from "./ProductCard";

interface ProductItem {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  price: string;
  cta: string;
}

interface Props {
  id: string;
  title: string;
  items: readonly ProductItem[];
  /** margin-top token class, e.g. "mt-section-lg". Passed from page.tsx, not hard-coded. */
  className?: string;
}

export default function ProductSection({ id, title, items, className }: Props) {
  return (
    <section id={id} className={cn("overflow-x-clip", className)}>
      <div className="mx-auto w-full max-w-[110rem] px-4 md:px-8 3xl:px-0">
        <h2
          data-spec={`${id}-heading`}
          className="font-display font-semibold text-h3 text-center tracking-[0.04em] uppercase text-foreground mb-16"
        >
          {title}
        </h2>

        <CarouselRow>
          {items.map((item, i) => (
            <ProductCard key={i} {...item} specPrefix={i === 0 ? id : ""} />
          ))}
        </CarouselRow>
      </div>
    </section>
  );
}
