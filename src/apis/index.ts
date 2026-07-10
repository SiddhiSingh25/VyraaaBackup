export const apiBaseUrl = "http://localhost:7777/api/";

export const apiUrls = {
  // Category
  Category: {
    add: "category/add",
    update: "category/update",
    delete: "category/delete",
    getAll: "category/getAll",
    getById: "category/getById",
  },

  // Sub Category
  SubCategory: {
    add: "subcategory/add",
    update: "subcategory/update",
    delete: "subcategory/delete",
    getById: "/subcategory/getByCategoryId",
    getByCategoryId: "subcategory/getByCategoryId",
  },

  // Sub Category Type
  SubCategoryType: {
    add: "subcategorytype/add",
    update: "subcategorytype/update",
    delete: "subcategorytype/delete",
    getAll: "subcategorytype/getAll",
    getById: "subcategorytype/getById",
    getBySubCategoryId: "subcategory/type/getBySubCategoryId",
  },

  // Property
  Property: {
    add: "property/add",
    update: "property/update",
    delete: "property/delete",
    getAll: "property/getAll",
    getById: "property/getById",
    getBySubCategoryTypeId: "property/getBySubCategoryId",
  },

  // Property Values
  PropertyValues: {
    add: "propertyvalue/add",
    update: "propertyvalue/update",
    delete: "propertyvalue/delete",
    getAll: "propertyvalue/getAll",
    getById: "propertyvalue/getById",
    getByPropertyId: "property/values/getByPropertyId",
  },

  // Color Family
  ColorFamily: {
    add: "color/family/add",
    update: "color/family/update",
    delete: "color/family/delete",
    getAll: "color/family/getAll",
    getById: "color/family/getById",
  },

  // Color
  Color: {
    add: "color/add",
    update: "color/update",
    delete: "color/delete",
    getAll: "color/getAll",
    getById: "color/getById",
    getByColorFamilyId: "color/getByColorFamilyId",
  },
  //Brand
  Brand: {
    add: "brand/add",
    update: "brand/update",
    delete: "brand/delete",
    getAll: "brand/getAll",
    getById: "brand/getById",
    getByCategoryId: "brand/getByCategoryId",
  },

  // Size Type
  SizeType: {
    add: "sizetype/add",
    update: "sizetype/update",
    delete: "sizetype/delete",
    getAll: "sizetype/getAll",
    getById: "sizetype/getById",
  },

  SizeTypeValue: {
    add: "sizetype/add",
    update: "sizetype/update",
    delete: "sizetype/delete",
    getAll: "sizetype/getAll",
    getBySizeTypeId: "size/getBySizeType",
  },
  Product: {
    add: "product/add",
    getById: "product/"
  },
  Cart: {
    add: "/cart/add",
    getByUserId: "cart/getByUserId"
  }
};