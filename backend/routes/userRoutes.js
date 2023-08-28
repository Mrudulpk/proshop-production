import express from "express";
const router = express.Router();
import { 
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    getWishlist,
    addToWishlist,
    removeFromWishlist
    } from '../controllers/userController.js';
  import { protect, admin } from '../middleware/authMiddleware.js'  


router.route('/').post(registerUser).get(protect, admin, getUsers)
router.route('/wishlist/:id').put(protect, addToWishlist).delete(protect, removeFromWishlist).get(protect, getWishlist)
router.post('/logout',logoutUser);
router.post('/auth',authUser);
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);

router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser)

export default router