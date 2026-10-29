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
    // PLACEHOLDER: lorem from the design
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor",
    cta: "Order Now",
    ctaHref: "#order",
    imageAlt: "",
  },
  categories: {
    items: [
      { label: "Hot Coffee", icon: "/images/categories/icon-hot-coffee.svg" },
      { label: "Cold Coffee", icon: "/images/categories/icon-cold-coffee.svg" },
      { label: "Cup Coffee", icon: "/images/categories/icon-cup-coffee.svg" },
      { label: "Dessert", icon: "/images/categories/icon-dessert.svg" },
    ],
  },
  coffeeMenu: {
    title: "our special coffee",
    items: [
      {
        image: "/images/coffee-menu/card-1.jpg",
        imageAlt: "Cup of lungo coffee",
        title: "Lungo coffee",
        // PLACEHOLDER: lorem from the design
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
        price: "Rs. 200",
        cta: "Order Now",
      },
      {
        image: "/images/coffee-menu/card-2.jpg",
        imageAlt: "Lungo coffee in a glass",
        title: "Lungo coffee",
        // PLACEHOLDER: lorem from the design
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
        price: "Rs. 200",
        cta: "Order Now",
      },
      {
        image: "/images/coffee-menu/card-3.jpg",
        imageAlt: "Lungo coffee with milk",
        title: "Lungo coffee",
        // PLACEHOLDER: lorem from the design
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
        price: "Rs. 200",
        cta: "Order Now",
      },
      {
        image: "/images/coffee-menu/card-4.jpg",
        imageAlt: "Hot lungo coffee in a mug",
        title: "Lungo coffee",
        // PLACEHOLDER: lorem from the design
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
        price: "Rs. 200",
        cta: "Order Now",
      },
    ],
  },
  dessertMenu: {
    title: "our special dessert",
    items: [
      {
        image: "/images/dessert-menu/card-1.jpg",
        imageAlt: "[PLACEHOLDER: alt text for dessert card 1]",
        // PLACEHOLDER: lorem from the design
        title: "Lungo coffee",
        // PLACEHOLDER: lorem from the design
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
        price: "Rs. 200",
        cta: "Order Now",
      },
      {
        image: "/images/dessert-menu/card-2.jpg",
        imageAlt: "[PLACEHOLDER: alt text for dessert card 2]",
        // PLACEHOLDER: lorem from the design
        title: "Lungo coffee",
        // PLACEHOLDER: lorem from the design
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
        price: "Rs. 200",
        cta: "Order Now",
      },
      {
        image: "/images/dessert-menu/card-3.jpg",
        imageAlt: "[PLACEHOLDER: alt text for dessert card 3]",
        // PLACEHOLDER: lorem from the design
        title: "Lungo coffee",
        // PLACEHOLDER: lorem from the design
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
        price: "Rs. 200",
        cta: "Order Now",
      },
      {
        image: "/images/dessert-menu/card-4.jpg",
        imageAlt: "[PLACEHOLDER: alt text for dessert card 4]",
        // PLACEHOLDER: lorem from the design
        title: "Lungo coffee",
        // PLACEHOLDER: lorem from the design
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
        price: "Rs. 200",
        cta: "Order Now",
      },
    ],
  },
} as const;
