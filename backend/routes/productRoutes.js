import express from "express";
const router = express.Router();
import products from '../data/products.js'
import { getProducts,
    getProductById,
    createProduct, 
    updateProduct, 
    deleteProduct, 
    createProductReview, 
    getTopProducts, 
    createCategory,
    getCategory,
    deleteCategory,
    updateIsWishlist,
    getIsWishlist
    } from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getProducts).post(protect, admin, createProduct);
router.get('/top',getTopProducts);
router.route('/iswishlist').put(protect,updateIsWishlist).post(getIsWishlist)
router.route('/category').get(getCategory).post(protect, admin, createCategory)
router.route('/category/:id').delete(deleteCategory)
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct)
router.route('/:id/reviews').post(protect, createProductReview)

export default router
