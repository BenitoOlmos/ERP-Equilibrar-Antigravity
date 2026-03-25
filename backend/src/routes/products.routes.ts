import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock, isActive } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, isActive } = req.body;
    const data: any = {};
    if (name) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = Number(price);
    if (stock !== undefined) data.stock = Number(stock);
    if (isActive !== undefined) data.isActive = isActive;

    const product = await prisma.product.update({
      where: { id },
      data
    });
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

router.patch('/:id/toggle', async (req, res) => {
  try {
    const doc = await prisma.product.update({
      where: { id: req.params.id },
      data: { isActive: req.body.isActive }
    });
    res.json(doc);
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

export default router;
