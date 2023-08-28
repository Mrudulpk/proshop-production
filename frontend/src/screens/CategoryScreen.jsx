import React, { useEffect, useState } from 'react'
import {Form, Button,Table, Col,Row} from 'react-bootstrap'
import axios from 'axios'
import { FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'

const CategoryScreen = () => {
  const [category, setCategory] =useState('')
  const [categories, setCategories] = useState([])

  const [products, setProducts] = useState([])

  const submitCategory = async (e) => {
    e.preventDefault();
    const res = await axios.post('/api/products/category',{category})
    if(res) {
      toast.success('Category added');
    }
    else {
      toast.error("Error happened")
    }
  }

  useEffect(() => {
     (async() => {
      const res = await axios.get('/api/products/category')
      const categories=res.data;
      setCategories(categories)
      const response = await axios.get('/api/products/')
      const products = response.data
      setProducts(products)
    })()
  },[categories])

  const deleteHandler = async(id,categoryName) => {

    products.map((product) => {
        
    })

        try {
          await axios.delete(`/api/products/category/${id}`)
          toast.success('Product deleted');
          
      } catch (err) {
          toast.error(err?.data?.message || err.error)
      }
  }

  return (
    <>
      <h1>Category</h1>
      <Form onSubmit={submitCategory}>
        <Form.Group controlId='categoryName' className='my-2' >
          <Form.Label>Category Name</Form.Label>
          <Form.Control
              type='text'
              placeholder='Enter category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' >
          Submit
        </Button>
      </Form>
      <Row>
        <Col lg={8}>
      <Table striped hover responsive className='table-lg mt-3'>
        <thead>
          <tr>
            <th className='d-flex'>Category name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td className='d-flex'>{category.category}</td>
                <td>
                 
                  <FaTrash 
                         onClick={() => deleteHandler(category._id,category.category)}  
                  />
                       
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      </Col>
      </Row>
    </>
  )
}

export default CategoryScreen
