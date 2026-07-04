import {
  bag,
  boysClothes,
  cosmetics,
  girlsClothes,
  jacket,
  jewellery,
  kidsFootwear,
  mensPerfume,
  scarves,
  shirts,
  trousers,
  wallets,
  watch,
  womenClothes,
  womenPerfume,
} from "../assets/assets";

export interface Product {
  name: string;
  cat: string;
  price: string;
  img: string;
}

export interface SubCategory {
  title: string;
  image: string;
}

export interface CatalogSection {
  subCats: SubCategory[];
  products: Record<string, Product[]>;
}

export const catalogData: Record<
  "All" | "Men" | "Women" | "Kids",
  CatalogSection
> = {
  All: {
    subCats: [
      {
        title: "Shirts",
        image: shirts,
      },
      {
        title: "Jackets",
        image: jacket,
      },
      {
        title: "Perfumes",
        image: mensPerfume,
      },
      {
        title: "Wallets",
        image: wallets,
      },

      {
        title: "Trousers",
        image: trousers,
      },
      {
        title: "Watches",
        image: watch,
      },
    ],
    products: {
      Shirts: [
        {
          name: "Oxford Linen Shirt",
          cat: "Shirts",
          price: "₹290",
          img: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=700&q=80&fit=crop",
        },
        {
          name: "Slim Poplin Jacket",
          cat: "Shirts",
          price: "₹240",
          img: shirts,
        },
        {
          name: "Slim Poplin Shirt",
          cat: "Shirts",
          price: "₹240",
          img: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=700&q=80&fit=crop",
        },
        {
          name: "Chambray Relaxed",
          cat: "Shirts",
          price: "₹265",
          img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&q=80&fit=crop",
        },
      ],
      Perfumes: [
        {
          name: "Noir Absolut",
          cat: "Fragrance",
          price: "₹410",
          img: "/perfume.jpeg",
        },
        {
          name: "Vetiver Mist",
          cat: "Fragrance",
          price: "₹295",
          img: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=700&q=80&fit=crop",
        },
      ],
      Wallets: [
        {
          name: "Bifold Leather",
          cat: "Accessories",
          price: "₹220",
          img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=80&fit=crop",
        },
        {
          name: "Travel Cardholder",
          cat: "Accessories",
          price: "₹195",
          img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&q=80&fit=crop",
        },
        {
          name: "The Minimalist",
          cat: "Accessories",
          price: "₹160",
          img: "https://images.unsplash.com/photo-1559656914-a30970c1affd?w=700&q=80&fit=crop",
        },
      ],
      Jackets: [
        {
          name: "Waxed Canvas Jacket",
          cat: "Outerwear",
          price: "₹890",
          img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&q=80&fit=crop",
        },
        {
          name: "Merino Overshirt",
          cat: "Outerwear",
          price: "₹620",
          img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&q=80&fit=crop",
        },
        {
          name: "Bomber Noir",
          cat: "Outerwear",
          price: "₹750",
          img: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=700&q=80&fit=crop",
        },
        {
          name: "Field Coat",
          cat: "Outerwear",
          price: "₹940",
          img: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=700&q=80&fit=crop",
        },
      ],
      Trousers: [
        {
          name: "Tailored Wide Leg",
          cat: "Trousers",
          price: "₹380",
          img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=700&q=80&fit=crop",
        },
        {
          name: "Pleated Chino",
          cat: "Trousers",
          price: "₹290",
          img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&q=80&fit=crop",
        },
        {
          name: "Slim Linen Pant",
          cat: "Trousers",
          price: "₹260",
          img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=700&q=80&fit=crop",
        },
        {
          name: "The Selvedge Jean",
          cat: "Trousers",
          price: "₹430",
          img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&q=80&fit=crop",
        },
      ],
      Watches: [
        {
          name: "Ora Chronograph",
          cat: "Watches",
          price: "₹1,850",
          img: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=700&q=80&fit=crop",
        },
        {
          name: "Minimalist Field",
          cat: "Watches",
          price: "₹1,200",
          img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=700&q=80&fit=crop",
        },
        {
          name: "Dress Classic",
          cat: "Watches",
          price: "₹2,100",
          img: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=700&q=80&fit=crop",
        },
        {
          name: "Sport Edition",
          cat: "Watches",
          price: "₹980",
          img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80&fit=crop",
        },
      ],
    },
  },

  Men: {
    subCats: [
      {
        title: "Shirts",
        image: shirts,
      },

      {
        title: "Perfumes",
        image: mensPerfume,
      },
      {
        title: "Jackets",
        image: jacket,
      },
      {
        title: "Wallets",
        image: wallets,
      },

      {
        title: "Trousers",
        image: trousers,
      },
      {
        title: "Watches",
        image: watch,
      },
    ],
    products: {
      Shirts: [
        {
          name: "Oxford Linen Shirt",
          cat: "Shirts",
          price: "₹290",
          img: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=700&q=80&fit=crop",
        },
        {
          name: "Slim Poplin Shirt",
          cat: "Shirts",
          price: "₹240",
          img: shirts,
        },
        {
          name: "Chambray Relaxed",
          cat: "Shirts",
          price: "₹265",
          img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&q=80&fit=crop",
        },
        {
          name: "Slim Poplin Jacket",
          cat: "Shirts",
          price: "₹240",
          img: jacket,
        },
      ],
      Perfumes: [
        {
          name: "Noir Absolut",
          cat: "Fragrance",
          price: "₹410",
          img: "/perfume.jpeg",
        },
        {
          name: "Vetiver Mist",
          cat: "Fragrance",
          price: "₹295",
          img: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=700&q=80&fit=crop",
        },
      ],
      Wallets: [
        {
          name: "Bifold Leather",
          cat: "Accessories",
          price: "₹220",
          img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=80&fit=crop",
        },
        {
          name: "Travel Cardholder",
          cat: "Accessories",
          price: "₹195",
          img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&q=80&fit=crop",
        },
        {
          name: "The Minimalist",
          cat: "Accessories",
          price: "₹160",
          img: "https://images.unsplash.com/photo-1559656914-a30970c1affd?w=700&q=80&fit=crop",
        },
      ],
      Jackets: [
        {
          name: "Waxed Canvas Jacket",
          cat: "Outerwear",
          price: "₹890",
          img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&q=80&fit=crop",
        },
        {
          name: "Merino Overshirt",
          cat: "Outerwear",
          price: "₹620",
          img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&q=80&fit=crop",
        },
        {
          name: "Bomber Noir",
          cat: "Outerwear",
          price: "₹750",
          img: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=700&q=80&fit=crop",
        },
        {
          name: "Field Coat",
          cat: "Outerwear",
          price: "₹940",
          img: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=700&q=80&fit=crop",
        },
      ],
      Trousers: [
        {
          name: "Tailored Wide Leg",
          cat: "Trousers",
          price: "₹380",
          img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=700&q=80&fit=crop",
        },
        {
          name: "Pleated Chino",
          cat: "Trousers",
          price: "₹290",
          img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&q=80&fit=crop",
        },
        {
          name: "Slim Linen Pant",
          cat: "Trousers",
          price: "₹260",
          img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=700&q=80&fit=crop",
        },
        {
          name: "The Selvedge Jean",
          cat: "Trousers",
          price: "₹430",
          img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&q=80&fit=crop",
        },
      ],
      Watches: [
        {
          name: "Ora Chronograph",
          cat: "Watches",
          price: "₹1,850",
          img: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=700&q=80&fit=crop",
        },
        {
          name: "Minimalist Field",
          cat: "Watches",
          price: "₹1,200",
          img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=700&q=80&fit=crop",
        },
        {
          name: "Dress Classic",
          cat: "Watches",
          price: "₹2,100",
          img: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=700&q=80&fit=crop",
        },
        {
          name: "Sport Edition",
          cat: "Watches",
          price: "₹980",
          img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80&fit=crop",
        },
      ],
    },
  },
  Women: {
    subCats: [
      {
        title: "Clothing",
        image: womenClothes,
      },
      {
        title: "Perfumes",
        image: womenPerfume,
      },
      {
        title: "Bags",
        image: bag,
      },
      {
        title: "Jewelry",
        image: jewellery,
      },
      {
        title: "Cosmetics",
        image: cosmetics,
      },
      {
        title: "Scarves",
        image: scarves,
      },
    ],
    products: {
      Clothing: [
        {
          name: "Seraphina Skirt",
          cat: "Clothing",
          price: "₹890",
          img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&q=80&fit=crop",
        },
        {
          name: "Linen Wrap Dress",
          cat: "Clothing",
          price: "₹720",
          img: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=700&q=80&fit=crop",
        },
        {
          name: "Silk Camisole",
          cat: "Clothing",
          price: "₹450",
          img: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=700&q=80&fit=crop",
        },
        {
          name: "Tailored Blazer",
          cat: "Clothing",
          price: "₹980",
          img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=80&fit=crop",
        },
      ],
      Perfumes: [
        {
          name: "Rose & Musk",
          cat: "Fragrance",
          price: "₹340",
          img: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=700&q=80&fit=crop",
        },
        {
          name: "Fleur Blanc",
          cat: "Fragrance",
          price: "₹290",
          img: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=700&q=80&fit=crop",
        },
        {
          name: "Ambre Soir",
          cat: "Fragrance",
          price: "₹380",
          img: "https://images.unsplash.com/photo-1590156562745-5231e9a8bebc?w=700&q=80&fit=crop",
        },
        {
          name: "Jasmine Attar",
          cat: "Fragrance",
          price: "₹420",
          img: "https://images.unsplash.com/photo-1547887538-047dcae43b96?w=700&q=80&fit=crop",
        },
      ],
      Bags: [
        {
          name: "The Vessel Tote",
          cat: "Bags",
          price: "₹1,450",
          img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=80&fit=crop",
        },
        {
          name: "Crescent Clutch",
          cat: "Bags",
          price: "₹680",
          img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&q=80&fit=crop",
        },
        {
          name: "Woven Shoulder",
          cat: "Bags",
          price: "₹920",
          img: "https://images.unsplash.com/photo-1614179818511-2b0ffe9c6a3d?w=700&q=80&fit=crop",
        },
        {
          name: "Mini Envelope",
          cat: "Bags",
          price: "₹540",
          img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=700&q=80&fit=crop",
        },
      ],
      Jewelry: [
        {
          name: "Arc Cuff",
          cat: "Jewelry",
          price: "₹680",
          img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=80&fit=crop",
        },
        {
          name: "Pearl Drop Earrings",
          cat: "Jewelry",
          price: "₹420",
          img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700&q=80&fit=crop",
        },
        {
          name: "Chain Statement",
          cat: "Jewelry",
          price: "₹580",
          img: "https://images.unsplash.com/photo-1573408301185-9519f94cfe88?w=700&q=80&fit=crop",
        },
        {
          name: "Signet Ring",
          cat: "Jewelry",
          price: "₹350",
          img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=80&fit=crop",
        },
      ],
      Cosmetics: [
        {
          name: "Velvet Lip Serum",
          cat: "Cosmetics",
          price: "₹95",
          img: "https://images.unsplash.com/photo-1631730486784-74757d38e388?w=700&q=80&fit=crop",
        },
        {
          name: "Glow Radiance Oil",
          cat: "Cosmetics",
          price: "₹140",
          img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&q=80&fit=crop",
        },
        {
          name: "Silk Foundation",
          cat: "Cosmetics",
          price: "₹120",
          img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700&q=80&fit=crop",
        },
        {
          name: "New Kay Lotion",
          cat: "Cosmetics",
          price: "₹2,100",
          img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=700&q=80&fit=crop",
        },
      ],
      Scarves: [
        {
          name: "Cashmere Square",
          cat: "Scarves",
          price: "₹320",
          img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=700&q=80&fit=crop",
        },
        {
          name: "Silk Twill Oblong",
          cat: "Scarves",
          price: "₹280",
          img: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=700&q=80&fit=crop",
        },
        {
          name: "Merino Wrap",
          cat: "Scarves",
          price: "₹240",
          img: "https://images.unsplash.com/photo-1478369402113-1fd53f17e8b4?w=700&q=80&fit=crop",
        },
        {
          name: "Heritage Print",
          cat: "Scarves",
          price: "₹360",
          img: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=700&q=80&fit=crop",
        },
      ],
    },
  },
  Kids: {
    subCats: [
      {
        title: "Boys",
        image: boysClothes,
      },
      {
        title: "Girls",
        image:
          "https://feelworthy.in/cdn/shop/files/photo-output110.png?v=1780055595&width=832",
      },
      {
        title: "Unisex",
        image:
          "https://feelworthy.in/cdn/shop/files/29-Photoroom.png?v=1780055766&width=832",
      },
      {
        title: "Footwear",
        image: kidsFootwear,
      },
    ],
    products: {
      Boys: [
        {
          name: "Mini Oxford Shirt",
          cat: "Boys",
          price: "₹120",
          img: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=700&q=80&fit=crop",
        },
        {
          name: "Denim Jogger",
          cat: "Boys",
          price: "₹95",
          img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=700&q=80&fit=crop",
        },
        {
          name: "Striped Tee",
          cat: "Boys",
          price: "₹75",
          img: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=700&q=80&fit=crop",
        },
        {
          name: "Linen Shorts",
          cat: "Boys",
          price: "₹90",
          img: "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=700&q=80&fit=crop",
        },
      ],
      Girls: [
        {
          name: "Tulle Party Dress",
          cat: "Girls",
          price: "₹145",
          img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=700&q=80&fit=crop",
        },
        {
          name: "Floral Pinafore",
          cat: "Girls",
          price: "₹115",
          img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=700&q=80&fit=crop",
        },
        {
          name: "Smocked Blouse",
          cat: "Girls",
          price: "₹98",
          img: "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=700&q=80&fit=crop",
        },
        {
          name: "Cotton Skirt Set",
          cat: "Girls",
          price: "₹125",
          img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=700&q=80&fit=crop",
        },
      ],
      Unisex: [
        {
          name: "Cloud Hoodie",
          cat: "Unisex",
          price: "₹135",
          img: "https://images.unsplash.com/photo-1609743522471-83c84ce23e32?w=700&q=80&fit=crop",
        },
        {
          name: "Puffer Vest",
          cat: "Unisex",
          price: "₹160",
          img: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=700&q=80&fit=crop",
        },
        {
          name: "Rib Knit Beanie",
          cat: "Unisex",
          price: "₹55",
          img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&q=80&fit=crop",
        },
        {
          name: "Canvas Backpack",
          cat: "Unisex",
          price: "₹110",
          img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80&fit=crop",
        },
      ],
      Footwear: [
        {
          name: "Canvas Sneaker",
          cat: "Footwear",
          price: "₹85",
          img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80&fit=crop",
        },
        {
          name: "Leather Sandal",
          cat: "Footwear",
          price: "₹95",
          img: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=700&q=80&fit=crop",
        },
        {
          name: "Rain Boot",
          cat: "Footwear",
          price: "₹110",
          img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=700&q=80&fit=crop",
        },
        {
          name: "Classic Loafer",
          cat: "Footwear",
          price: "₹130",
          img: "https://images.unsplash.com/photo-1518894781321-630e638d0742?w=700&q=80&fit=crop",
        },
      ],
    },
  },
};
