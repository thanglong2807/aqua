// Create placeholder images for products, categories, and blog posts
// In a real project, these would be actual images.
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../public');
const productsDir = path.join(publicDir, 'products');
const categoriesDir = path.join(publicDir, 'categories');
const blogDir = path.join(publicDir, 'blog');

[productsDir, categoriesDir, blogDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const createPlaceholder = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="#ccc" /><text x="50%" y="50%" fill="#555" dy=".3em" font-family="sans-serif" font-size="20" text-anchor="middle">Placeholder</text></svg>');
    }
};

const productImages = ['betta-red-dragon.jpg', 'ranchu-goldfish.jpg', 'blue-dream-shrimp.jpg', 'atman-filter.jpg', 'chihiros-light.jpg', 'cuba-plant.jpg'];
const categoryImages = ['fish-category.jpg', 'accessories-category.jpg', 'aquascape-category.jpg'];
const blogImages = ['aquascape-guide.jpg', 'easy-fish.jpg', 'algae-problem.jpg'];

productImages.forEach(img => createPlaceholder(path.join(productsDir, img)));
categoryImages.forEach(img => createPlaceholder(path.join(categoriesDir, img)));
blogImages.forEach(img => createPlaceholder(path.join(blogDir, img)));

console.log('Placeholder images created.');
