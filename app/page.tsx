import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import ProductSection from "@/components/sections/ProductSection";
import Promo from "@/components/sections/Promo";
import Testimonials from "@/components/sections/Testimonials";
import Newsletter from "@/components/sections/Newsletter";
import { site } from "@/content/site";

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <ProductSection
        id="coffee-menu"
        className="mt-section-lg"
        title={site.coffeeMenu.title}
        carouselLabel={site.coffeeMenu.carouselLabel}
        items={site.coffeeMenu.items}
      />
      <ProductSection
        id="dessert-menu"
        className="mt-section-lg"
        title={site.dessertMenu.title}
        carouselLabel={site.dessertMenu.carouselLabel}
        items={site.dessertMenu.items}
      />
      <Promo className="mt-section-sm" />
      <Testimonials className="mt-section-sm" />
      <Newsletter className="mt-section-sm" />
    </main>
  );
}
