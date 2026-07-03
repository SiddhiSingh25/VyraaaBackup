// export interface NavChild {
//   label: string;
//   to: string;
// }

// export interface NavColumn {
//   title: string;
//   links: NavChild[];
// }

// export interface NavLink {
//   label: string;
//   to: string;
//   columns?: NavColumn[];
// }

// // Edit this list to match your real catalog structure.
// // Links with `columns` automatically get a mega menu on desktop
// // and a nested accordion on mobile.
// export const NAV_LINKS: NavLink[] = [
//   {
//     label: "Clothing",
//     to: "/clothing",
//     columns: [
//       {
//         title: "Silhouettes",
//         links: [
//           { label: "Dresses", to: "/clothing/dresses" },
//           { label: "Co-ords", to: "/clothing/co-ords" },
//           { label: "Outerwear", to: "/clothing/outerwear" },
//           { label: "Separates", to: "/clothing/separates" },
//         ],
//       },
//       {
//         title: "Edits",
//         links: [
//           { label: "Bridal Edit", to: "/clothing/bridal" },
//           { label: "Evening Wear", to: "/clothing/evening" },
//           { label: "New Season", to: "/clothing/new-season" },
//         ],
//       },
//     ],
//   },
//   { label: "Bags", to: "/bags" },
//   { label: "Perfumes", to: "/perfumes" },
//   { label: "Skin care", to: "/skincare" },
//   { label: "", to: "/atelier" },
// ];

export interface NavChild {
  label: string;
  to: string;
}

export interface NavColumn {
  title: string;
  links: NavChild[];
}

export interface NavLink {
  label: string;
  to: string;
  columns?: NavColumn[];
}

export const NAV_LINKS: NavLink[] = [
  {
    label: "Clothing",
    to: "/clothing",
    columns: [
      {
        title: "Shop By Category",
        links: [
          { label: "T-Shirts", to: "/clothing/tshirts" },
          { label: "Shirts", to: "/clothing/shirts" },
          { label: "Jeans", to: "/clothing/jeans" },
          { label: "Kurtis", to: "/clothing/kurtis" },
          { label: "Cord Sets", to: "/clothing/cord-sets" },
        ],
      },
      {
        title: "Featured",
        links: [
          { label: "New Arrivals", to: "/new-arrivals" },
          { label: "Best Sellers", to: "/best-sellers" },
          { label: "Trending", to: "/trending" },
          { label: "Sale", to: "/sale" },
        ],
      },
    ],
  },

  {
    label: "Beauty",
    to: "/beauty",
    columns: [
      {
        title: "Cosmetics",
        links: [
          { label: "Lipsticks", to: "/beauty/lipsticks" },
          { label: "Nail Polish", to: "/beauty/nail-polish" },
          { label: "Talcum Powder", to: "/beauty/talcum-powder" },
          { label: "View All", to: "/beauty/cosmetics" },
        ],
      },
      {
        title: "Skin Care",
        links: [
          { label: "Face Wash", to: "/beauty/face-wash" },
          { label: "Moisturizer", to: "/beauty/moisturizer" },
          { label: "Shampoo", to: "/beauty/shampoo" },
          { label: "Body Lotion", to: "/beauty/body-lotion" },
          { label: "Body Wash", to: "/beauty/body-wash" },
        ],
      },
    ],
  },

  {
    label: "Perfumes",
    to: "/perfumes",
    columns: [
      {
        title: "Collections",
        links: [
          { label: "For Women", to: "/perfumes/women" },
          { label: "For Men", to: "/perfumes/men" },
          { label: "Luxury", to: "/perfumes/luxury" },
          { label: "Gift Sets", to: "/perfumes/gift-sets" },
        ],
      },
    ],
  },

  {
    label: "Shoes",
    to: "/shoes",
    columns: [
      {
        title: "Footwear",
        links: [
          { label: "Sneakers", to: "/shoes/sneakers" },
          { label: "Casual", to: "/shoes/casual" },
          { label: "Formal", to: "/shoes/formal" },
          { label: "Sports", to: "/shoes/sports" },
        ],
      },
    ],
  },

  // {
  //   label: "Bags",
  //   to: "/bags",
  //   columns: [
  //     {
  //       title: "Collections",
  //       links: [
  //         { label: "Handbags", to: "/bags/handbags" },
  //         { label: "Tote Bags", to: "/bags/tote" },
  //         { label: "Backpacks", to: "/bags/backpacks" },
  //         { label: "Crossbody", to: "/bags/crossbody" },
  //       ],
  //     },
  //   ],
  // },

  {
    label: "More",
    to: "/more",
    columns: [
      {
        title: "Explore",
        links: [
          { label: "Bags", to: "/bags" },
          // { label: "Accessories", to: "/accessories" },
          { label: "Gift Cards", to: "/gift-cards" },
          { label: "Offers", to: "/offers" },
          { label: "Collections", to: "/collections" },
        ],
      },
    ],
  },
];