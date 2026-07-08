import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import FormHeader from "./components/FormHeader";
import SuccessBanner from "./components/SuccessBanner";
import TaxonomySection from "./components/TaxonomySection";
import CoreInfoSection from "./components/CoreInfoSection";
import VariantsSection from "./components/VariantsSection";
import AttributesSection from "./components/AttributesSection";
import MediaSection from "./components/MediaSection";

import useCategoryData from "./api/useCategoryData";
import useTaxonomyData from "./api/useTaxonomyData";
import useColorFamilyData from "./api/useColorFamilyData";
import useSizeTypeData from "./api/useSizeTypeData";

import { quickAddSchema, quickAddDefaultValues } from "./schema";
import type { QuickAddValues } from "./types";
import useSubCategoryTypeData from "./api/useSubCategoryTypes";
import useColorData from "./api/useColorData";
import useSizeValueData from "./api/useSizeValueData";
import usePropertyTypeData from "./api/usePropertyTypeData";
import usePropertyValueData from "./api/usePropertyValueData";
import usePostQuery from "../../../hooks/postQuery.hook";
import { apiUrls } from "../../../apis";
import useBrandData from "./api/useBrandData";

const TOTAL_SECTIONS = 5;

const QuickAddProduct = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<QuickAddValues>({
    resolver: yupResolver(quickAddSchema),
    defaultValues: quickAddDefaultValues,
  });

  // --- Watched fields ---------------------------------------------------
  const selectedCategoryId = watch("category");
  const selectedSubcategoryId = watch("subcategory");
  const selectedSubcategoryTypeId = watch("subcategoryType");
  const selectedColorFamily = watch("colorFamily");
  const selectedSizeType = watch("sizeType");
  const images = watch("images") || [];
  const attributes = watch("attributes") || [];
  const variants = watch("variants") || [];

  // --- Data sources -------------------------------------------------------
  const { categoryOptions, isLoading: categoryLoading } = useCategoryData();
  const { subcategoryOptions, isLoading: subcategoryLoading } =
    useTaxonomyData(selectedCategoryId);
  const { subcategoryTypeOptions, isLoading: subcategoryTypeLoading } =
    useSubCategoryTypeData(selectedSubcategoryId);
  const { colorFamilyOptions } = useColorFamilyData();
  const { colorOptions } = useColorData(selectedColorFamily);
  const { sizeTypeOptions } = useSizeTypeData();
  const { sizeValueOptions } = useSizeValueData(selectedSizeType);
  const { propertyTypeOptions } = usePropertyTypeData(selectedSubcategoryId);
    // const { propertyValueOptions } = usePropertyValueData(selected);
  const { brandOptions} = useBrandData(selectedCategoryId);


  // const typeOptions = selectedSubcategoryId ? getTypeOptions(selectedSubcategory) : [];
  // const colorOptions = selectedColorFamily
  //   ? getColorOptions(selectedColorFamily)
  //   : [];
  // const sizeOptions = selectedSizeType ? getSizeOptions(selectedSizeType) : [];

  // --- Cascading resets ----------------------------------------------------
  // Whenever a parent field changes, clear the dependent child field(s) so
  // stale selections never survive a change higher up the taxonomy tree.
  useEffect(() => {
    setValue("subcategory", "");
    setValue("subcategoryType", "");
  }, [selectedCategoryId, setValue]);

  useEffect(() => {
    setValue("subcategoryType", "");
  }, [selectedSubcategoryId, setValue]);

  useEffect(() => {
    setValue("color", "");
  }, [selectedColorFamily, setValue]);

  // --- Progress ------------------------------------------------------------
  const completedSections = [
    Boolean(
      selectedCategoryId && selectedSubcategoryId && watch("subcategoryType"),
    ),
    Boolean(
      watch("name") &&
      watch("description") &&
      selectedColorFamily &&
      watch("color") &&
      selectedSizeType,
    ),
    variants.length > 0,
    attributes.length > 0,
    images.length > 0,
  ].filter(Boolean).length;

  let { postQuery } = usePostQuery();

  // --- Submission ------------------------------------------------------------
  const onSubmit = (data: QuickAddValues) => {

console.log(data, "uyydg")

const payload = {
  title: data.name,
  description: data.description,

  // Set the first image as the main image, default to empty string if none exists
  image: data.images && data.images.length > 0 ? data.images[0] : "",
  
  brand: "6a474fc92ea6d2ca5c31d3fc", // Hardcoded based on your draft

  // Map any additional images into the expected subImages array of objects
  subImages: data.images && data.images.length > 1 
    ? data.images.slice(1).map((img) => ({ imageUrl: img }))
    : [],

  color: data.color,
  category: data.category,
  subCategory: data.subcategory,
  subcategoryType: data.subcategoryType || null,
  sizeType: data.sizeType,

  // Transform variants into the API's expected 'price' format
  price: data.variants.map((variant) => ({
    size: variant.size.value, // Extract the ID string from the size object
    amount: variant.price,    // Map 'price' from data to 'amount' for the API
    isAvailable: variant.isAvailable,
    isFewLeft: variant.isFewLeft,
    markupPrice: variant.price || 0, // Fallback to 0 if not present in your data
    discount: variant.discountPrice || 0        // Fallback to 0 if not present in your data
  })),

  // Safely map attributes, defaulting to an empty array if undefined
  attributes: data.attributes ? data.attributes.map((item) => ({
    property: item.property,
    value: item.value,
  })) : [],

  // Pass linkItems if they exist in your data, otherwise default to an empty array
  linkItems:  []
};
    
    postQuery({
      url: `${apiUrls.Product.add}`,
      postData: payload,
      onSuccess: (res: any) => {
        console.log(res);
      },
      onFail: (err: any) => {
        console.log(err);
      },
    });
    console.log("Quick Add Payload:", data);
    setShowSuccess(true);
    reset();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-body font-body selection:bg-rose-gold/30">
      <main className="flex-1 overflow-y-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto flex h-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8"
        >
          {showSuccess && (
            <SuccessBanner
              message="Product quickly added to inventory!"
              onDismiss={() => setShowSuccess(false)}
            />
          )}

          <FormHeader
            completedSections={completedSections}
            totalSections={TOTAL_SECTIONS}
            onClear={() => reset()}
          />

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* LEFT COLUMN: Data Entry */}
            <div className="flex flex-col gap-8">
              <TaxonomySection
                register={register}
                errors={errors}
                categoryOptions={categoryOptions}
                categoryLoading={categoryLoading}
                selectedCategory={selectedCategoryId}
                selectedSubcategory={selectedSubcategoryId}
                subcategoryOptions={subcategoryOptions}
                subcategoryLoading={subcategoryLoading}
                subcategoryType={selectedSubcategoryTypeId}
                subcategoryTypeOptions={subcategoryTypeOptions}
                subcategoryTypeLoading={subcategoryTypeLoading}
                // typeOptions={subcategoryTypeOptions}
              />

              <CoreInfoSection
                register={register}
                errors={errors}
                colorFamilyOptions={colorFamilyOptions}
                selectedColorFamily={selectedColorFamily}
                colorOptions={colorOptions}
                sizeTypeOptions={sizeTypeOptions}
                brandOptions = {brandOptions}
              />

              <VariantsSection
                variants={variants}
                setVariants={(v) => setValue("variants", v as any)}
                sizeOptions={sizeTypeOptions}
                sizeTypeSelected={selectedSizeType}
                errorMessage={errors.variants?.message as string | undefined}
              />

              <AttributesSection
                attributes={attributes}
                setAttributes={(a) => setValue("attributes", a)}
                propertyTypeOptions={propertyTypeOptions}
                selectedSubcategoryId={selectedSubcategoryId}
                // propertyValueOptions={propertyValueOptions}
              />
            </div>

            {/* RIGHT COLUMN: Media */}
            <div className="flex flex-col gap-8">
              <MediaSection
                images={images}
                setImages={(imgs) => setValue("images", imgs)}
                errorMessage={errors.images?.message as string | undefined}
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default QuickAddProduct;
