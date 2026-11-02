export const site = {
  name: "babycon",
  legalName: "Babycon Retail LLP",
  tagline: "Pure. Gentle. Yours.",
  description:
    "Premium baby essentials, thoughtfully made. Soft muslin, gentle cottons and heirloom-quality pieces for your little one's first chapters.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "hello@babycon.in",
  supportEmail: "care@babycon.in",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  address: "No. 12, Kutchery Road, Mylapore, Chennai 600 004, Tamil Nadu",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  pinterest: "https://pinterest.com",
  gstin: "33ABCFB1234C1ZQ",
  freeShippingThreshold: 1499,
  shippingFee: 79,
  codFee: 49,
};

export const announcements = [
  "Free shipping on orders over ₹1,499",
  "New here? Use WELCOME10 for 10% off",
  "Soft, safe & made for delicate skin",
];

export const heroSlides = [
  {
    image: "/images/banners/hero-1.jpg",
    alt: "Soft neutral babywear styled on a cream backdrop",
    eyebrow: "The Babycon edit",
    title: "Pure. Gentle.",
    titleAccent: "Yours.",
    description:
      "Where premium meets precious. Heirloom-soft essentials for the smallest member of the family.",
    cta: { label: "Shop the collection", href: "/shop" },
    secondary: { label: "Explore newborn", href: "/collections/new-born-essentials" },
    tone: "light" as const,
    align: "left" as const,
    caption: "Muslin, cotton & a whole lot of love",
  },
  {
    image: "/images/banners/hero-2.jpg",
    alt: "Curated baby outfits at special prices",
    eyebrow: "The little luxuries sale",
    title: "Limited pieces.",
    titleAccent: "Softly reduced.",
    description:
      "A small-batch edit of our most-loved pieces, now at special prices. Once they're gone, they're gone.",
    cta: { label: "Shop special offers", href: "/collections/special-offers" },
    secondary: { label: "View bestsellers", href: "/collections/new-born-essentials" },
    tone: "dark" as const,
    align: "left" as const,
    caption: "Up to 35% off, while stock lasts",
  },
  {
    image: "/images/banners/hero-3.jpg",
    alt: "Newborn essentials laid out in soft natural tones",
    eyebrow: "For the newest hello",
    title: "Newborn",
    titleAccent: "essentials.",
    description:
      "Welcoming your little one in comfort, style and premium care. Everything you need for the first tiny days.",
    cta: { label: "Shop newborn essentials", href: "/collections/new-born-essentials" },
    secondary: { label: "Gift a bundle", href: "/collections/newborn-comfort-combo-set" },
    tone: "dark" as const,
    align: "left" as const,
    caption: "The first-chapter collection",
  },
];

export const usps = [
  {
    title: "Free shipping",
    description: "On all orders over ₹1,499, across India.",
    icon: "truck",
  },
  {
    title: "Gentle by design",
    description: "Skin-friendly fabrics, consciously chosen.",
    icon: "feather",
  },
  {
    title: "Easy 7-day returns",
    description: "A no-fuss exchange or refund window.",
    icon: "rotate",
  },
  {
    title: "Made in India",
    description: "Small-batch, made with care in Chennai.",
    icon: "heart",
  },
];

export const valuePoints = [
  {
    title: "Fabric first",
    body: "Every piece begins with the fabric. We work with breathable muslin, gentle cotton and yarns that soften with every wash — never anything that could irritate delicate skin.",
  },
  {
    title: "Small batches",
    body: "We produce in considered quantities, checking each piece by hand. It means less waste, better finishes and a little more attention in every stitch.",
  },
  {
    title: "Made to be kept",
    body: "Our silhouettes are simple and timeless on purpose — designed to be passed from sibling to sibling, then folded away in the keepsake box.",
  },
];

export const testimonials = [
  {
    name: "Ananya R.",
    city: "Bengaluru",
    rating: 5,
    text: "The muslin is even softer than it looks in the photos. My daughter has worn her kimono romper on repeat and it still feels brand new after every wash.",
    product: "Kimono romper",
    initials: "AR",
  },
  {
    name: "Meera & Kabir",
    city: "Mumbai",
    rating: 5,
    text: "We ordered the newborn combo for our hospital bag. Everything arrived beautifully wrapped, and the quality is genuinely a step above what we found in stores.",
    product: "Newborn welcome combo",
    initials: "MK",
  },
  {
    name: "Divya S.",
    city: "Chennai",
    rating: 5,
    text: "The little details — the seams, the buttons, the way the blanket drapes — tell you someone actually thought about a baby when designing this.",
    product: "Cozy blanket",
    initials: "DS",
  },
  {
    name: "Priya N.",
    city: "Hyderabad",
    rating: 5,
    text: "Bought the face towels as a gift and ended up keeping them. They are so soft and wash beautifully. Ordering another set for my sister.",
    product: "Baby face towels",
    initials: "PN",
  },
  {
    name: "Rhea M.",
    city: "Pune",
    rating: 5,
    text: "Gorgeous packaging, quick delivery, and the dress fits my one-year-old perfectly. This is my new favourite place for baby gifts.",
    product: "Winnie frock",
    initials: "RM",
  },
  {
    name: "Aisha K.",
    city: "Kochi",
    rating: 4.5,
    text: "Finally found baby clothes that look as lovely as they feel. The colours are muted and beautiful, not the usual loud prints.",
    product: "Muslin swaddle",
    initials: "AK",
  },
];

