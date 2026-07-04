export const apiBaseUrl = "http://localhost:7777/api/";

export const apiUrls = {
  // Auth
  Category: {
    add: "category/add",
    delete: "category/delete",
    getAll: "category/getAll",
  },
  SubCategory: {
    add: 'subcategory/add',
    delete: 'subcategory/delete',
    getAll: 'subcategory/getAll',
    getByCategoryId: "subcategory/getByCategoryId"
  }
};
