import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function editProductPage(){
    const router = useRouter()
    const {id} = router.query
    useEffect(()=>{
        axios.get('/api/products?id='+id).then(res => {
            console.log(res.data);
        })
    },[id])
    
    return(
        <Layout>
            edit product from here 
        </Layout>
    )
}