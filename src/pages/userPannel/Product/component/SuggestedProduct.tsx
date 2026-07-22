import { jacket, shirts } from "../../../../assets/assets";
import OutlinedButton from "../../../../components/Common/Button/OutlinedButton";
import Heading from "../../../../components/Common/Heading";
import ProductCard from "./ProductCard";

let products = [
{
        "_id": "6a5de56313b4a9e0d5857005",
        "title": "test",
        "description": "test",
        "rating": 0,
        "image": "https://macreelinfosoft-bucket.s3.ap-south-1.amazonaws.com/Vyraaa-Admin-Images/1784538466929.jpeg",
        "subImages": [],
        "appendSizeTypeToSize": true,
        "color": "Scarlet",
        "category": "Clothes",
        "subCategory": "Jeans",
        "subcategoryType": "6a5636245a2f60df17a92d5c",
        "brand": "Zara",
        "gender": "Men",
        "ageRange": "Adult",
        "sizeType": "Alpha",
        "price": [
            {
                "size": {
                    "_id": "6a474523860ccf879fb4a414",
                    "size": "S"
                },
                "amount": 340.2,
                "isAvailable": true,
                "isFewLeft": false,
                "markupPrice": 567,
                "discount": 40,
                "skuCode": "jj",
                "_id": "6a5de56313b4a9e0d5857006"
            }
        ],
        "attributes": [
            {
                "property": "Waist Rise",
                "value": "jhj",
                "_id": "6a5de56313b4a9e0d5857007"
            }
        ],
        "linkItems": [],
        "averageRating": 0,
        "searchKeywords": [
            "test",
            "clothes",
            "jeans",
            "bottom",
            "zara",
            "scarlet",
            "men",
            "adult",
            "alpha",
            "s",
            "waist rise",
            "waistrise",
            "waist",
            "rise",
            "jhj"
        ],
        "createdAt": "2026-07-20T09:07:47.987Z",
        "updatedAt": "2026-07-20T09:07:48.098Z",
        "__v": 0,
        "isDeleted": false
    }
];

const buttons = [
  "More Face Wash and Cleanser",
  "More Purple Face Wash and Cleanser",,
];

export default function SuggestedProduct() {
  return (
    <section className="bg-surface py-16">
      <div className="px-5 sm:px-10 lg:px-20 ">
        <Heading
          value={{
            text: "Similar Products",
            position: "start",
          }}
        />

        {/* Products grid */}
        <div className=" mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p: any) => (
            <ProductCard product={p} />
          ))}
          {products.length === 0 && (
            <p className="col-span-full text-center text-muted text-sm py-10">
              No products in this category yet.
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-5">
          {buttons.map((elm) => (
            <>
              <OutlinedButton text={elm}  />
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
