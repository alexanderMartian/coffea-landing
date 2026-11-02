// All site copy, links, prices and contacts live here.
// Components import from this file and never hardcode text.
export const site = {
  name: "Coffea",
  nav: {
    links: [
      { label: "home", href: "/" },
      { label: "coffee", href: "#coffee-menu" },
      { label: "bakery", href: "#dessert-menu" },
      { label: "shop", href: "#coffee-menu" },
      { label: "about", href: "/" },
    ],
    cta: { label: "login", href: "/" },
  },
  hero: {
    eyebrow: "Welcome",
    title: "We serve the richest coffee in the city!",
    // PLACEHOLDER: sample hero copy for the portfolio
    body: "Freshly roasted coffee and warm pastries, made by baristas who know your order. Pick up in minutes or stay a while.",
    cta: "Order Now",
    ctaHref: "#coffee-menu",
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
        // PLACEHOLDER: sample item, name, description and price
        title: "Lungo",
        description: "A long, smooth pour with a clean finish.",
        price: "$4.50",
        cta: "Order Now",
      },
      {
        image: "/images/coffee-menu/card-2.jpg",
        imageAlt: "Lungo coffee in a glass",
        // PLACEHOLDER: sample item, name, description and price
        title: "Espresso",
        description: "Short, strong and rich, with a golden crema.",
        price: "$3.00",
        cta: "Order Now",
      },
      {
        image: "/images/coffee-menu/card-3.jpg",
        imageAlt: "Lungo coffee with milk",
        // PLACEHOLDER: sample item, name, description and price
        title: "Americano",
        description: "Espresso topped with hot water for an easy sip.",
        price: "$3.50",
        cta: "Order Now",
      },
      {
        image: "/images/coffee-menu/card-4.jpg",
        imageAlt: "Hot lungo coffee in a mug",
        // PLACEHOLDER: sample item, name, description and price
        title: "Cappuccino",
        description: "Equal parts espresso, steamed milk and foam.",
        price: "$4.50",
        cta: "Order Now",
      },
      {
        image: "/images/coffee-menu/card-1.jpg",
        imageAlt: "Cup of lungo coffee",
        // PLACEHOLDER: sample item, name, description and price
        title: "Flat White",
        description: "Velvety microfoam over a double shot.",
        price: "$4.75",
        cta: "Order Now",
      },
      {
        image: "/images/coffee-menu/card-2.jpg",
        imageAlt: "Lungo coffee in a glass",
        // PLACEHOLDER: sample item, name, description and price
        title: "Latte",
        description: "Mild espresso with plenty of steamed milk.",
        price: "$4.75",
        cta: "Order Now",
      },
      {
        image: "/images/coffee-menu/card-3.jpg",
        imageAlt: "Lungo coffee with milk",
        // PLACEHOLDER: sample item, name, description and price
        title: "Mocha",
        description: "Espresso, chocolate and milk, topped with cream.",
        price: "$5.25",
        cta: "Order Now",
      },
      {
        image: "/images/coffee-menu/card-4.jpg",
        imageAlt: "Hot lungo coffee in a mug",
        // PLACEHOLDER: sample item, name, description and price
        title: "Cold Brew",
        description: "Steeped for 12 hours and served over ice.",
        price: "$5.00",
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
        // PLACEHOLDER: sample item, name, description and price
        title: "Tiramisu",
        description: "Coffee-soaked layers with mascarpone and cocoa.",
        price: "$5.50",
        cta: "Order Now",
      },
      {
        image: "/images/dessert-menu/card-2.jpg",
        imageAlt: "Single cup of latte art on a rustic wooden stool, viewed from above",
        // PLACEHOLDER: sample item, name, description and price
        title: "Cheesecake",
        description: "Creamy New York style on a buttery base.",
        price: "$5.75",
        cta: "Order Now",
      },
      {
        image: "/images/dessert-menu/card-3.jpg",
        imageAlt: "Cup of latte with spiral milk art on a dark blue background, viewed from above",
        // PLACEHOLDER: sample item, name, description and price
        title: "Butter Croissant",
        description: "Flaky, golden and baked fresh each morning.",
        price: "$3.75",
        cta: "Order Now",
      },
      {
        image: "/images/dessert-menu/card-4.jpg",
        imageAlt: "White cup of latte art on a saucer, on a wooden surface in warm sunlight",
        // PLACEHOLDER: sample item, name, description and price
        title: "Chocolate Brownie",
        description: "Dense and fudgy with a crisp top.",
        price: "$4.00",
        cta: "Order Now",
      },
      {
        image: "/images/dessert-menu/card-1.jpg",
        imageAlt: "Two cups of latte art on a wooden table surrounded by green plants, viewed from above",
        // PLACEHOLDER: sample item, name, description and price
        title: "Cinnamon Roll",
        description: "Soft, warm and finished with cream icing.",
        price: "$4.50",
        cta: "Order Now",
      },
      {
        image: "/images/dessert-menu/card-2.jpg",
        imageAlt: "Single cup of latte art on a rustic wooden stool, viewed from above",
        // PLACEHOLDER: sample item, name, description and price
        title: "Macarons",
        description: "Three light almond shells with a smooth filling.",
        price: "$5.00",
        cta: "Order Now",
      },
      {
        image: "/images/dessert-menu/card-3.jpg",
        imageAlt: "Cup of latte with spiral milk art on a dark blue background, viewed from above",
        // PLACEHOLDER: sample item, name, description and price
        title: "Carrot Cake",
        description: "Moist spiced cake with cream cheese frosting.",
        price: "$5.25",
        cta: "Order Now",
      },
      {
        image: "/images/dessert-menu/card-4.jpg",
        imageAlt: "White cup of latte art on a saucer, on a wooden surface in warm sunlight",
        // PLACEHOLDER: sample item, name, description and price
        title: "Apple Pie",
        description: "Cinnamon apples under a flaky lattice crust.",
        price: "$5.25",
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
    sampleNote: "Sample reviews — Coffea is a concept project.",
    // DOM order: featured card first (best UX on mobile); desktop visual order via lg:order-*
    items: [
      {
        avatar: "/images/testimonials/avatar-placeholder.jpg",
        avatarAlt: "",
        // PLACEHOLDER: Sample review for the portfolio, not a real customer
        name: "Maya R.",
        role: "Remote worker",
        rating: 5,
        body: "I work from the corner table most mornings, and by my second visit the barista already knew my order: a flat white with oat milk, no sugar. The wifi is steady, the music stays low, and nobody rushes me when I stay on through lunch with a second cup.",
      },
      {
        avatar: "/images/testimonials/avatar-placeholder.jpg",
        avatarAlt: "",
        // PLACEHOLDER: Sample review for the portfolio, not a real customer
        name: "Daniel K.",
        role: "Student",
        rating: 5,
        body: "Exam week was saved by the cold brew and a long table near the window. It is quiet enough to read for three hours straight, and the staff never made me feel awkward for nursing a single drink. The almond croissant at four o'clock is my small reward.",
      },
      {
        avatar: "/images/testimonials/avatar-placeholder.jpg",
        avatarAlt: "",
        // PLACEHOLDER: Sample review for the portfolio, not a real customer
        name: "Sofia L.",
        role: "Neighbor",
        rating: 4,
        body: "The croissants are gone by nine, so I walk over right when the doors open. Warm, flaky and still buttery inside, they go perfectly with a small cortado. I wish they baked a second batch on Saturdays, but it is worth getting up early anyway.",
      },
      {
        avatar: "/images/testimonials/avatar-placeholder.jpg",
        avatarAlt: "",
        // PLACEHOLDER: Sample review for the portfolio, not a real customer
        name: "Tom B.",
        role: "Commuter",
        rating: 5,
        body: "I grab a cold brew on my way to the train and pickup takes about two minutes. It is smooth, never bitter, and the lid actually fits, which matters on a crowded platform. My order is usually ready before I have finished checking my messages.",
      },
      {
        avatar: "/images/testimonials/avatar-placeholder.jpg",
        avatarAlt: "",
        // PLACEHOLDER: Sample review for the portfolio, not a real customer
        name: "Elena P.",
        role: "Regular",
        rating: 4,
        body: "Friday afternoons are our ritual: two mochas and whatever playlist the baristas have on. Last week they suggested a hazelnut latte that I now order every time. It feels like one of those places where people actually know your name and your usual.",
      },
      {
        avatar: "/images/testimonials/avatar-placeholder.jpg",
        avatarAlt: "",
        // PLACEHOLDER: Sample review for the portfolio, not a real customer
        name: "Noah W.",
        role: "Dessert fan",
        rating: 5,
        body: "The tiramisu is light, not too sweet, with a real coffee kick in every layer. I had it with a small espresso and honestly could have skipped dinner. The slice is generous, and the cocoa on top is dusted fresh when you order it, which I noticed.",
      },
      {
        avatar: "/images/testimonials/avatar-placeholder.jpg",
        avatarAlt: "",
        // PLACEHOLDER: Sample review for the portfolio, not a real customer
        name: "Priya S.",
        role: "Freelancer",
        rating: 4,
        body: "I spent a whole Tuesday here finishing a client project. The chairs are comfortable, there are sockets at most tables, and the prices are fair for a drink that arrives hot and looks great. The oat cappuccino became my usual afternoon fuel.",
      },
      {
        avatar: "/images/testimonials/avatar-placeholder.jpg",
        avatarAlt: "",
        // PLACEHOLDER: Sample review for the portfolio, not a real customer
        name: "James H.",
        role: "Office worker",
        rating: 5,
        body: "Ordering ahead on weekdays changed my lunch break. I send the order from the lift, walk in, and my iced americano and a ham sandwich are waiting with my name on the cup. The team stays friendly even during the busiest part of the noon rush.",
      },
      {
        avatar: "/images/testimonials/avatar-placeholder.jpg",
        avatarAlt: "",
        // PLACEHOLDER: Sample review for the portfolio, not a real customer
        name: "Lena M.",
        role: "Weekend visitor",
        rating: 5,
        body: "Found this spot on a Sunday walk and stayed for two hours. The cinnamon roll came out warm with a sticky glaze, and the cappuccino had proper latte art. We sat by the window watching the street and left with a bag of beans to take home.",
      },
    ],
  },
  newsletter: {
    // Typos fixed vs design: "ger" → "get", "in get" → "and get"
    heading: "Join in and get 15% off!",
    subheading: "Subscribe to our newsletter and get 15% off discount code.",
    inputPlaceholder: "Email address",
    cta: "Subscribe",
    imageAlt: "",
  },
  footer: {
    logo: "Coffea",
    columns: [
      {
        heading: "PRIVACY",
        links: [
          // TODO: replace / with real URLs
          { label: "Terms of use", href: "/" },
          { label: "Privacy policy", href: "/" },
          { label: "Cookies", href: "/" },
        ],
      },
      {
        heading: "SERVICES",
        links: [
          { label: "Shop", href: "#coffee-menu" },
          { label: "Order ahead", href: "#coffee-menu" },
          { label: "Menu", href: "#coffee-menu" },
        ],
      },
      {
        heading: "ABOUT US",
        links: [
          { label: "Find a location", href: "/" },
          { label: "About us", href: "/" },
          // Typo fixed: "Out story" → "Our story"
          { label: "Our story", href: "/" },
        ],
      },
      {
        // Typo fixed: "INFOTNATION" → "INFORMATION"
        heading: "INFORMATION",
        links: [
          // Typo fixed: "Plons & pricing" → "Plans & pricing"
          { label: "Plans & pricing", href: "#coffee-menu" },
          // Typo fixed: "Sell your prodcts" → "Sell your products"
          { label: "Sell your products", href: "/" },
          { label: "Jobs", href: "/" },
        ],
      },
    ],
    social: {
      heading: "SOCIAL MEDIA",
      links: [
        { label: "X", href: "/", icon: "/images/footer/icon-x.svg" },
        { label: "Instagram", href: "/", icon: "/images/footer/icon-instagram.svg" },
        { label: "Facebook", href: "/", icon: "/images/footer/icon-facebook.svg" },
        { label: "LinkedIn", href: "/", icon: "/images/footer/icon-linkedin.svg" },
      ],
    },
  },
} as const;
