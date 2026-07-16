export const apiBaseUrl = "https://vyraa-backend-production.up.railway.app/api/";

export const apiUrls = {
  // Category
  Category: {
    add: "category/add",
    update: "category/update",
    delete: "category/delete",
    getAll: "category/getAll",
  },

  // Sub Category
  SubCategory: {
    add: "subcategory/add",
    getAll: "subcategory/getAll",
    update: "subcategory/update",
    delete: "subcategory/delete",
    getByCategoryId: "subcategory/getByCategoryId",
  },

  // Sub Category Type
  SubCategoryType: {
    add: "subcategory/type/add",
    update: "subcategorytype/update",
    delete: "subcategorytype/delete",
    getAll: "subcategory/type/getAll",
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
    getBySubCategoryId: "property/getBySubCategoryId",
  },

  // Property Values
  PropertyValues: {
    add: "property/values/add",
    update: "property/values/update",
    delete: "property/values/delete",
    getAll: "property/values/getAll",
    getByPropertyId: "property/values/getByPropertyId",
  },

  // Color Family
  ColorFamily: {
    add: "color/family/add",
    update: "color/family/update",
    delete: "color/family/delete",
    getAll: "color/family/getAll",
  },

  // Color
  Color: {
    add: "color/add",
    update: "color/update",
    delete: "color/delete",
    getAll: "color/getAll",
    getByColorFamilyId: "color/getByColorFamilyId",
  },

  // Brand
  Brand: {
    add: "brand/add",
    update: "brand/update",
    delete: "brand/delete",
    getAll: "brand/getAll",
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

  // Size
  Size: {
    add: "size/add",
    update: "size/update",
    delete: "size/delete",
    getAll: "size/getAll",
    getBySizeTypeId: "size/getBySizeType",
  },

  // Product
  Product: {
    add: "product/add",
    update: "product/update", // Remove if backend doesn't support it
    delete: "product/delete",
    getAll: "product/getAll",
    getById: "product/", // Usage: `${apiUrls.Product.getById}${id}`


    home: "/product/home"
  },

  Cart: {
    add: "/cart/add",
    getByUserId: "cart/getByUserId",
    update: "/cart/update",
    remove: "/cart/remove/"
  },

  WishList: {
    add: "wishList/add/",
    remove: "/wishList/remove/",
    getByUserId: "/wishList/getByUserId"
  },
  Image: {
    upload: "common/uploadImage",
  },

  Auth: {
    sendOtp: "auth/sendOTP",
    verifyOtp: "auth/verifyOTP",
    signup: "auth/signup",
    login: "auth/login",
    createUser: "auth/createUser",
    profile: "auth/profile",
    updateProfile: "auth/update/profile",
    updatePassword: "auth/update/password"
  },

  Address: {
    add: "address/add",
    delete: "address/delete",
    getByUserId: "address/get",
    getByAddressId: "address/get-address"
  }


};








// "build": "tsc -b && vite build", imp dont remove
