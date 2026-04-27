import { Request, Response } from 'express';
import prisma from '../utils/db';
import { EconomicIndicatorsService } from '../services/mindicador.service';


// Impuesto Unico Segunda Categoria factor for 2024 (simplified generic logic for the engine)
function calculateImpuestoUnico(imponible: number, utm: number) {
  // A simplified generic approach. Legally, it's 8 brackets based on UTM.
  // We use a simple 3 tier for demonstration if no strict table is matched.
  if (imponible <= 13.5 * utm) return 0;
  if (imponible <= 30 * utm) return (imponible * 0.04) - (0.54 * utm);
  if (imponible <= 50 * utm) return (imponible * 0.08) - (1.74 * utm);
  return (imponible * 0.135) - (4.49 * utm); // Max simplified
}

export const hrController = {
  // 1. Economic Indicators
  async getEconomicIndicators(req: Request, res: Response) {
    try {
      const indicators = await EconomicIndicatorsService.getCurrentIndicators();
      res.json(indicators || { uf: 37000, utm: 65000, dolar: 900, euro: 1000 }); // fallback
    } catch (error) {
       res.status(500).json({ error: 'Failed to fetch indicators' });
    }
  },

  // 2. EMPLOYEES (PLANTA) API
  async getEmployees(req: Request, res: Response) {
    try {
      const employees = await prisma.employeeProfile.findMany({
        include: {
          supplier: true,
          contracts: { where: { isActive: true } }
        }
      });
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching employees' });
    }
  },

  async createEmployee(req: Request, res: Response) {
    try {
      const { name, rut, email, phone, afp, healthSystem, baseSalary, position } = req.body;
      const result = await prisma.$transaction(async (tx) => {
        // 1. Create Supplier record
        const supplier = await tx.supplier.create({
           data: { name, rut, email, phone, type: 'EMPLOYEE' }
        });
        // 2. Create Employee Profile
        const profile = await tx.employeeProfile.create({
           data: { supplierId: supplier.id, afp, healthSystem }
        });
        // 3. Create Contract
        const contract = await tx.employmentContract.create({
           data: { employeeId: profile.id, position, baseSalary, startDate: new Date() }
        });
        return { supplier, profile, contract };
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error creating employee' });
    }
  },

  // 3. PAYROLL CALCULATION (LIQUIDACIONES)
  async calculatePayroll(req: Request, res: Response) {
    try {
      const { employeeId, baseSalary, bonus = 0, overtime = 0 } = req.body;
      const indicators = await EconomicIndicatorsService.getCurrentIndicators();
      const UF = indicators?.uf || 37000;
      const UTM = indicators?.utm || 65000;
      
      const profile = await prisma.employeeProfile.findUnique({ where: { id: employeeId } });
      if (!profile) return res.status(404).json({ error: 'Employee not found' });

      // Haberes
      const gratification = baseSalary * 0.25; // Tope 4.75 IMM omitido para simpleza
      const totalHaberes = baseSalary + gratification + bonus + overtime;
      
      // Imponible tope (Aprox 81.6 UF)
      const maxImponible = 81.6 * UF;
      const imponible = Math.min(totalHaberes, maxImponible);

      // Descuentos Legales (Aprox)
      const afpDeduction = imponible * 0.11;     // Promedio 11%
      const healthDeduction = imponible * 0.07;  // Fonasa o tope Isapre
      const cesantiaDeduction = imponible * (profile.cesantiaPct / 100);
      
      const rentaTributable = imponible - afpDeduction - healthDeduction - cesantiaDeduction;
      const taxDeduction = Math.max(0, calculateImpuestoUnico(rentaTributable, UTM));

      const totalDeductions = afpDeduction + healthDeduction + cesantiaDeduction + taxDeduction;
      const netSalary = totalHaberes - totalDeductions;

      res.json({
        period: new Date().toISOString().substring(0, 7),
        baseSalary, gratification, bonus, overtime, totalHaberes,
        afpDeduction, healthDeduction, cesantiaDeduction, taxDeduction, totalDeductions,
        netSalary, UF, UTM
      });
    } catch(e) {
      res.status(500).json({ error: 'Calculation error' });
    }
  },
  
  async savePayroll(req: Request, res: Response) {
      try {
         const payrollData = req.body;
         const payroll = await prisma.payroll.create({ data: payrollData });
         // Automatically create an Expense?
         const profile = await prisma.employeeProfile.findUnique({ where: { id: payrollData.employeeId }});
         if (profile) {
            await prisma.expense.create({
               data: {
                  amount: payrollData.netSalary,
                  concept: `Sueldo ${payrollData.period}`,
                  category: 'NOMINA',
                  supplierId: profile.supplierId
               }
            });
         }
         res.json({ success: true, payroll });
      } catch(e) { console.error(e); res.status(500).json({ error: 'Error saving payroll' }); }
  },

  // 4. INDIRECT PROFESSIONALS (HONORARIOS)
  async getHonorariumProfiles(req: Request, res: Response) {
     try {
         const profiles = await prisma.honorariumProfile.findMany({
            include: { supplier: true, receipts: { orderBy: { emissionDate: 'desc' } } }
         });
         res.json(profiles);
     } catch(e) { res.status(500).json({ error: 'Error' }); }
  },
  
  async addHonorariumProfile(req: Request, res: Response) {
      try {
         const { name, rut, email, activity } = req.body;
         const supplier = await prisma.supplier.create({ data: { name, rut, email, type: 'INDIRECT_PROFESSIONAL' }});
         const profile = await prisma.honorariumProfile.create({ data: { supplierId: supplier.id, activity }});
         res.json({ supplier, profile });
      } catch(e) { res.status(500).json({ error: 'Error' }); }
  },

  async registerReceipt(req: Request, res: Response) {
     try {
        const { profileId, receiptNumber, grossAmount, retentionRate, retentionType, description } = req.body;
        const retentionAmount = grossAmount * (retentionRate / 100);
        const netAmount = grossAmount - retentionAmount;
        
        const receipt = await prisma.honorariumReceipt.create({
           data: { profileId, receiptNumber, emissionDate: new Date(), grossAmount, retentionAmount, retentionRate, netAmount, retentionType, description }
        });
        
        // Relate the liquid amount to Expenses AP Module
        const profile = await prisma.honorariumProfile.findUnique({ where: { id: profileId }});
        if (profile) {
             await prisma.expense.create({
               data: { amount: netAmount, concept: `BHE ${receiptNumber}`, category: 'HONORARIOS', supplierId: profile.supplierId }
             });
        }
        res.json({ success: true, receipt });
     } catch(e) { res.status(500).json({ error: 'Error registering receipt' }); }
  }
};
