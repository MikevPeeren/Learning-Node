const Product = require('../models/product');

exports.getAddProduct = (request, response, next) => {
    response.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
}

exports.postAddProduct = (request, response, next) => {
    const body = request.body;
    const product = new Product(null, body.title, body.imageUrl, body.price, body.description);
    product.save().then(() => {
        response.redirect('/');
    }).catch(error => console.log(error));
}

exports.getEditProduct = (request, response, next) => {
    const editMode = request.query.edit;
    if (!editMode) {
        return response.redirect('/');
    }

    const productID = request.params.productID;
    Product.findByID(productID, product => {
        if (!product) {
            return response.redirect('/');
        }
        response.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
}

exports.postEditProduct = (request, response, next) => {
    const requestBody = request.body;
    const updatedProduct = new Product(requestBody.productID, requestBody.updatedTitle, requestBody.updatedImageUrl, requestBody.updatedPrice, requestBody.updatedDescription);

    updatedProduct.save();
    response.redirect('/admin/products');
}

exports.getProducts = (request, response, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            response.render('admin/products', {
                products: rows,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                hasProducts: rows.length > 0
            });
        }).catch(error => {
            console.log(error);
        });

}

exports.postDeleteProduct = (request, response, next) => {
    const productID = request.body.productID;

    Product.deleteByID(productID);
    response.redirect('/admin/products');
}