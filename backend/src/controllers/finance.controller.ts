import { Request, Response } from 'express';
import prisma from '../utils/db';


// ==============================
// CUENTAS POR COBRAR (RECEIVABLES)
// ==============================

// Get all pending payments
export const getReceivables = async (req: Request, res: Response): Promise<void> => {
    try {
        const pendingPayments = await (prisma as any).payment.findMany({
            where: { status: 'PENDING' },
            include: {
                user: { select: { email: true, role: true, profile: true } },
                appointment: { include: { service: true } },
                product: true
            },
            orderBy: { dueDate: 'asc' }
        });
        res.json(pendingPayments);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch receivables', details: error.message });
    }
};

// Mark payment as completed
export const markReceivablePaid = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { paymentMethod } = req.body;
        
        const payment = await (prisma as any).payment.update({
            where: { id },
            data: { 
                status: 'COMPLETED',
                paymentMethod: paymentMethod || 'TRANSFER'
            }
        });
        res.json(payment);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update receivable', details: error.message });
    }
};

// ==============================
// PROVEEDORES Y EMPLEADOS (SUPPLIERS)
// ==============================

export const getSuppliers = async (req: Request, res: Response): Promise<void> => {
    try {
        const suppliers = await (prisma as any).supplier.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(suppliers);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch suppliers', details: error.message });
    }
};

export const createSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body;
        const supplier = await (prisma as any).supplier.create({ data });
        res.status(201).json(supplier);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create supplier', details: error.message });
    }
};

export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = req.body;
        const supplier = await (prisma as any).supplier.update({
            where: { id },
            data
        });
        res.json(supplier);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update supplier', details: error.message });
    }
};

export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await (prisma as any).supplier.delete({ where: { id } });
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete supplier', details: error.message });
    }
};

// ==============================
// CUENTAS POR PAGAR (EXPENSES)
// ==============================

export const getExpenses = async (req: Request, res: Response): Promise<void> => {
    try {
        const expenses = await (prisma as any).expense.findMany({
            include: { supplier: true },
            orderBy: { dueDate: 'asc' }
        });
        res.json(expenses);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch expenses', details: error.message });
    }
};

export const createExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body;
        const expense = await (prisma as any).expense.create({ data });
        res.status(201).json(expense);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create expense', details: error.message });
    }
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        // If status changed to PAID, automatically set paidAt
        if (data.status === 'PAID') {
            data.paidAt = new Date();
        }
        
        const expense = await (prisma as any).expense.update({
            where: { id },
            data
        });
        res.json(expense);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update expense', details: error.message });
    }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await (prisma as any).expense.delete({ where: { id } });
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete expense', details: error.message });
    }
};

// ==============================
// TESORERÍA Y FLUJO DE CAJA (CASHFLOW)
// ==============================

export const getCashFlow = async (req: Request, res: Response): Promise<void> => {
    try {
        // Obtenemos todos los pagos (Ingresos) COMPLETADOS
        const payments = await (prisma as any).payment.findMany({
            where: { status: 'COMPLETED' },
            select: { amount: true, updatedAt: true, createdAt: true }
        });

        // Obtenemos todos los egresos (Gastos) PAGADOS
        const expenses = await (prisma as any).expense.findMany({
            where: { status: 'PAID' },
            select: { amount: true, paidAt: true, updatedAt: true }
        });

        const flowByMonth: Record<string, { income: number, expense: number }> = {};

        // Agregar ingresos
        payments.forEach((p: any) => {
            const date = new Date(p.updatedAt || p.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!flowByMonth[key]) flowByMonth[key] = { income: 0, expense: 0 };
            flowByMonth[key].income += p.amount;
        });

        // Agregar egresos
        expenses.forEach((e: any) => {
            const date = new Date(e.paidAt || e.updatedAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!flowByMonth[key]) flowByMonth[key] = { income: 0, expense: 0 };
            flowByMonth[key].expense += e.amount;
        });

        // Formatear a array ordenado por fecha
        const sortedFlow = Object.keys(flowByMonth)
            .sort()
            .map(dateKey => ({
                month: dateKey,
                income: flowByMonth[dateKey].income,
                expense: flowByMonth[dateKey].expense,
                net: flowByMonth[dateKey].income - flowByMonth[dateKey].expense
            }));

        res.json({
            summary: {
                totalIncome: payments.reduce((acc: number, val: any) => acc + val.amount, 0),
                totalExpense: expenses.reduce((acc: number, val: any) => acc + val.amount, 0),
            },
            history: sortedFlow
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to calculate cashflow', details: error.message });
    }
};
