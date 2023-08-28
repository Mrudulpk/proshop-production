import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import {useLocation} from 'react-router-dom'
import Product from '../components/Product'

const CategoryShowScreen = () => {
    const [products, setProducts] = useState([])
    const categoryItems = []

    const {state} = useLocation()
    const name = state.name

    useEffect(() => {
       (async() => {
            const res = await  axios.get('/api/products/')
            const products = res.data.products
            setProducts(products)

            // categoryitems()
        })()
    },[])

    // function categoryitems () {
    //     products.map((product) => {
    //         if( name === product.category){
    //             return categoryItems.push(product)
    //         }
    //     })
    //     console.log(categoryItems)
    // }
    

  return (
    <>
        <h1>{name}</h1>
        <Row>
            {products.map((product) => (
                <Col sm={12} md={6} lg={4} xl={3}>
                    {name===product.category ? (<Product product={product} />) : (undefined)} 
                </Col>
            ))}
        </Row>
    
    </>
  )
}

export default CategoryShowScreen