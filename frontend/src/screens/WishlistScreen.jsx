import axios from 'axios'
import React,{useEffect,useState} from 'react'

import {Link,useNavigate} from 'react-router-dom';
import { Row,Col,ListGroup,Image,Form,Button,Card, ListGroupItem} from 'react-bootstrap';
import Message from '../components/Message';
import { toast } from 'react-toastify';


const WishlistScreen = () => {
  const productId = 214
  const [wishlist, setWishlist] = useState([])
  // const navigate = useNavigate()

  useEffect(() => {
    (async() => {
      const response = await axios.get(`/api/users/wishlist/${productId}` )
       setWishlist(response.data)
    })()
  },[])
 
 
  return (<>
    <h1>Wish List</h1>

    {wishlist.length ===0 ? (
      <Message>
          Your wishlist is empty <Link to='/'>Go Back</Link>
      </Message>
       ) : (
      <ListGroup variant='flush'>
          {
              wishlist.map((item) =>  (
                
                   
                    <ListGroup.Item key={item._id}>
                      <Row>
                          <Col md={2}>
                              <Image src={item.image} alt={item.name} fluid rounded />
                          </Col>
                          <Col md={3} >
                              <Link to={`/product/${item._id}`}>{item.name}</Link>
                          </Col>
                          <Col md={2}>${item.price}</Col>
                          <Col md={2}>
                              {/* <Button className='btn-block' type='button'
                                  disabled={item.countInStock === 0}
                                  onClick={addToCartHandler}>
                                  Add To Cart
                            </Button> */}
                          </Col>
                          
                      </Row>
                  </ListGroup.Item>
                  
              )
              )
          }
      </ListGroup>
  )
        }
</>)
}

export default WishlistScreen