export const faqs = [
  {
    q: "What fabrics do you use?",
    a: "We work primarily with premium muslin cotton, combed cotton, ribbed knits and soft waffle fabrics. Every fabric is chosen for breathability, softness and durability, and tested against delicate newborn skin.",
  },
  {
    q: "How do I choose the right size?",
    a: "Our size guide is based on age and average measurements. For newborns, we recommend sizing up if you are unsure — a slightly roomy fit is comfortable and gives little ones room to grow. Each product page lists the available sizes.",
  },
  {
    q: "When will my order arrive?",
    a: "Orders are dispatched within 24–48 hours. Metro cities typically receive orders in 2–4 working days, and the rest of India in 4–7 working days. You will receive tracking details by email and SMS once your order ships.",
  },
  {
    q: "How can I track my order?",
    a: "Use the Track Order page with your order number and the email or phone number used at checkout. Signed-in customers can also see all orders under My Account.",
  },
  {
    q: "What is your return policy?",
    a: "Unused items with original tags and packaging can be returned within 7 days of delivery. For hygiene reasons, opened blankets, towels and innerwear cannot be returned unless faulty. See our Returns & Refunds policy for the full details.",
  },
  {
    q: "Is cash on delivery available?",
    a: "Yes, cash on delivery is available across most pincodes for orders up to ₹5,000. A nominal COD fee of ₹49 applies. You can also pay online through our secure demo checkout.",
  },
  {
    q: "Is this a real payment gateway?",
    a: "No. This storefront is a demonstration build. The Razorpay-style checkout is a fully simulated test mode — no money is charged and no real payment is processed. It is structured so that live Razorpay keys can be added later.",
  },
  {
    q: "Do you offer gift wrapping?",
    a: "All orders are packed in tissue with a babycon note card, ready to gift. If you would like a handwritten message included, add a note at checkout or write to care@babycon.in.",
  },
];

export const careSteps = [
  {
    step: "01",
    title: "Pre-wash everything",
    body: "Wash new pieces in cold water with a gentle, fragrance-free detergent before the first wear.",
  },
  {
    step: "02",
    title: "Skip the softeners",
    body: "Muslin gets softer on its own. Fabric softeners can dull the weave and reduce breathability.",
  },
  {
    step: "03",
    title: "Dry in shade",
    body: "Line dry or tumble on low. Avoid direct sun on prints and colours to keep them looking new.",
  },
];

export const contactPage = {
  title: "We're here for you",
  intro:
    "Questions about sizing, fabric or an order? Write to us — a real person from our small team will get back within one working day.",
  hours: "Monday – Saturday, 10am – 6pm IST",
};

export const pages: Record<
  string,
  { title: string; eyebrow: string; intro: string; sections: { heading: string; body: string[] }[] }
