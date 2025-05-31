const brandModel = require('../models/brandModel');

class BrandController {
    async getAllBrands(req, res) {
        try {
            const brands = await brandModel.getAllBrands();
            res.render('admin/brand/brands', { brands, user: req.user });
        } catch (error) {
            console.error('Error fetching brands:', error);
            res.status(500).send('Error fetching brands');
        }
    }

    async getBrandByIdForEdit(req, res) {
        try {
            const brand = await brandModel.getBrandById(req.params.id);
            if (!brand) {
                return res.status(404).send('Brand not found');
            }
            res.render('admin/brand/edit-brand', { brand, user: req.user });
        } catch (error) {
            console.error('Error fetching brand:', error);
            res.status(500).send('Error fetching brand');
        }
    }

    async addBrand(req, res) {
        try {
            const { name, description } = req.body;
            await brandModel.addBrand({ name, description });
            res.redirect('/admin/brands');
        } catch (error) {
            console.error('Error adding brand:', error);
            res.status(500).send('Error adding brand');
        }
    }

    async updateBrand(req, res) {
        try {
            const { name, description } = req.body;
            await brandModel.updateBrand(req.params.id, { name, description });
            res.redirect('/admin/brands');
        } catch (error) {
            console.error('Error updating brand:', error);
            res.status(500).send('Error updating brand');
        }
    }

    async deleteBrand(req, res) {
        try {
            await brandModel.deleteBrand(req.params.id);
            res.redirect('/admin/brands');
        } catch (error) {
            console.error('Error deleting brand:', error);
            res.status(500).send('Error deleting brand');
        }
    }
}

module.exports = new BrandController();