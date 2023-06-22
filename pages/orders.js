import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrderPage(){
    const [orders, setOredrs] = useState([])
    useEffect(()=>{
        axios.get('/api/orders').then(response => {
            setOredrs(response.data)
        })
    },[])


    return(
        <Layout>
            <h1>Order Page</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr>
                            <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                            <td>
                                {order.name} {order.email} <br/>
                                {order.city} {order.postalcode} {order.country} <br/>
                                {order.adress}
                            
                            </td>
                            <td>
                                {order.line_items.map(l => (
                                    <>
                                        {l.price_data?.product_data.name} x {l.quantity}
                                        <br/>
                                    </>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}