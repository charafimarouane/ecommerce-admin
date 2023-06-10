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
        const data = {name, parentCategory}
        if (editedCategory) {
            data._id = editedCategory._id
            await axios.put('/api/categories', data)
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        fetchCategories()
    }

    function editCategory(category){
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id)
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
                            className="btn-default text-sm">
                                Add new properties
                        </button>
                        {properties.length > 0 && properties.map(property => (
                            <div className="flex gap-1">
                                <input type="text" placeholder="property name (ex: color)"/>
                                <input type="text" placeholder="values, comma separated"/>
                            </div>
                        ))}
                    </div>
                    
                    <button type="submit" className="btn-primary">Save</button>
                </form>
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
        </Layout>
    )
}
export default withSwal(({swal}, ref)=>(
    <Categories swal={swal}/>
))