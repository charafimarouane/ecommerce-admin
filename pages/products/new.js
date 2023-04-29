import Layout from "@/components/Layout"
import axios from "axios"
import { useState } from "react"
import {useRouter} from 'next/router'

export default function NewProduct() {
    const [title, setTitle] = useState('')
    const [description, setDescripton] = useState('')
    const [price, setPrice] = useState('')
    const [goToProducts, setGoToProducts] = useState(false)
    const router = useRouter()
    async function createProduct(ev){
        ev.preventDefault();
        const data = {title, description, price}
        await axios.post('/api/products', data)
        setGoToProducts(true)
    }
    
    if(goToProducts){
        router.push('/products')
    }
    
    return(
        <Layout>
            <form onSubmit={createProduct}>
                <h1>New Product</h1>
                <label>Product name</label>
                <input
                type="text"
                placeholder="product name"
                value={title}
                onChange={ev => setTitle(ev.target.value)} />
                <label>Desctiption</label>
                <textarea 
                placeholder="description"
                value={description}
                onChange={ev => setDescripton(ev.target.value)}>
                </textarea>
                <label>Price (in USD)</label>
                <input 
                type="text"
                placeholder="price"
                value={price}
                onChange={ev => setPrice(ev.target.value)}/>
                <button type="submit" className="btn-primary">Save</button>
                </form>
        </Layout>
    )
}