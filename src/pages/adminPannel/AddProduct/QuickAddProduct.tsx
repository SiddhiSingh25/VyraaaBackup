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
import usePostQuery from "../../../hooks/postQuery.hook";
import { apiUrls } from "../../../apis";
import useBrandData from "./api/useBrandData";
import { useToast } from "../../../hooks/useToast.hook";
import { useParams } from "react-router-dom";
import Button from "../../../components/tableComponents/Button";
import ProductAddedModal from "./components/LinkProductModal";
import GiftSection from "./components/GiftSection/GiftSection";
import type { GiftItem } from "./types";

const TOTAL_SECTIONS = 4;

const QuickAddProduct = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedProduct, setAddedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // categoryId coming from the route params (e.g. /category/:categoryId/quick-add)
  const { categoryId: categoryIdFromParams } = useParams();

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
    resolver: yupResolver(quickAddSchema) as any,
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
  const appendSizeType = watch("appendSizeType");
  const productName = watch("name");
  const description = watch("description");
  const color = watch("color");
  const brand = watch("brand");
  const selectedBrand = watch("brand");
  const gender = watch("gender");

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [gifts, setGifts] = useState<GiftItem[]>([]);

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

  const handleAddColor = (colorName?: string) => {
    if (!selectedColorFamily || !colorName?.trim()) return;
    const hexCode = prompt(
      `Enter HEX Code (e.g., #000000 or red) for color "${colorName}":`,
      "#000000",
    );
    if (!hexCode) return;
    addColor(
      colorName.trim(),
      selectedColorFamily,
      hexCode.trim(),
      (newColor) => {
        setValue("color", newColor._id);
      },
    );
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
  const { colorOptions, addColor } = useColorData(selectedColorFamily);
  const { sizeTypeOptions, addSizeType } = useSizeTypeData();
  const { sizeValueOptions } = useSizeValueData(selectedSizeType);
  const { propertyTypeOptions, addPropertyType } = usePropertyTypeData(
    selectedSubcategoryId,
  );
  const { brandOptions, addBrand } = useBrandData(effectiveCategoryId);

  useEffect(() => {
    setValue("brand", "");
  }, [effectiveCategoryId, setValue]);

  useEffect(() => {
    if (effectiveCategoryId && brandOptions.length > 0 && !selectedBrand) {
      setValue("brand", brandOptions[0].value, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [effectiveCategoryId, brandOptions, selectedBrand, setValue]);

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

  useEffect(() => {
    setValue("variants", []);
  }, [selectedSizeType, setValue]);

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
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    ), // Category

    Boolean(
      productName &&
      description &&
      selectedColorFamily &&
      color &&
      brand &&
      gender,
    ),

    variants.length > 0, // Inventory & Pricing

    // attributes.length > 0, // Product Specifications

    images.length > 0, // Media & Gallery
  ].filter(Boolean).length;

  // --- Reset helpers ---------------------------------------------------
  // Resetting the whole form should NOT wipe a categoryId that came from
  // the route — otherwise the (hidden) category field goes blank and the
  // taxonomy chain breaks silently.
  const resetForm = useCallback(() => {
    reset(getInitialValues());
    setImageFiles([]);
    setGifts([]);
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
      appendSizeTypeToSize: appendSizeType,
      description: data.description,
      brand: data.brand,
      color: data.color,
      category: effectiveCategoryId,
      subCategory: data.subcategory,
      subcategoryType: data.subcategoryType || null,
      sizeType: data.sizeType,
      gender:
        data.gender === "Boys" || data.gender === "Girls"
          ? "Child"
          : data.gender,
      ageRange: data.ageRange || null,

      price: data.variants.map((variant) => {
        const discount = variant.discountPrice || 0;
        const markupPrice = variant.price;
        const amount = variant.price - (variant.price * discount) / 100;
        return {
          size: variant.size.value,
          skuCode: variant.sku,
          amount,
          isAvailable: variant.isAvailable,
          isFewLeft: variant.isFewLeft,
          markupPrice,
          discount,
        };
      }),

      attributes: data.attributes
        ? data.attributes.map((item) => ({
            property: item.property,
            value: item.value,
          }))
        : [],

      gifts: gifts.map((gift) => ({
        product: gift.product,
        quantity: gift.quantity,
        size: gift.size,
      })),

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
      console.log("Before postQuery");
      await postQuery({
        url: apiUrls.Product.add,
        postData: payloadWithImages,
        onSuccess: (res: any) => {
          console.log("SUCCESS", res);
          toast(
            "success",
            res?.message || res?.data?.message || "Product added successfully",
          );
          // setShowSuccess(true);
          // resetForm();
          setAddedProduct({
            id: res.product._id,
            image: payloadWithImages.image,
            title: payload.title,
            category: categoryOptions.find(
              (c) => c.value === effectiveCategoryId,
            )?.label,
            subCategory: subcategoryOptions.find(
              (s) => s.value === payload.subCategory,
            )?.label,
          });

          setShowProductModal(true);

          resetForm();
        },
        onFail: (err: any) => {
          console.log("CATCH", err);
          toast(
            "error",
            err?.response?.data?.message ||
              err?.data.message ||
              "Could not add product",
          );
        },
      });
    } catch (err: any) {
      toast(
        "error",
        err?.response?.data?.message || err?.message || "Could not add product",
      );
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background font-admin-text selection:bg-rose-gold/30">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 border-b border-border bg-background ">
        <div className="mx-auto max-w-5xl px-6 ">
          <FormHeader
            completedSections={completedSections}
            totalSections={TOTAL_SECTIONS}
          />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <form
          onSubmit={handleSubmit(onSubmit, (formErrors) => {
            console.log("VALIDATION FAILED:", formErrors);
            const firstError = Object.values(formErrors)[0];
            toast(
              "error",
              firstError?.message?.toString() ||
                "Please fix the highlighted fields.",
            );
          })}
          className="mx-auto flex h-full max-w-5xl flex-col gap-5 py-6 "
        >
          {showSuccess && (
            <SuccessBanner
              message="Product quickly added to inventory!"
              onDismiss={() => setShowSuccess(false)}
            />
          )}

          {/* <FormHeader
            completedSections={completedSections}
            totalSections={TOTAL_SECTIONS}
          /> */}

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              {/* <SkuSection register={register} errors={errors} /> */}

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
                hideCategoryField={hasCategoryFromParams}
              />

              <CoreInfoSection
                register={register}
                control={control}
                errors={errors}
                colorFamilyOptions={colorFamilyOptions}
                selectedColorFamily={selectedColorFamily}
                colorOptions={colorOptions}
                brandOptions={brandOptions}
                addColorFamily={handleAddColorFamily}
                addBrand={handleAddBrand}
                addColor={handleAddColor}
                selectedCategory={effectiveCategoryId}
              />

              <VariantsSection
                control={control}
                errors={errors}
                variants={variants}
                setVariants={(v) =>
                  setValue("variants", v as any, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                sizeTypeOptions={sizeTypeOptions}
                sizeOptions={sizeValueOptions}
                sizeTypeSelected={selectedSizeType}
                addSizeType={handleAddSizeType}
                errorMessage={errors.variants?.message as string | undefined}
              />

              <AttributesSection
                attributes={attributes}
                setAttributes={(a: any) => setValue("attributes", a)}
                propertyTypeOptions={propertyTypeOptions}
                selectedSubcategoryId={selectedSubcategoryId}
                addPropertyType={addPropertyType}
              />

              <MediaSection
                images={images}
                setImages={(imgs) => setValue("images", imgs)}
                onFilesSelected={handleMediaFiles}
                onRemoveImage={handleRemoveImage}
                errorMessage={errors.images?.message as string | undefined}
              />

              <GiftSection gifts={gifts} setGifts={setGifts} />
            </div>

            {/* Action Buttons */}
            <div className="flex w-full flex-col sm:flex-row gap-3 mb-32">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClear}
                className="flex-1"
              >
                Clear
              </Button>

              <Button type="submit" variant="primary" className="flex-1">
                Add Product
              </Button>
            </div>
          </div>
        </form>
        <ProductAddedModal
          open={showProductModal}
          product={addedProduct}
          onClose={() => setShowProductModal(false)}
          onLink={() => {
            setShowProductModal(false);

            // open your product linking screen here
          }}
        />
      </main>
    </div>
  );
};

export default QuickAddProduct;
