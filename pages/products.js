import Layout from "@/components/Layout";
import Link from "next/link";
export default function products(){
    return(
        <Layout>
            <Link href={'/products/new'}
                className="bg-blue-900 text-white rounded-md p-2">
                Add new product
            </Link>    
        </Layout>
    )
}