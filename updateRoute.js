const fs = require('fs');
const filePath = 'backend/src/routes/crm.routes.ts';
let code = fs.readFileSync(filePath, 'utf8');

if (!code.includes('router.delete(\'/diagnostics/:id\'')) {
  // Add PUT and DELETE /diagnostics/:id
  const addition = `
router.put('/diagnostics/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { af, am, ae, r, ita, re, idsE } = req.body;
        const updated = await prisma.diagnosticResult.update({
            where: { id },
            data: {
                af: af !== undefined ? parseInt(af) : undefined,
                am: am !== undefined ? parseInt(am) : undefined,
                ae: ae !== undefined ? parseInt(ae) : undefined,
                r: r !== undefined ? parseInt(r) : undefined,
                ita: ita !== undefined ? parseInt(ita) : undefined,
                re: re !== undefined ? parseInt(re) : undefined,
                idsE: idsE !== undefined ? parseInt(idsE) : undefined
            }
        });
        res.json(updated);
    } catch (error) {
        console.error('Error modifying diagnostic:', error);
        res.status(500).json({ message: 'Failed to modify diagnostic' });
    }
});

router.delete('/diagnostics/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.diagnosticResult.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting diagnostic:', error);
        res.status(500).json({ message: 'Failed to delete diagnostic' });
    }
});
`;
  
  // Insert before export default router;
  code = code.replace('export default router;', addition + '\nexport default router;');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('crm.routes.ts modified successfully');
} else {
  console.log('Routes already exist');
}