> = {
  about: {
    title: "Made for the first tiny days",
    eyebrow: "Our story",
    intro:
      "Babycon began with a simple frustration: beautiful baby clothes that felt lovely on the hanger but rough against a newborn's skin. We decided to make the alternative — pieces that are as gentle as they are beautiful.",
    sections: [
      {
        heading: "Why we exist",
        body: [
          "We are a small team of parents, designers and fabric obsessives based in Chennai. We believe the things that touch a baby should be held to a higher standard: soft, breathable, safe and made to last beyond a season.",
          "Every collection starts with the fabric. We source premium muslin and cotton, keep our batches small, and check each piece by hand before it is folded into a babycon box.",
        ],
      },
      {
        heading: "Our promise",
        body: [
          "We promise to keep listening to parents, to choose gentler fabrics, to design for real life — naps, spit-ups, first steps and all — and to make pieces you will want to keep long after they have been outgrown.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy policy",
    eyebrow: "Legal",
    intro:
      "Your trust matters to us. This policy explains what we collect, why we collect it, and how we keep it safe.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "When you place an order we collect your name, email address, phone number and delivery address. If you create an account, we store a securely hashed version of your password. We also collect basic, anonymised analytics about how people use the store.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "We use your details to process and deliver orders, to send order updates, and to respond to your enquiries. With your consent, we may send occasional emails about new collections. You can unsubscribe at any time.",
          "We never sell your personal information. Payment information is handled by our payment partner and is never stored on our servers.",
        ],
      },
      {
        heading: "Cookies & security",
        body: [
          "We use essential cookies for your cart, sign-in session and checkout security. Data is transmitted over HTTPS and access to customer records is restricted to authorised team members.",
          "To request a copy or deletion of your data, write to care@babycon.in.",
        ],
      },
    ],
  },
  shipping: {
    title: "Shipping policy",
    eyebrow: "Good to know",
    intro:
      "We dispatch every order with care, usually within one working day. Here is what to expect after you hit checkout.",
    sections: [
      {
        heading: "Dispatch & delivery",
        body: [
          "Orders placed before 2pm IST are usually packed the same day. Delivery within metro cities takes 2–4 working days; other locations in India take 4–7 working days.",
          "You will receive an email and SMS with tracking details once your parcel leaves our studio. Our courier partners deliver on all weekdays and select Saturdays.",
        ],
      },
      {
        heading: "Shipping charges",
        body: [
          "Shipping is free on orders above ₹1,499. A flat fee of ₹79 applies to smaller orders. Cash on delivery orders carry an additional ₹49 handling fee.",
        ],
      },
      {
        heading: "Undelivered parcels",
        body: [
          "If a parcel is returned to us as undeliverable after three attempts, we will contact you to arrange a re-delivery. Additional shipping charges may apply. Please ensure your phone number and address are correct at checkout.",
        ],
      },
    ],
  },
  refund: {
    title: "Returns & refunds",
    eyebrow: "Good to know",
    intro:
      "If something is not right, we will make it right. Our returns window is 7 days from delivery.",
    sections: [
      {
        heading: "What can be returned",
        body: [
          "Unused, unwashed items with original tags and packaging can be returned within 7 days of delivery. For hygiene reasons, opened muslin cloths, towels, blankets and socks cannot be returned unless they are faulty.",
          "Made-to-order or personalised pieces are final sale.",
        ],
      },
      {
        heading: "How to start a return",
        body: [
          "Email care@babycon.in with your order number and a photo of the item. We will arrange a pickup where available, or share a return address. Once we receive and inspect the item, refunds are processed to the original payment method within 5–7 working days.",
        ],
      },
      {
        heading: "Exchanges & damaged items",
        body: [
          "We are happy to exchange for another size, subject to stock. If your order arrived damaged or incorrect, let us know within 48 hours and we will cover return shipping and send a replacement.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of service",
    eyebrow: "Legal",
    intro:
      "This website is operated by Babycon Retail LLP. By using it, you agree to these terms.",
    sections: [
      {
        heading: "Orders & pricing",
        body: [
          "All prices are listed in Indian Rupees and include applicable GST. We reserve the right to refuse or cancel an order if an item is mispriced, out of stock or suspected of fraud. You will be notified and refunded in full.",
          "Product colours may appear slightly different depending on your screen. We photograph everything in natural light to keep colours as accurate as possible.",
        ],
      },
      {
        heading: "Demo checkout notice",
        body: [
          "This build includes a demonstration payment flow. The Razorpay-style checkout is a simulation and does not process real money. Orders created in this build are test orders and are not legally binding. Live payments can be enabled only by integrating real payment credentials.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "All content on this site — including text, logos, product names and photography — is the property of Babycon Retail LLP or its licensors and may not be reproduced without permission.",
        ],
      },
    ],
  },
};

export const footerLinks = {
  shop: [
    { label: "Shop all", href: "/shop" },
    { label: "Newborn essentials", href: "/collections/new-born-essentials" },
    { label: "Baby girl", href: "/collections/baby-girl" },
    { label: "Baby boy", href: "/collections/baby-boy" },
    { label: "Combo sets", href: "/collections/newborn-comfort-combo-set" },
    { label: "Special offers", href: "/collections/special-offers" },
  ],
  help: [
    { label: "Track your order", href: "/track-order" },
    { label: "My account", href: "/account" },
    { label: "Contact us", href: "/contact" },
    { label: "Shipping policy", href: "/pages/shipping" },
    { label: "Returns & refunds", href: "/pages/refund" },
    { label: "FAQs", href: "/faq" },
  ],
  house: [
    { label: "Our story", href: "/pages/about" },
    { label: "Fabrics & care", href: "/pages/about#fabric" },
    { label: "Privacy policy", href: "/pages/privacy" },
    { label: "Terms of service", href: "/pages/terms" },
  ],
};

export const paymentMethods = ["UPI", "Visa", "Mastercard", "RuPay", "COD"];
