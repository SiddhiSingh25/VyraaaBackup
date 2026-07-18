// // import { IoArrowForward } from "react-icons/io5";
// // import { womenPerfume } from "../../../../assets/assets";
// // import { useReveal } from "../../../../hooks/gsap/useReveal";
// // import SectionHeader from "../../../../components/Common/Headers/SectionHeader";
// // import { Link } from "react-router-dom";

// // interface Collection {
// //   index: string;
// //   title: string;
// //   image: string;
// //   midLift?: boolean;
// // }

// // const COLLECTIONS = [
// //   {
// //     index: "01",
// //     title: "Clothing",
// //     image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&fit=crop",
// //     to : "/clothing"
// //   },
// //   {
// //     index: "02",
// //     title: "Perfumes",
// //     image: womenPerfume,
// //     midLift: true,
// //      to : "/clothing"
// //   },
// //   {
// //     index: "03",
// //     title: "Jewelry",
// //     image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&fit=crop",
// //     to : "/clothing"
// //   },
// // ];

// // export default function FeaturedCollections() {
// //   const ref = useReveal<HTMLElement>();

// //   return (
// //     <section ref={ref} className="py-10 px-5 sm:px-10 lg:px-20 ">

// //       <SectionHeader  viewAllLink="/"
// //   viewAllText = "View All" tagline="Popular Products"
// //   title="Products"  />

// //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
// //         {COLLECTIONS.map((c) => (
// //           <Link
// //           to={c.to}

// //             key={c.title}
// //             data-reveal
// //             className={`group relative overflow-hidden rounded-2xl aspect-[4/5] ${
// //               c.midLift ? "sm:col-span-2 md:col-span-1 md:-mt-8" : ""
// //             }`}
// //           >
// //             <img
// //               src={c.image}
// //               alt={c.title}
// //               className="w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
// //             />
// //             <div className="absolute inset-0 bg-gradient-to-t from-heading/70 via-heading/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
// //               <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">
// //                 {c.index}
// //               </span>
// //               <h3 className="font-heading text-white text-2xl sm:text-3xl font-light mb-3 sm:mb-4">
// //                 {c.title}
// //               </h3>
// //               <a
// //                 href="#"
// //                 className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/70 flex items-center gap-2 hover:text-white group-hover:gap-4 transition-all duration-300"
// //               >
// //                 Explore
// //                 <span className="material-symbols-outlined text-[16px]"><IoArrowForward/></span>
// //               </a>
// //             </div>
// //           </Link>
// //         ))}
// //       </div>
// //     </section>
// //   );
// // }

// import { IoArrowForward } from "react-icons/io5";
// import { womenPerfume } from "../../../../assets/assets";
// import { useReveal } from "../../../../hooks/gsap/useReveal";
// import SectionHeader from "../../../../components/Common/Headers/SectionHeader";
// import { Link, useNavigate } from "react-router-dom";
// import { apiUrls } from "@/apis";
// import { useEffect, useState } from "react";
// import useGetQuery from "@/hooks/getQuery.hook";




// export default function FeaturedCollections() {
//   const ref = useReveal<HTMLElement>();

//   const [categories, setCategories] = useState([])
//   const navigate = useNavigate()

//   let { getQuery } = useGetQuery()

//   useEffect(() => {
//     getQuery({
//       url: apiUrls.Category.getAll,
//       onSuccess: (res: any) => {
//         let data = res.data.slice(0, 3)
//         setCategories(data);
//       },
//       onFail: (res: any) => {
//         console.log(res);
//       },
//     });
//   }, [getQuery]);


//   return (
//     <section ref={ref} className="py-4 px-5 sm:px-10 lg:px-20 ">

//       <SectionHeader viewAllLink="/"
//         viewAllText="View All" tagline="Popular Products"
//         title="Products" />
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
//         {categories.map((cat: any, idx) => (
//           <button
//             key={cat._id}
//             onClick={() => {
//               navigate("/clothing", {
//                 state: {
//                   categoryId: cat._id,
//                   fullCategoryData: cat,
//                 },
//               });
//             }}
//             data-reveal
//             className={`group relative overflow-hidden rounded-2xl aspect-[4/5] ${idx === 1 ? "sm:col-span-2 md:col-span-1 md:-mt-8" : ""
//               }`}
//           >
//             <img
//               src={cat.image}
//               alt={cat.category}
//               className="w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
//             />

//             {/* Overlay */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent">
//               <div className="absolute left-6 right-6 bottom-6">
//                 <span className="block text-[10px] tracking-[0.35em] uppercase text-white/60 mb-2">
//                   0{idx + 1}
//                 </span>

//                 <h3 className="font-heading text-white text-3xl font-light leading-none mb-3">
//                   {cat.category}
//                 </h3>

//                 <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] uppercase text-white/80 transition-all duration-300 group-hover:gap-4">
//                   <span>Explore</span>
//                   <IoArrowForward className="text-sm" />
//                 </div>
//               </div>
//             </div>
//           </button>
//         ))}
//       </div>
//     </section>
//   );
// }

import { IoArrowForward } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

import { useReveal } from "../../../../hooks/gsap/useReveal";
import SectionHeader from "../../../../components/Common/Headers/SectionHeader";

export default function FeaturedCollections() {
  const ref = useReveal<HTMLElement>();

  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();
  const { getQuery } = useGetQuery();

  useEffect(() => {
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => {
        setCategories(res.data.slice(0, 3));
      },
      onFail: (err: any) => {
        console.log(err);
      },
    });
  }, [getQuery]);

  return (
    <section ref={ref} className="py-10 px-5 sm:px-10 lg:px-20">
      <SectionHeader
        viewAllLink="/"
        viewAllText="View All"
        tagline="Popular Products"
        title="Products"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {categories.map((cat: any, index) => (
          <div
            key={cat._id}
            data-reveal
            onClick={() => {
              const routeParam = cat?.category?.toLowerCase().replace(/\s+/g, '-');
              navigate(`/${routeParam}`, {
                state: {
                  categoryId: cat?._id,
                  fullCategoryData: cat
                }
              });
            }}
            className={`group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer ${index === 1
              ? "sm:col-span-2 md:col-span-1 md:-mt-8"
              : ""
              }`}
          >
            <img
              src={cat.image}
              alt={cat.category}
              className="w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-heading/70 via-heading/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="font-heading text-white text-2xl sm:text-3xl font-light mb-3 sm:mb-4">
                {cat.category}
              </h3>

              <div className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/70 flex items-center gap-2 group-hover:text-white group-hover:gap-4 transition-all duration-300">
                Explore
                <IoArrowForward className="text-base" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}