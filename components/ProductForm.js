import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Spinner from './Spinner'
import { ReactSortable } from "react-sortablejs"


export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDesctiption,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties,
    }){

        const [title, setTitle] = useState(existingTitle || '')
        const [description, setDescripton] = useState(existingDesctiption || '')
        const [price, setPrice] = useState(existingPrice || '')
        const [images, setImages] = useState(existingImages || [])
        const [goToProducts, setGoToProducts] = useState(false)
        const [isUploading, setIsUploading] = useState(false)
        const [categories , setCategories] = useState([])
        const [category, setCategory] = useState(assignedCategory || '')
        const [productProperties, setProductProperties] = useState(assignedProperties || {})
        const router = useRouter()
      
        useEffect(()=>{
            axios.get('/api/categories').then(result => {
                setCategories(result.data)
            })
        }, [])

        async function saveProduct(ev){
            ev.preventDefault();
            const data = {title, description, price, images, category, properties:productProperties}

            if (_id) {
                //update
                await axios.put('/api/products', {...data, _id})
            } else {
                //create
                await axios.post('/api/products', data)
            }
            setGoToProducts(true)
        }
        
        if(goToProducts){
            router.push('/products')
        }

        async function uploadImages(ev){
            const files = ev.target?.files
            if (files?.length > 0) {
                setIsUploading(true)
                const data = new FormData()
                for(const file of files){
                    data.append('file', file)
                }
               const res = await axios.post('/api/upload', data)    
                setImages(oldImages => {
                    return [...oldImages, ...res.data.links]
                })
                setIsUploading(false)
            }
        }

        function updateImagesOrder(images){
            setImages(images)
        }

        function setProductProp(propName, value) {
            setProductProperties(prev => {
                const newProductProps = {...prev}
                newProductProps[propName] = value
                return newProductProps
            })
        }

        const propertiestoFill = []
        if (categories.length > 0 && category) {
            let catInfo = categories.find(({_id}) => _id === category)
            propertiestoFill.push(...catInfo.properties);
            while (catInfo?.parent?._id) {
                const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id)
                propertiestoFill.push(...parentCat.properties)
                catInfo = parentCat
            }
        }
        
        return(
 
                <form onSubmit={saveProduct}>
              
                    <label>Product name</label>
                    <input
                    type="text"
                    placeholder="product name"
                    value={title}
                    onChange={ev => setTitle(ev.target.value)} />
                    <label>Category</label>
                    <select 
                      value={category}
                      onChange={(ev)=> setCategory(ev.target.value)}>
                        <option value="">Uncategorized</option>
                        {categories.length > 0 && categories.map(c => (
                            <option value={c._id}>{c.name}</option>
                        ))}
                    </select>
                    {propertiestoFill.length > 0 && propertiestoFill.map(p => (
                        <div className="flex gap-1">
                            <div className="">{p.name}</div>
                            <select 
                                value={productProperties[p.name]}
                                onChange={ev => 
                                    setProductProp(p.name, ev.target.value)
                                    }>
                                {p.values.map(v => (
                                    <option value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    )
                    )}
                    <label>
                        Photos
                    </label>
                    <div className="mb-2 flex flex-wrap gap-2">
                    <ReactSortable 
                      list={images} 
                      setList={updateImagesOrder}
                      className="flex flex-wrap gap-1">                     
                        {!!images?.length && images.map(link => (
                            <div key={link} className="h-24 ">
                                <img src={link} alt="" className="rounded-lg"/>
                            </div>
                        ))}
                    </ReactSortable>
                        {isUploading && (
                            <div className="h-24 flex items-center bg-gray-300 rounded-lg p-4">
                                <Spinner/>
                            </div>
                        )}
                        <label className="w-24 h-24 cursor-pointer flex justify-center items-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-300"> 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        Upload
                        <input type="file" className="hidden" onChange={uploadImages}/>
                        </label>
                    </div>
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
 
        )
 
}