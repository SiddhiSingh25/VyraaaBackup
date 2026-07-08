# AddProduct (Quick Add Product)

Refactor of the original single-file `QuickAddProduct` page into a folder
structure with one component per concern, a dedicated `api/` folder for data
fetching, and a shared `types.ts`.

## Structure

```
AddProduct/
├── index.ts                     # barrel export -> import QuickAddProduct from ".../AddProduct"
├── QuickAddProduct.tsx          # main container: owns form state + composes sections
├── schema.ts                    # yup validation schema + default values
├── types.ts                     # shared TypeScript types (form values, API shapes, options)
├── api/
│   ├── index.ts
│   ├── useCategoryData.ts       # GET categories
│   ├── useTaxonomyData.ts       # GET subcategories + types for a selected category
│   ├── useColorFamilyData.ts    # GET color families + colors
│   ├── useSizeTypeData.ts       # GET size types + sizes
│   └── useAttributeData.ts      # GET attribute properties + values
└── components/
    ├── FormHeader.tsx           # title, progress bar, Clear/Publish actions
    ├── SuccessBanner.tsx        # replaces window.alert() on submit
    ├── TaxonomySection.tsx      # Category / Subcategory / Type
    ├── CoreInfoSection.tsx      # Color family/color, size type, name, description
    ├── VariantsSection.tsx      # composes the two below
    ├── VariantDraftForm.tsx     # inline "add variant" row
    ├── VariantsTable.tsx        # list of added variants
    ├── AttributesSection.tsx    # composes the table below
    ├── AttributesTable.tsx      # list of added attributes
    └── MediaSection.tsx         # image gallery + drag-and-drop upload
```

## Every dataset now fetches the same way

Category was the only field wired to a real API call in the original file
(`useGetQuery` + `apiUrls.Category.getAll`). This refactor applies that exact
pattern to Subcategory/Type, Color Family/Color, Size Type/Sizes, and
Attribute/Values, replacing the old hardcoded `MASTER_TAXONOMY`,
`COLOR_FAMILY_DATA`, `SIZE_TYPE_DATA`, and `ATTR_DATA` constants.

**You will need to add these entries to your `apiUrls` file** (adjust paths
to match your actual backend routes):

```ts
export const apiUrls = {
  Category: { getAll: "/category" },
  Subcategory: { getByCategory: (categoryId: string) => `/subcategory/${categoryId}` },
  ColorFamily: { getAll: "/color-family" },
  SizeType: { getAll: "/size-type" },
  Attribute: { getAll: "/attribute" },
};
```

And each endpoint should return data shaped like the interfaces in
`types.ts` (`CategoryApiItem`, `TaxonomyApiItem`, `ColorFamilyApiItem`,
`SizeTypeApiItem`, `AttributeApiItem`). If your real API returns different
field names, just adjust those interfaces and the one-line `.map()` in each
hook — the rest of the app doesn't need to change.

## Import path assumption

The hooks in `api/` import `useGetQuery` and `apiUrls` as:

```ts
import useGetQuery from "../../../../hooks/getQuery.hook";
import { apiUrls } from "../../../../apis";
```

This assumes `AddProduct/` is dropped in the same folder the original
`QuickAddProduct.tsx` lived in (one level deeper than before, so one extra
`../`). If you place `AddProduct/` somewhere else, just fix these two import
paths in each `api/use*Data.ts` file.

## `components/ui/FormElements` dependency

`Select` is used with a `placeholder` prop in a couple of places
(e.g. "Select a category first"). If your existing `Select` component
doesn't support a `placeholder` prop yet, either add one (recommended, it's
a nice touch for disabled/dependent selects) or remove that prop — it's not
required for the form to function.

## UX improvements made

- **Progress bar** in the header showing how many of the 5 sections are complete.
- **Inline success banner** (auto-dismisses) instead of `window.alert(...)`.
- **Confirm-before-clear** so a stray click can't wipe out a half-filled form.
- **Loading / dependency-aware placeholders** on selects ("Loading categories…", "Select a category first…").
- **Disabled "Add" buttons** until a variant/attribute draft is actually valid, instead of silently failing.
- **Cancel button** on the variant draft form.
- **Drag-and-drop + multi-file** image upload, with a "N more images allowed" hint.
- **Out of stock** flagged in red directly in the variants table.
- Clearer empty-state copy ("No variants yet — add your first size to start selling.") instead of just blank tables.
