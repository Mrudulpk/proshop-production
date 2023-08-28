import asyncHandler  from "../middleware/asyncHandler.js";
import Product from '../models/productModel.js'
import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";

// @desc Fetch all products
//@route GET/api/products
//@access Public
const getProducts = asyncHandler(async (req,res) => {
    

    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number (req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i'}} : {};
    const count = await Product.countDocuments({...keyword})
    const products = await Product.find({...keyword})
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    
    
        
    res.json({products, page, pages: Math.ceil(count / pageSize)})
});

// @desc Fetch a products
//@route GET/api/products/:id
//@access Public
const getProductById = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
        return res.json(product);
    }else {
        res.status(404);
        throw new Error('Resource not found')
    }
});

// @desc Create a products
//@route POST/api/products
//@access Private/Admin
const createProduct = asyncHandler(async (req,res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/image/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    })

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc Update a products
//@route PUT/api/products
//@access Public
const updateProduct = asyncHandler(async (req,res) => {
    const { name, price, description, image, brand, category,countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price  = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});


// @desc Delete a products
//@route DELETE/api/products
//@access PRIVATE/Admin
const deleteProduct = asyncHandler(async (req,res) => {
    
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({_id: product._id});
        res.status(200).json({ message: 'Product deleted '})
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

// @desc Create a new review
//@route POST/api/products/:id/reviews
//@access PRIVATE
const createProductReview = asyncHandler(async (req,res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Resource not found')
    }
});

// @desc Get top rated products
//@route GET/api/products/top
//@access Public
const getTopProducts = asyncHandler(async (req,res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.status(200).json(products);
    
    }
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////



const createCategory = asyncHandler(async (req, res) => {
    const category = new Category({
        category: req.body.category
    })

    const createdCategory  = await category.save();
    res.status(201).json(createdCategory);
})


const getCategory = asyncHandler(async (req, res) => {
    const categorylist = await Category.find({})

    res.status(200).json(categorylist)
})


const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id)

    if(category) {
        await Category.deleteOne({_id: category._id});
        res.status(200).json({ message: 'Product deleted '})
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
})


const updateIsWishlist = asyncHandler(async (req, res) => {
    const userId = req.user._id 
    const user = await User.findById(userId)
    const wishlist = user.wishlist 
    const like = req.body.like

    for(const prod_id of wishlist){
        
     const product = await Product.findById(prod_id);

     if(product){
        product.iswishlist = !like
    }
    
    await product.save();
    }
    res.status(200)
})

const getIsWishlist = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.body.productId)
        
    res.json(product)
})



export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts, createCategory, getCategory, deleteCategory, updateIsWishlist, getIsWishlist}