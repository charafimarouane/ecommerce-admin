import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";


function Categories({swal}){
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [editedCategory, setEditedCategory] = useState(null);
    const [properties, setProperties] = useState([])
    useEffect(() => {
        fetchCategories()
    },[])

    function fetchCategories(){
        axios.get('/api/categories').then(result => {
            setCategories(result.data)
        })
    }

    async function saveCategory(ev){
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values:p.values.split(','),
            })),
        }
        if (editedCategory) {
            data._id = editedCategory._id
            await axios.put('/api/categories', data)
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('')
        setProperties([])
        fetchCategories()
    }

    function editCategory(category){
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id)
        setProperties(
            category.properties.map(({name, values}) => ({
                name,
                values:values.join(',')
            }))
        )
    }
    async function deleteCategory(category){
        swal.fire({
            title: 'Are you sure ?',
            text: `Do you want to delete ${category.name}`,
            showCancelButton : true,
            confirmButtonText : 'Yes, Delete!',
            reversButton : true,
            confirmButtonColor: "#d55"
        }).then(async result => {
            // when confirmed and promise resolved...
            if(result.isConfirmed){
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id)
                fetchCategories()
            }
        }).catch(error => {
            // when promise rejected...
        });
              
    }
    function addProperty(){
        setProperties(prev => {
            return [...prev, {name:'', values:''}]
        })
    }
    function handlePropertyNameChange(index, property, newName){
         setProperties(prev => {
            const properties = [...prev]
            properties[index].name = newName
            return properties
         })
    }
    function handlePropertyValueChange(index, property, newValues){
         setProperties(prev => {
            const properties = [...prev]
            properties[index].values = newValues
            return properties
         })
    }
    function removeProperty(indexToRemove){
        setProperties(prev => {
            return [...prev].filter((p,pIndex) => {
                return  pIndex !== indexToRemove
            })	
        })
    }

    return(
        <Layout>
            <h1>Categories</h1>
                <label>
                    {editedCategory ? `Edit Category ${editedCategory.name}` : 'Create new category'}
                </label>
                <form onSubmit={saveCategory} className="">
                    <div className="flex gap-1">
                        <input 
                        className="" 
                        placeholder="" 
                        value={name} 
                        onChange={ev => setName(ev.target.value)}/>
                        <select 
                            className=""
                            onChange={ev => setParentCategory(ev.target.value)}
                            value={parentCategory}>
                            <option value=''>No parent category</option>
                            {categories.length > 1 && categories.map(category => (
                                <option value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="block">Properties</label>
                        <button
                            onClick={addProperty} 
                            type="button"
                            className="btn-default text-sm mb-2">
                                Add new properties
                        </button> 
                        {properties.length > 0 && properties.map((property, index )=> (
                            <div className="flex gap-1 mb-2">
                                <input type="text"
                                       className="mb-0" 
                                       value={property.name} 
                                       onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                       placeholder="property name (ex: color)"/>
                                <input type="text" 
                                       className="mb-0" 
                                       value={property.values} 
                                       onChange={ev => handlePropertyValueChange(index, property, ev.target.value)}
                                       placeholder="values, comma separated"/>
                                <button className="btn-default"
                                        type="button"
                                        onClick={() => removeProperty(index)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-1">
                        {editedCategory && (
                            <button className="btn-default" 
                                    type="button"
                                    onClick={()=>{
                                        setEditedCategory(null)
                                        setName('')
                                        setParentCategory('')
                                        setProperties([])
                                    }}
                                    >Cancel</button>
                        )}       
                        <button type="submit" className="btn-primary">Save</button>
                    </div>        
                
                </form> 
                {!editedCategory && (
                    <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent category</td>
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 1 && categories.map(category => (
                            <tr>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td className="flex gap-1">
                                    <button
                                        onClick={() => editCategory(category)} 
                                        className="btn-primary"
                                    >Edit</button>
                                    <button 
                                        className="btn-primary"
                                        onClick={() => deleteCategory(category)}
                                    >Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
                

        </Layout>
    )
}
export default withSwal(({swal}, ref)=>(
    <Categories swal={swal}/>
))