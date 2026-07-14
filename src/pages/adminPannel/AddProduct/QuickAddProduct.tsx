


import { useEffect, useState, useMemo, useCallback } from "react";
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
import { useParams } from "react-router-dom";
import Button from "../masterData/Category/component/Button";

const TOTAL_SECTIONS = 5;

const QuickAddProduct = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  // categoryId coming from the route params (e.g. /category/:categoryId/quick-add)
  const { categorySlug, categoryId: categoryIdFromParams } = useParams();

  const { toast } = useToast();

  // Build default values so the "category" field is pre-filled whenever
  // we've landed here with a categoryId in the URL.
  const getInitialValues = useCallback(
    (): QuickAddValues => ({
      ...quickAddDefaultValues,
      category: categoryIdFromParams || quickAddDefaultValues.category,
    }),
    [categoryIdFromParams],
  );


  // Whether TaxonomySection should hide its own category picker
  const hasCategoryFromParams = Boolean(categoryIdFromParams);

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
    defaultValues: getInitialValues(),
    context: { hasCategoryFromParams },
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

  const [imageFiles, setImageFiles] = useState<File[]>([]);



  // The single source of truth for "which category are we working under".
  // Params always win — if the user arrived via a category-scoped route,
  // that id drives everything, even if the (hidden) form field hasn't
  // synced yet on the very first render.
  const effectiveCategoryId = categoryIdFromParams || selectedCategoryId;



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
    if (!effectiveCategoryId || !subcategoryName?.trim()) return;
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
    if (!effectiveCategoryId || !brandName?.trim()) return;
    addBrand(brandName.trim(), (newBrand) => {
      setValue("brand", newBrand._id);
    });
  };

  const handleAddSubCategoryType = (subcategoryTypeName?: string) => {
    if (!selectedSubcategoryId || !subcategoryTypeName?.trim()) return;
    addSubCategoryType(subcategoryTypeName.trim(), (newSubCategoryType) => {
      setValue("subcategoryType", newSubCategoryType._id);
    });
  };

  const {
    subcategoryOptions,
    addSubCategory,
    isLoading: subcategoryLoading,
  } = useTaxonomyData(effectiveCategoryId);
  const {
    subcategoryTypeOptions,
    isLoading: subcategoryTypeLoading,
    addSubCategoryType,
  } = useSubCategoryTypeData(selectedSubcategoryId);
  const { colorFamilyOptions, addColorFamily } = useColorFamilyData();
  const { colorOptions } = useColorData(selectedColorFamily);
  const { sizeTypeOptions, addSizeType } = useSizeTypeData();
  const { sizeValueOptions } = useSizeValueData(selectedSizeType);
  const { propertyTypeOptions, addPropertyType } =
    usePropertyTypeData(selectedSubcategoryId);
  const { brandOptions, addBrand } = useBrandData(effectiveCategoryId);

  // Only reset subcategory/type when category actually changes (i.e. the
  // user is picking it manually). When category comes from params this
  // still only fires once, harmlessly, on mount.
  useEffect(() => {
    setValue("subcategory", "");
    setValue("subcategoryType", "");
  }, [effectiveCategoryId, setValue]);

  useEffect(() => {
    setValue("subcategoryType", "");
  }, [selectedSubcategoryId, setValue]);

  useEffect(() => {
    setValue("color", "");
  }, [selectedColorFamily, setValue]);

  // If the param-based categoryId changes (e.g. navigating between
  // category-scoped quick-add routes), keep the form field in sync.
  useEffect(() => {
    if (categoryIdFromParams) {
      setValue("category", categoryIdFromParams);
    }
  }, [categoryIdFromParams, setValue]);








  const handleMediaFiles = (files: File[]) => {
    setImageFiles((prev) => [...prev, ...files]);
  };

  const { postQuery } = usePostQuery();

  const handleRemoveImage = (index: number) => {
    setValue(
      "images",
      images.filter((_img, idx) => idx !== index),
    );
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
      effectiveCategoryId && selectedSubcategoryId && selectedSubcategoryTypeId,
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

  // --- Reset helpers ---------------------------------------------------
  // Resetting the whole form should NOT wipe a categoryId that came from
  // the route — otherwise the (hidden) category field goes blank and the
  // taxonomy chain breaks silently.
  const resetForm = useCallback(() => {
    reset(getInitialValues());
    setImageFiles([]);
  }, [reset, getInitialValues]);

  const handleClear = () => {
    const confirmed = window.confirm(
      "Clear this form? Everything you've entered so far will be lost.",
    );
    if (confirmed) resetForm();
  };

  // --- Submission ------------------------------------------------------------
  const onSubmit = async (data: QuickAddValues) => {
    const payload = {
      title: data.name,
      description: data.description,
      brand: data.brand,
      color: data.color,
      category: effectiveCategoryId,
      subCategory: data.subcategory,
      subcategoryType: data.subcategoryType || null,
      sizeType: data.sizeType,

      price: data.variants.map((variant) => ({
        size: variant.size.value,
        amount: variant.price,
        isAvailable: variant.isAvailable,
        isFewLeft: variant.isFewLeft,
        markupPrice: variant.price || 0,
        discount: variant.discountPrice || 0,
      })),

      attributes: data.attributes
        ? data.attributes.map((item) => ({
          property: item.property,
          value: item.value,
        }))
        : [],

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
        productResponse?.message ||
        productResponse?.data?.message ||
        "Product added successfully",
      );
      setShowSuccess(true);
      resetForm();
    } catch (err: any) {
      toast(
        "error",
        err?.response?.data?.message || err?.message || "Could not add product",
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background  font-admin-text selection:bg-rose-gold/30">
      <main className="flex-1 overflow-y-auto">
        <form
          // onSubmit={handleSubmit(onSubmit)}
          onSubmit={handleSubmit(onSubmit, (formErrors) => {
            console.log("VALIDATION FAILED:", formErrors);
          })}
          className="mx-auto flex h-full max-w-5xl flex-col gap-5 py-6 "
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
          />

          <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
            {/* LEFT COLUMN: Data Entry */}
            <div className="flex flex-col gap-4">
              <TaxonomySection
                control={control}
                errors={errors}
                categoryOptions={categoryOptions}
                addCategory={handleAddCategory}
                getCategoryLoading={getCategoryLoading}
                selectedCategory={effectiveCategoryId}
                selectedSubcategory={selectedSubcategoryId}
                addSubCategory={handleAddSubCategory}
                subcategoryOptions={subcategoryOptions}
                subcategoryLoading={subcategoryLoading}
                subcategoryType={selectedSubcategoryTypeId}
                subcategoryTypeOptions={subcategoryTypeOptions}
                subcategoryTypeLoading={subcategoryTypeLoading}
                addSubCategoryType={handleAddSubCategoryType}
                // NEW: tell TaxonomySection to hide its category picker
                // when we already have one from the route.
                hideCategoryField={hasCategoryFromParams}
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
                addPropertyType={addPropertyType}
              />
            </div>

            {/* RIGHT COLUMN: Media */}
            <div className="flex flex-col gap-4">
              <MediaSection
                images={images}
                setImages={(imgs) => setValue("images", imgs)}
                errorMessage={errors.images?.message as string | undefined}
              />
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button type="button" variant="secondary" onClick={handleClear}>
                Clear
              </Button>
              <Button type="submit" variant="primary">
                Publish SKU
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default QuickAddProduct;