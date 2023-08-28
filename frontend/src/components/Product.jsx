import React, { useState, useEffect } from 'react'
import {Card} from "react-bootstrap"
import { Link } from 'react-router-dom'
import Rating from './Rating'
import axios from 'axios'
import { FaHeart } from 'react-icons/fa'

const Product = ({product}) => {
    const productId = product._id
    // const [initialState, setInitialstate] = useState()
    // const [wishlist, setWishlist] = useState([])
    const [like, setLike] = useState(false)

    // useEffect( () => {
    //    ( async() => {
    //         try { 
    //             const response = await axios.get(`/api/users/wishlist/${productId}` )
    //             setWishlist(response.data)
    //         } catch (error) {
    //             console.log(error.message)
    //         }
    //     })()
    // },[])

    // useEffect(() => {
    //     (async() => {
    //         const res = await axios.post('/api/products/iswishlist', {productId})
    //         console.log(productId,res.data.iswishlist)
    //         setLike(res.data.iswishlist)
    //     })()
    // })

    // useEffect(() => {
    //     wishlist.map((item) => {
    //         if(item === productId) {
    //             setInitialstate(true)
    //             console.log("true",productId)
    //         }
    //     })
    // },[wishlist])

    
    // useEffect(() => {
    //     (async() => {
    //         const response = await axios.put('/api/products/iswishlist',{like})
    //         console.log(response.data)
    //     })()
    // },[productId,like])

    const addToWishlistHandler = async (e) => {
        e.preventDefault();
        try { 
            const response = await axios.put(`/api/users/wishlist/${productId}` )
            setLike(!like)
            console.log(response.data.wishlist);
        } catch (error) {
            console.log(error.message)
        }
        
    }

    const removeFromWishlistHandler = async(e) => {
        e.preventDefault();
        try { 
            const response = await axios.delete(`/api/users/wishlist/${productId}` )
            setLike(!like)
            console.log(response.data.wishlist);
        } catch (error) {
            console.log(error.message)
        }
    }

    
  return (
    <Card className="my-3 p-3 rounded">
        <Link to={`/product/${product._id}`}>
            <Card.Img src={product.image} variant="top" />
        </Link>

        <Card.Body>
            <Link to={`/product/${product._id}`}>
                <Card.Title as="div" className='product-title'>
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>
            <Card.Text as='div'>
                <Rating value={product.rating} text={`${product.numReviews}reviews`} />
            </Card.Text>

            <Card.Text as="h3">
                Rs.{product.price}
            </Card.Text>

            { like === true ? (<FaHeart onClick={removeFromWishlistHandler} style={{color:'red'}} />) : (<FaHeart onClick={addToWishlistHandler}  />)}
            
            
        </Card.Body>
    </Card>
  )
}

export default Product