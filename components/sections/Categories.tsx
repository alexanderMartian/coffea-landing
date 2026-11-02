import Image from "next/image";
import { site } from "@/content/site";

export default function Categories() {
  return (
    <section id="categories" data-spec="categories" className="bg-warm-surface pt-12 pb-[47px]">
      <div
        data-spec="categories-group"
        className="mx-auto max-w-[845px] grid grid-cols-2 justify-items-center gap-y-8 gap-x-6 sm:grid-cols-4 lg:flex lg:flex-nowrap lg:justify-between lg:gap-x-12"
      >
        {site.categories.items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-[11px]">
            <Image
              data-spec="categories-icon"
              src={item.icon}
              alt=""
              width={82}
              height={82}
            />
            <span
              data-spec="categories-label"
              className="text-warm-text text-center font-alt font-medium text-lg leading-8"
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
