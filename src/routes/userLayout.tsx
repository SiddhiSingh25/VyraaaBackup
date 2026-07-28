import { apiUrls } from "@/apis";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Header/Navbar";
import useGetQuery from "@/hooks/getQuery.hook";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";


export default function UserLayout() {


    const { getQuery, loading: categoryLoading } = useGetQuery()

    const [category, setCategory] = useState([])

    const fetchCategory = () => {
        getQuery({
            url: `${apiUrls.Category.getAll}`,
            onSuccess: (catRes: any) => {
                const fetchedCategories = catRes.data || [];
                setCategory(fetchedCategories)
            },
            onFail(err: any) {
                console.error(err, "Error");
            }
        });
    }

    useEffect(() => {
        fetchCategory()
    }, [])










    return (
        <>
            <Navbar category={category} />
            <Outlet />
            <Footer category={category} />
        </>
    );
}