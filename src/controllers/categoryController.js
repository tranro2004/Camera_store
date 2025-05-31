const categoryModel = require('../models/categoryModel');

class CategoryController {
    async getAllCategories(req, res) {
        try {
            const categories = await categoryModel.getAllCategories();
            res.render('admin/category/categories', { categories, user: req.user });
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).send('Error fetching categories');
        }
    }

    async getCategoryByIdForEdit(req, res) {
        try {
            const category = await categoryModel.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).send('Category not found');
            }
            res.render('admin/category/edit-category', { category, user: req.user });
        } catch (error) {
            console.error('Error fetching category:', error);
            res.status(500).send('Error fetching category');
        }
    }

    async addCategory(req, res) {
        try {
            const { name, description } = req.body;
            await categoryModel.addCategory({ name, description });
            res.redirect('/admin/categories');
        } catch (error) {
            console.error('Error adding category:', error);
            res.status(500).send('Error adding category');
        }
    }

    async updateCategory(req, res) {
        try {
            const { name, description } = req.body;
            await categoryModel.updateCategory(req.params.id, { name, description });
            res.redirect('/admin/categories');
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).send('Error updating category');
        }
    }

    async deleteCategory(req, res) {
        try {
            await categoryModel.deleteCategory(req.params.id);
            res.redirect('/admin/categories');
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).send('Error deleting category');
        }
    }
}

module.exports = new CategoryController();