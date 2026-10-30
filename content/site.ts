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
        imageAlt: "Two cups of latte art on a wooden table surrounded by green plants, viewed from above",
        // PLACEHOLDER: lorem from the design
        title: "Lungo coffee",
        // PLACEHOLDER: lorem from the design
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
        price: "Rs. 200",
        cta: "Order Now",
      },
      {
        image: "/images/dessert-menu/card-2.jpg",
        imageAlt: "Single cup of latte art on a rustic wooden stool, viewed from above",
        // PLACEHOLDER: lorem from the design
        title: "Lungo coffee",
        // PLACEHOLDER: lorem from the design
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
        price: "Rs. 200",
        cta: "Order Now",
      },
      {
        image: "/images/dessert-menu/card-3.jpg",
        imageAlt: "Cup of latte with spiral milk art on a dark blue background, viewed from above",
        // PLACEHOLDER: lorem from the design
        title: "Lungo coffee",
        // PLACEHOLDER: lorem from the design
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
        price: "Rs. 200",
        cta: "Order Now",
      },
      {
        image: "/images/dessert-menu/card-4.jpg",
        imageAlt: "White cup of latte art on a saucer, on a wooden surface in warm sunlight",
        // PLACEHOLDER: lorem from the design
        title: "Lungo coffee",
        // PLACEHOLDER: lorem from the design
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
        price: "Rs. 200",
        cta: "Order Now",
      },
    ],
  },
  promo: {
    heading: "Check Out Our Best Coffee Beans",
    // PLACEHOLDER: "Explore Out Products" in Figma (likely typo for "Our")
    cta: "Explore Our Products",
    ctaHref: "#coffee-menu",
  },
  testimonials: {
    eyebrow: "Come and Join",
    heading: "our happy customers",
    // DOM order: featured card first (best UX on mobile); desktop visual order via lg:order-*
    items: [
      {
        avatar: "/images/testimonials/avatar-placeholder.jpg",
        // PLACEHOLDER: real customer photo
        avatarAlt: "",
        // PLACEHOLDER: customer name (lorem/name from the design — node 0:198)
        name: "James Smith",
        // PLACEHOLDER: customer role (from the design — node 0:199)
        role: "Entrepreneur",
        rating: 5,
        // PLACEHOLDER: lorem from the design (node 0:206)
        body: "Lorem ipsum dolor sit amet, consectetur adipisicing ,Lorem ipsum dolor sit amet, consectetur adipisicing  dolor sit amet, consectetur adipisicing elit,Lorem ipsum  amet, consectetur adipisicing elit,Lorem ipsum dolor sit  adipisicing elit,Lorem ipsum dolor sit   dolor sit amet, consectetur adipisicing elit,",
      },
      {
        avatar: "/images/testimonials/avatar-placeholder.jpg",
        // PLACEHOLDER: real customer photo
        avatarAlt: "",
        // PLACEHOLDER: customer name (lorem/name from the design — node 0:216)
        name: "James Smith",
        // PLACEHOLDER: customer role (from the design — node 0:217)
        role: "Entrepreneur",
        rating: 4,
        // PLACEHOLDER: lorem from the design (node 0:224)
        body: "Lorem ipsum dolor sit amet, consectetur adipisicing ,Lorem ipsum dolor sit amet, consectetur adipisicing  dolor sit amet, consectetur adipisicing elit,Lorem ipsum  amet, consectetur adipisicing elit,Lorem ipsum dolor sit  adipisicing elit,Lorem ipsum dolor sit   dolor sit amet, consectetur adipisicing elit,",
      },
      {
        avatar: "/images/testimonials/avatar-placeholder.jpg",
        // PLACEHOLDER: real customer photo
        avatarAlt: "",
        // PLACEHOLDER: customer name (lorem/name from the design — node 0:230)
        name: "James Smith",
        // PLACEHOLDER: customer role (from the design — node 0:231)
        role: "Entrepreneur",
        rating: 3,
        // PLACEHOLDER: lorem from the design (node 0:238)
        body: "Lorem ipsum dolor sit amet, consectetur adipisicing ,Lorem ipsum dolor sit amet, consectetur adipisicing  dolor sit amet, consectetur adipisicing elit,Lorem ipsum  amet, consectetur adipisicing elit,Lorem ipsum dolor sit  adipisicing elit,Lorem ipsum dolor sit   dolor sit amet, consectetur adipisicing elit,",
      },
    ],
  },
} as const;
