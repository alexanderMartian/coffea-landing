// All site copy, links, prices and contacts live here.
// Components import from this file and never hardcode text.
export const site = {
  name: "Coffea",
  nav: {
    links: [
      { label: "home", href: "#" },
      { label: "coffee", href: "#coffee-menu" },
      { label: "bakery", href: "#dessert-menu" },
      { label: "shop", href: "#" },
      { label: "about", href: "#" },
    ],
    cta: { label: "login", href: "#" },
  },
  hero: {
    eyebrow: "Welcome",
    title: "We serve the richest coffee in the city!",
    body: "[PLACEHOLDER: Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor]",
    cta: "Order Now",
    ctaHref: "#order",
    imageAlt: "",
  },
} as const;
