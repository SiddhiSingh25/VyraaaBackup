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
import useGetQuery from "@/hooks/getQuery.hook";
import PageLoader from "@/components/Loader/fullPageLoader";
import ButtonLoader from "@/components/Loader/ButtonLoader";

const TOTAL_SECTIONS = 4;

const QuickAddProduct = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedProduct, setAddedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { id } = useParams<{ id: string }>();
  const { getQuery } = useGetQuery();
  console.log("poroductId", id);

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

  // --- SYNC SUBCATEGORY ONCE OPTIONS ARRIVE ---
  useEffect(() => {
    if (!editingProduct || !effectiveCategoryId || subcategoryLoading || !subcategoryOptions.length) return;

    const originalSubCatId = editingProduct.subCategory?._id || editingProduct.subCategory;
    const exists = subcategoryOptions.find((item) => item.value === originalSubCatId);

    if (exists) {
      setValue("subcategory", originalSubCatId, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [editingProduct, effectiveCategoryId, subcategoryLoading, subcategoryOptions, setValue]);

  // --- SYNC SUBCATEGORY TYPE ONCE OPTIONS ARRIVE ---
  useEffect(() => {
    if (!editingProduct || !selectedSubcategoryId || subcategoryTypeLoading || !subcategoryTypeOptions.length) return;

    const originalTypeId = editingProduct.subcategoryType?._id || editingProduct.subcategoryType;
    if (!originalTypeId) return; // Not all products have a subcategory type!

    const exists = subcategoryTypeOptions.find((item) => item.value === originalTypeId);

    if (exists) {
      setValue("subcategoryType", originalTypeId, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [editingProduct, selectedSubcategoryId, subcategoryTypeLoading, subcategoryTypeOptions, setValue]);


  const { colorFamilyOptions, addColorFamily } = useColorFamilyData();
  const { colorOptions, addColor } = useColorData(selectedColorFamily);
  const { sizeTypeOptions, addSizeType } = useSizeTypeData();
  const { sizeValueOptions } = useSizeValueData(selectedSizeType);
  const { propertyTypeOptions, addPropertyType } = usePropertyTypeData(
    selectedSubcategoryId,
  );
  const { brandOptions, addBrand } = useBrandData(effectiveCategoryId);
  const [pageLoader, setPageLoader] = useState(false);


  // --- WIPE HOOKS ---

  // --- WIPE HOOKS ---

  useEffect(() => {
    if (isInitializing) return;

    // Fix: Prevent wiping if the category hasn't changed from the original product
    const originalCatId = editingProduct?.category?._id || editingProduct?.category;
    if (editingProduct && effectiveCategoryId === originalCatId) return;

    setValue("brand", "");
  }, [effectiveCategoryId, editingProduct, setValue, isInitializing]);

  useEffect(() => {
    if (isInitializing) return;

    const originalCatId = editingProduct?.category?._id || editingProduct?.category;
    if (editingProduct && effectiveCategoryId === originalCatId) return;

    setValue("subcategory", "");
    setValue("subcategoryType", "");
  }, [effectiveCategoryId, editingProduct, setValue, isInitializing]);

  useEffect(() => {
    if (isInitializing) return;

    const originalSubCatId = editingProduct?.subCategory?._id || editingProduct?.subCategory;
    if (editingProduct && selectedSubcategoryId === originalSubCatId) return;

    setValue("subcategoryType", "");
  }, [selectedSubcategoryId, editingProduct, setValue, isInitializing]);

  useEffect(() => {
    if (isInitializing) return;

    // Fix: Prevent wiping if the color family hasn't changed from the original product
    const originalFamilyId = editingProduct?.color?.family || editingProduct?.colorFamily;
    if (editingProduct && selectedColorFamily === originalFamilyId) return;

    setValue("color", "");
  }, [selectedColorFamily, editingProduct, setValue, isInitializing]);

  useEffect(() => {
    if (isInitializing) return;

    // Fix: Prevent wiping if the sizeType hasn't changed from the original product
    const originalSizeTypeId = editingProduct?.sizeType?._id || editingProduct?.sizeType;
    if (editingProduct && selectedSizeType === originalSizeTypeId) return;

    setValue("variants", []);
  }, [selectedSizeType, editingProduct, setValue, isInitializing]);


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

  const { postQuery, loading } = usePostQuery();

  const handleRemoveImage = (index: number, removedUrl: string) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index),
    );

    // Only remove from imageFiles if it was a newly uploaded image
    if (removedUrl.startsWith("blob:")) {
      const blobImages = images.filter((img) => img.startsWith("blob:"));

      const blobIndex = blobImages.indexOf(removedUrl);

      if (blobIndex !== -1) {
        setImageFiles((prev) => prev.filter((_, i) => i !== blobIndex));
      }
    }
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

    Boolean(productName && description && gender),

    variants.length > 0, // Inventory & Pricing

    images.length > 0, // Media & Gallery
  ].filter(Boolean).length;

  // --- Reset helpers ---------------------------------------------------

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

  const onSubmit = async (data: QuickAddValues) => {
    const payload = {
      title: data.name,
      appendSizeTypeToSize: appendSizeType,
      description: data.description,
      brand: data.brand || null,
      color: data.color || null,
      category: effectiveCategoryId,
      subCategory: data.subcategory,
      subcategoryType: data.subcategoryType || null,
      sizeType: data.sizeType,
      gender:
        data.gender === "Boys" || data.gender === "Girls"
          ? "Child"
          : data.gender || null,
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

      attributes:
        data.attributes?.map((item) => ({
          property: item.property,
          value: item.value,
        })) || [],

      gifts: gifts.map((gift) => ({
        product: gift.product,
        quantity: gift.quantity,
        size: gift.size,
      })),

      linkItems: [],
    };

    try {
      let imageUrls: string[] = [];

      // Upload only newly selected images
      if (imageFiles.length) {
        imageUrls = await uploadImages(imageFiles);
      }

      let uploadedIndex = 0;

      const finalImages = images.map((img) => {
        if (img.startsWith("blob:")) {
          return imageUrls[uploadedIndex++];
        }

        return img;
      });

      const payloadWithImages = {
        ...payload,

        image: finalImages[0],

        subImages: finalImages.slice(1).map((img) => ({
          imageUrl: img,
        })),
      };

      const apiUrl = id
        ? `${apiUrls.Product.editProduct}/${id}`
        : apiUrls.Product.add;

      await postQuery({
        url: apiUrl,
        postData: payloadWithImages,

        onSuccess: (res: any) => {
          toast(
            "success",
            res?.message ||
            res?.data?.message ||
            (id
              ? "Product updated successfully"
              : "Product added successfully"),
          );

          if (id) {
            return;
          }

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
          toast(
            "error",
            err?.response?.data?.message ||
            err?.data?.message ||
            (id ? "Could not update product" : "Could not add product"),
          );
        },
      });
    } catch (err: any) {
      toast(
        "error",
        err?.response?.data?.message ||
        err?.message ||
        (id ? "Could not update product" : "Could not add product"),
      );
    }
  };

  useEffect(() => {
    if (!id) return;
    setPageLoader(true);

    getQuery({
      url: `${apiUrls.Product.getByIdAdmin}${id}`,
      onSuccess: (res: any) => {
        console.log("Product Details:", res);
        const product = res.data;
        setEditingProduct(product);

        // ---------------- Gifts ----------------
        // ---------------- Gifts ----------------
        const mappedGifts =
          product.gifts?.map((gift: any) => {
            // Extract the selected size ID and Label from the fully populated gift.size
            const selectedSizeId = gift.size?._id || gift.size || "";
            const selectedSizeLabel = gift.size?.size || "Default Size";

            return {
              product: gift.product?._id || gift.product,
              quantity: gift.quantity || 1,
              size: selectedSizeId, // Use the extracted ID

              productDetails: {
                title: gift.product?.title || "",
                image: gift.product?.image || "",
                brand: gift.product?.brand?.brand || "",
                sku: gift.product?.price?.[0]?.skuCode || "",

                // Safely map sizes handling both Populated Objects and Unpopulated Strings
                sizes:
                  gift.product?.price?.map((p: any) => {
                    const isPopulated = typeof p.size === "object" && p.size !== null;
                    const value = isPopulated ? p.size._id : p.size; // Get ID whether it's an object or string

                    let label = isPopulated ? p.size.size : "";

                    // If the size is an unpopulated string, check if it matches the selected size to salvage the label
                    if (!isPopulated) {
                      if (value === selectedSizeId) {
                        label = selectedSizeLabel;
                      } else {
                        label = `Size Data Missing`;
                      }
                    }

                    return {
                      label: label,
                      value: value,
                    };
                  }) || [],
              },
            };
          }) || [];

        setGifts(mappedGifts);

        // ---------------- Images ----------------
        const allImages = [
          product.image,
          ...(product.subImages || []).map((item: any) => item.imageUrl),
        ].filter(Boolean); // Filter out any null/undefined images

        setImageFiles([]); // editing existing images

        // ---------------- Form ----------------
        setIsInitializing(true);

        reset({
          category: product.category?._id || product.category || "",
          subcategory: product.subCategory?._id || product.subCategory || "",
          subcategoryType: product.subcategoryType?._id || product.subcategoryType || "",

          name: product.title || "",
          description: product.description || "",
          brand: product.brand?._id || product.brand || "",
          colorFamily: product.color?.family || "",
          color: product.color?._id || product.color || "",
          gender: product.gender || "",
          ageRange: product.ageRange || "",
          sizeType: product.sizeType?._id || product.sizeType || "",
          appendSizeType: product.appendSizeTypeToSize ?? false,

          // --- FIXED VARIANTS SECTION ---
          variants:
            product.price?.map((item: any) => ({
              // Safely map size for react-select components
              size: item.size ? {
                value: item.size._id || item.size,
                label: item.size.size || "",
              } : null,

              sku: item.skuCode || "",
              amount: item.amount || 0, // <-- Added: The actual selling price was missing in your original code
              price: item.markupPrice || 0, // MRP
              discountPrice: item.discount || 0,
              isAvailable: item.isAvailable ?? true,
              isFewLeft: item.isFewLeft ?? false,
            })) || [],

          attributes:
            product.attributes?.map((attr: any) => ({
              property: attr.property?._id || "",
              propertyLabel: attr.property?.property || "",
              value: attr.value?._id || "",
              valueLabel: attr.value?.value || "",
            })) || [],

          images: allImages,
        });

        setTimeout(() => {
          setIsInitializing(false);
          setPageLoader(false);
        }, 0);
      },
      onFail: (err: any) => {
        console.error("Failed to fetch product:", err);
        toast(
          "error",
          err?.response?.data?.message || "Failed to fetch product"
        );
        setPageLoader(false);
      },
    });
  }, [id]);

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

      {pageLoader && (
        <PageLoader loading={pageLoader} text="Loading product details..." />
      )}

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

              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading}
              >
                {loading && <ButtonLoader />}
                {id ? "Update Product" : "Add Product"}
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