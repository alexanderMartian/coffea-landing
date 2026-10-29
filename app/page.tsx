import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import ProductSection from "@/components/sections/ProductSection";
import Promo from "@/components/sections/Promo";
import { site } from "@/content/site";

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <ProductSection
        id="coffee-menu"
        title={site.coffeeMenu.title}
        items={site.coffeeMenu.items}
      />
      <ProductSection
        id="dessert-menu"
        title={site.dessertMenu.title}
        items={site.dessertMenu.items}
      />
      <Promo />
    </main>
  );
}
