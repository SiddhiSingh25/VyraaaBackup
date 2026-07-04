import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { apiUrls } from '../../apis';
import usePostQuery from '../../hooks/postQuery.hook';

const AllProduct = () => {
  const { postQuery } = usePostQuery()
  const location = useLocation();
  const data = location.state?.categoryData;
  const [subCategory, setSubCategory] = useState([])

  useEffect(() => {
    postQuery({
      url: apiUrls.SubCategory.getAll,
      postData: { "category": data.id },
      onSuccess: (res: any) => {
        if (res.success) {
          setSubCategory(res.data)
        }
      },
      onFail: (err: any) => {
        console.log(err);
      }
    })
  }, [data])

  return (
    <div>
      <select
        name="subcategory"
        id="subcategory"
        className="w-full p-2 border rounded-md" // Added basic Tailwind styling
      >
        <option value="">Select a Sub-Category</option>
        {
          subCategory.map((item:any, index) => (
            // Assuming 'item.subCategory' is the field name from your schema
            <option key={index} value={item.subCategory}>
              {item.subCategory}
            </option>
          ))
        }
      </select>
    </div>
  )
}

export default AllProduct