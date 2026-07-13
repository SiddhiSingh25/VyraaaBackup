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
import { useToast } from "../../../hooks/useToast.hook";

const TOTAL_SECTIONS = 5;

const QuickAddProduct = () => {
  const [showSuccess, setShowSuccess] = useState(false);


  const  {toast} = useToast()

  const {
    register,
    handleSubmit,
    watch,
    control,
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

  const category = watch("category");
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  console.log(category, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");



  // --- Data sources -------------------------------------------------------
  const { categoryOptions, addCategory, getCategoryLoading } =
    useCategoryData();

  const handleAddCategory = (categoryName?: string) => {
    if (!categoryName?.trim()) return;
    addCategory(categoryName.trim(), (newCategory) => {
      setValue("category", newCategory._id);
    });
  };

  const handleAddSubCategory = (subcategoryName?: string) => {
    if (!selectedCategoryId || !subcategoryName?.trim()) return;
    addSubCategory(subcategoryName.trim(), (newSubCategory) => {
      setValue("subcategory", newSubCategory._id);
    });
  };

  const handleAddColorFamily = (colorFamilyName?: string) => {
    if (!colorFamilyName?.trim()) return;
    addColorFamily(colorFamilyName.trim(), (newFamily) => {
      setValue("colorFamily", newFamily._id);
    });
  };

  const handleAddSizeType = (sizeTypeName?: string) => {
    if (!sizeTypeName?.trim()) return;
    addSizeType(sizeTypeName.trim(), (newType) => {
      setValue("sizeType", newType._id);
    });
  };

  const handleAddBrand = (brandName?: string) => {
    if (!selectedCategoryId || !brandName?.trim()) return;
    addBrand(brandName.trim(), (newBrand) => {
      setValue("brand", newBrand._id);
    });
  };

  const {
    subcategoryOptions,
    addSubCategory,
    isLoading: subcategoryLoading,
  } = useTaxonomyData(selectedCategoryId);
  const { subcategoryTypeOptions, isLoading: subcategoryTypeLoading } =
    useSubCategoryTypeData(selectedSubcategoryId);
  const { colorFamilyOptions, addColorFamily } = useColorFamilyData();
  const { colorOptions } = useColorData(selectedColorFamily);
  const { sizeTypeOptions, addSizeType } = useSizeTypeData();
  const { sizeValueOptions } = useSizeValueData(selectedSizeType);
  const { propertyTypeOptions } = usePropertyTypeData(selectedSubcategoryId);
  // const { propertyValueOptions } = usePropertyValueData(selected);
  const { brandOptions, addBrand } = useBrandData(selectedCategoryId);

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

  const handleMediaFiles = (files: File[]) => {
    setImageFiles((prev) => [...prev, ...files]);
  };

  const { postQuery } = usePostQuery();

  const handleRemoveImage = (index: number) => {
    setValue("images", images.filter((_img, idx) => idx !== index));
    setImageFiles((prev) => prev.filter((_file, idx) => idx !== index));
  };

  const uploadImages = async (files: File[]) => {
    const imageUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await postQuery({
        url: apiUrls.Image.upload,
        postData: formData,
      });

      if (!uploadResponse?.data) {
        throw new Error("Image upload failed");
      }

      imageUrls.push(uploadResponse.data);
    }

    return imageUrls;
  };

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

  // --- Submission ------------------------------------------------------------
  const onSubmit = async (data: QuickAddValues) => {
    console.log(data, "uyydg");

    const payload = {
      title: data.name,
      description: data.description,

      brand: data.brand,

      color: data.color,
      category: data.category,
      subCategory: data.subcategory,
      subcategoryType: data.subcategoryType || null,
      sizeType: data.sizeType,

      // Transform variants into the API's expected 'price' format
      price: data.variants.map((variant) => ({
        size: variant.size.value, // Extract the ID string from the size object
        amount: variant.price, // Map 'price' from data to 'amount' for the API
        isAvailable: variant.isAvailable,
        isFewLeft: variant.isFewLeft,
        markupPrice: variant.price || 0, // Fallback to 0 if not present in your data
        discount: variant.discountPrice || 0, // Fallback to 0 if not present in your data
      })),

      // Safely map attributes, defaulting to an empty array if undefined
      attributes: data.attributes
        ? data.attributes.map((item) => ({
            property: item.property,
            value: item.value,
          }))
        : [],

      // Pass linkItems if they exist in your data, otherwise default to an empty array
      linkItems: [],
    };









    

    try {
      const imageUrls = await uploadImages(imageFiles);

      const payloadWithImages = {
        ...payload,
        image: imageUrls[0] || "",
        subImages:
          imageUrls.length > 1
            ? imageUrls.slice(1).map((img) => ({ imageUrl: img }))
            : [],
      };

      const productResponse = await postQuery({
        url: apiUrls.Product.add,
        postData: payloadWithImages,
      });

      toast(
        "success",
        productResponse?.message || productResponse?.data?.message || "Product added successfully",
      );
      console.log("Quick Add Payload:", payloadWithImages);
      setShowSuccess(true);
      reset();
      setImageFiles([]);
    } catch (err: any) {
      console.log(err);
      toast("error", err?.response?.data?.message || err?.message || "Could not add product");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-admin-text font-admin-text selection:bg-rose-gold/30">
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
                control={control}
                errors={errors}
                categoryOptions={categoryOptions}
                addCategory={handleAddCategory}
                getCategoryLoading={getCategoryLoading}
                selectedCategory={selectedCategoryId}
                selectedSubcategory={selectedSubcategoryId}
                addSubCategory={handleAddSubCategory}
                subcategoryOptions={subcategoryOptions}
                subcategoryLoading={subcategoryLoading}
                subcategoryType={selectedSubcategoryTypeId}
                subcategoryTypeOptions={subcategoryTypeOptions}
                subcategoryTypeLoading={subcategoryTypeLoading}
              />

              <CoreInfoSection
                register={register}
                control={control}
                errors={errors}
                colorFamilyOptions={colorFamilyOptions}
                selectedColorFamily={selectedColorFamily}
                colorOptions={colorOptions}
                sizeTypeOptions={sizeTypeOptions}
                brandOptions={brandOptions}
                addColorFamily={handleAddColorFamily}
                addSizeType={handleAddSizeType}
                addBrand={handleAddBrand}
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
                setAttributes={(a: any) => setValue("attributes", a)}
                propertyTypeOptions={propertyTypeOptions}
                selectedSubcategoryId={selectedSubcategoryId}
              />
            </div>

            {/* RIGHT COLUMN: Media */}
            <div className="flex flex-col gap-8">
              <MediaSection
                images={images}
                setImages={(imgs) => setValue("images", imgs)}
                onFilesSelected={handleMediaFiles}
                onRemoveImage={handleRemoveImage}
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
