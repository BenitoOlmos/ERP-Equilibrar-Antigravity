const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = `20/02/2026 21:28:19	Jenny Elizabeth Jara Canales 	jnn.jaracanales@gmail.com	12	22	20	10	54	30	24	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Reactivo	INICIA RFAI
24/02/2026 14:22:47	Aldo Gutierrez	aldo.fr.39@gmail.com	20	23	19	20	62	60	2	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Transicional	
24/02/2026 19:54:31	Camila Rodriguez	camila.rodriguez.vet@gmail.com	17	24	24	22	65	66	-1	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Transicional	
2/03/2026 10:16:23	Oscar Velozo Arce	oscar.velozo@gmail.com	14	15	9	27	38	81	-43	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Sobre Adaptado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	PROPUESTA ENTREGADA
2/03/2026 22:42:53	Elizabeth Mejias Navarrete	elizabbetha@gmail.com	13	18	14	25	45	75	-30	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Sobre Adaptado | Balance funcional sin diferencias marcadas igual o superiores a 6 puntos.	
3/03/2026 9:41:12	Paula Andrea Escares Ramírez	pescaresr@gmail.com	17	19	24	11	60	33	27	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Hiper Reactivo | Funcionalidad sostenida con sobre pensamiento y desbordes emocionales.	PROPUESTA ENTREGADA
3/03/2026 9:58:42	 Sol	katherine.elgueta.p@gmail.com	12	12	2	22	26	66	-40	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Hiper Regulado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	PILOTO
3/03/2026 9:59:59	Hugo Rubén Berríos Arvey	berrios.arvey.h@gmail.com	19	16	10	24	45	72	-27	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Sobre Adaptado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	INICIA RFAI
3/03/2026 13:55:23	Evelyn Cisterna vega 	ep.cisterna@gmail.com	6	6	8	20	20	60	-40	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Hiper Regulado | Estado depresivo.	INICIA RFAI
3/03/2026 21:43:48	Mayra	mayragogo@gmail.com	15	15	19	14	49	42	7	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Posible Sobre adaptación o hiperreactividad evaluar síntomas de auto control percibido y estrés | Balance funcional sin diferencias marcadas igual o superiores a 6 puntos.	
6/03/2026 9:43:20	Sol	katherine.elgueta.p@gmail.com	12	16	5	19	33	57	-24	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	
6/03/2026 14:36:29	Elio Valentino Inostroza Dimter	elioinostrozadimter@gmail.com	18	25	20	7	63	21	42	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Hiper Reactivo | Funcionalidad sostenida con sobre pensamiento y desbordes emocionales.	PROPUESTA ENTREGADA
6/03/2026 16:52:41	Daniela Aguila	daguilarojas@gmail.com	21	28	19	18	68	54	14	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Desborde generalizado del sistema.	
9/03/2026 14:32:46	Fernando Aldea	fernando.aldea@gmail.com	20	21	10	18	51	54	-3	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	
9/03/2026 21:49:04	Valeria Arbona Molina	valeriaarbona@gmail.com	21	23	23	11	67	33	34	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Desbordado | Desborde generalizado del sistema.	
9/03/2026 22:37:41	Sandra Miranda	sandruca.miranda73@gmail.com	20	22	19	17	61	51	10	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Desbordado | Desborde generalizado del sistema.	
10/03/2026 13:38:57	Catalina Durán	pepaduranj@gmail.com	16	13	16	19	45	57	-12	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Sobre Adaptado | Balance funcional sin diferencias marcadas.	
10/03/2026 14:53:07	Marcial Casas	marcial.casas.legal@gmail.com	6	14	9	20	29	60	-31	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Indeterminado | Perfil de Estabilidad Funcional.	PILOTO
10/03/2026 20:09:05	Felipe Oyarzún	foya10@nbit.cl	12	19	13	12	44	36	8	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	
10/03/2026 22:31:37	Solange García 	solange.garcia.peralta@gmail.com	13	13	14	22	40	66	-26	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Sobre Adaptado | Balance funcional sin diferencias marcadas.	
11/03/2026 12:50:10	Camila Andrea Rodríguez Parraguez 	camila.rodriguez.vet@gmail.com	16	17	11	24	44	72	-28	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Sobre Adaptado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	INICIA RFAI
11/03/2026 23:02:19	Paola Rubio	paola.rubio@gmail.com	17	18	8	15	43	45	-2	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	PILOTO
12/03/2026 7:36:32	Mariana Gonzalez	marianagonzal@gmail.com	13	13	13	19	39	57	-18	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Sobre Adaptado | Balance funcional sin diferencias marcadas.	
12/03/2026 8:12:02	Lucia Salas	ljsalasv@gmail.com	16	19	15	17	50	51	-1	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Balance funcional sin diferencias marcadas.	
12/03/2026 8:32:23	Caro Mera	mera.carolina@gmail.com	10	12	9	22	31	66	-35	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Indeterminado | Balance funcional sin diferencias marcadas.	
12/03/2026 8:45:19	Michi 	mpvillaroela@gmail.com	14	11	12	28	37	84	-47	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Sobre Adaptado | Balance funcional sin diferencias marcadas.	
12/03/2026 8:45:24	Mónica Barrientos Zuñiga	lunacala@gmail.com	16	17	11	19	44	57	-13	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Sobre Adaptado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	
12/03/2026 8:57:18	Catalina Reyes	catalinapaz.reyes.her@gmail.com	11	17	11	25	39	75	-36	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Sobre Adaptado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	
12/03/2026 11:04:15	Daniela Pacheco Moreno	danny.pacheco19@gmail.com	23	26	27	11	76	33	43	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Desbordado | Desborde generalizado del sistema.	
12/03/2026 11:10:34	Darinka Cardenas Valencia	d.cardenas.v@hotmail.com	18	24	16	15	58	45	13	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Desbordado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	
12/03/2026 11:51:38	Leonel Muñoz Avilés	leemunoz.a@gmail.com	23	27	18	15	68	45	23	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	
12/03/2026 11:57:12	Daniela Castro 	ps.dcastroj@gmail.com	9	5	5	24	19	72	-53	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Indeterminado | Estado depresivo / Inhibido.	
12/03/2026 12:23:33	Fabiola Beatriz Contreras Muñoz	fabiolacontrerasmunoz@gmail.com	11	12	11	23	34	69	-35	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Sobre Adaptado | Balance funcional sin diferencias marcadas.	
12/03/2026 12:41:06	Sigal amaranta 	sigalamaranta3@gmail.com	16	21	18	9	55	27	28	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Indeterminado | Balance funcional sin diferencias marcadas.	
12/03/2026 13:10:33	Emilio	leslie.espinoza@gmail.com	23	23	7	15	53	45	8	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	
12/03/2026 13:14:51	Natalia Patricia Herrera	Ourcullu@gmail.com	22	25	18	9	65	27	38	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Hiper Reactivo | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	PROPUESTA ENTREGADA
12/03/2026 13:18:32	Osvaldo Urcullu	ourcullu@gmail.com	18	19	21	14	58	42	16	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Desbordado | Funcionalidad sostenida con sobre pensamiento y desbordes emocionales.	INICIA RFAI
12/03/2026 13:57:14	Macarena Canales	pazintegrativa.cl@gmail.com	15	15	7	23	37	69	-32	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	
12/03/2026 15:20:51	sebastian retamal	neoakariano@gmail.com	12	25	20	6	57	18	39	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Indeterminado | Funcionalidad sostenida con sobre pensamiento y desbordes emocionales.	SESION CON CLAUDIO
12/03/2026 15:44:21	Milka Sotelo Fierro	milkasotelo20@gmail.com	27	28	26	10	81	30	51	Desbalance alto. Consumo excesivo prolongado que puede llevar a síndromes tensionales, disregulación anímica o agotamiento funcional.	Desbordado | Desborde generalizado del sistema.	
12/03/2026 16:39:57	Brian Mancilla 	Brian.mlla97@gmail.com	10	11	9	21	30	63	-33	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Indeterminado | Balance funcional sin diferencias marcadas.	
12/03/2026 21:47:27	Joyce	jcassu@gmail.com	24	17	24	12	65	36	29	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Desbordado | Funcionalidad sostenida desde un predominio emocional con baja elaboración cognitiva.	
13/03/2026 8:50:54	Carla Castro 	castro.carla1975@gmail.com	16	17	13	20	46	60	-14	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Sobre Adaptado | Balance funcional sin diferencias marcadas.	
13/03/2026 10:15:50	Ignacio Morales Herrera	ign.moralesherrera2@gmail.com	13	14	10	14	37	42	-5	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Balance funcional sin diferencias marcadas.	
13/03/2026 11:30:10	Lucia de la Quintana	lu.delaquintanar@gmail.com	12	16	14	18	42	54	-12	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Balance funcional sin diferencias marcadas.	
13/03/2026 12:05:53	Nicole Ahumada	nicoleahumadan0988@gmail.com	22	27	19	15	68	45	23	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Desbordado | Desborde generalizado del sistema.	
13/03/2026 12:12:48	Lourdes Vélez 	lourdesvelezb@hotmail.com	14	11	13	14	38	42	-4	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Balance funcional sin diferencias marcadas.	
13/03/2026 14:52:59	Laura Soto	ljsotom@gmail.com	13	19	17	19	49	57	-8	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Hiper Regulado | Perfil de Estabilidad Funcional.	
13/03/2026 15:15:25	Natalia Rosales	nataliarosalesotarola@gmail.com	20	20	11	15	51	45	6	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	PILOTO
13/03/2026 16:04:03	Estefani Lagos	estefani.lagos@gmail.com	24	24	22	13	70	39	31	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Desbordado | Desborde generalizado del sistema.	
13/03/2026 16:10:08	Felipe	as@gmail.com	16	16	22	14	54	42	12	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Funcionalidad sostenida desde un predominio emocional con baja elaboración cognitiva.	
15/03/2026 18:40:48	Martina vivas	martinavivas00@gmail.com	6	8	11	11	25	33	-8	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Inhibido | Balance funcional sin diferencias marcadas.	
15/03/2026 18:40:59	Felipe Sahd	fsahd@hotmail.com	12	18	12	10	42	30	12	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	
16/03/2026 12:15:17	Valentina Jáuregui Ubello	v.jaureguiubello@gmail.com	22	17	22	10	61	30	31	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Desbordado | Balance funcional sin diferencias marcadas.	
16/03/2026 13:24:51	Daniela Ponce Maripangui	daniponcem@gmail.com	19	22	22	9	63	27	36	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Hiper Reactivo | Desborde generalizado del sistema.	
17/03/2026 13:54:53	PAULINA ANDREA LOPEZ NAVARRETE	paulina.ln@gmail.com	21	18	14	13	53	39	14	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Perfil de Estabilidad Funcional.	
17/03/2026 18:06:06	Catalina Reyes	catamiau.ra@gmail.com	19	22	15	12	56	36	20	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Desbordado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.	
18/03/2026 0:09:11	Héctor Brito	hector.elias.brito@gmail.com	24	27	24	10	75	30	45	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Desbordado | Desborde generalizado del sistema.	
18/03/2026 14:25:08	Daniela Carrión Toledo	danielacarriontoledo@gmail.com	9	15	12	16	36	48	-12	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Perfil de Estabilidad Funcional.	
18/03/2026 15:15:23	Pablo Marchant	pablo.marchant.f@gmail.com	3	4	5	27	12	81	-69	Regulación robusta. Excedente de recursos que facilita resiliencia y salud.	Indeterminado | Estado depresivo / Inhibido.	PILOTO
18/03/2026 15:19:46	Javier Sotelo 	jsotelof@gmail.com	19	17	14	22	50	66	-16	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Balance funcional sin diferencias marcadas.	
19/03/2026 10:14:58	Mónica Loreto Díaz Beros	diazberos@gmail.com	19	27	22	14	68	42	26	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Desbordado | Desborde generalizado del sistema.	SESION CON CLAUDIO
19/03/2026 14:37:10	Luis Alejandro Ferrada Gonzalez	ata.ferrada@gmail.com	25	24	25	15	74	45	29	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Desbordado | Desborde generalizado del sistema.	
19/03/2026 20:14:01	Bianca Escobar Norambuena 	bescobarn@gmail.com	16	11	15	15	42	45	-3	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Balance funcional sin diferencias marcadas.	
19/03/2026 20:23:18	Ailin Viloria 	ailin.viloria@gmail.com	24	25	23	9	72	27	45	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Hiper Reactivo | Desborde generalizado del sistema.	
20/03/2026 16:25:25	Juan Carlos Borgoño	jborgono@hotmail.com	14	17	12	15	43	45	-2	Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.	Indeterminado | Balance funcional sin diferencias marcadas.	
23/03/2026 19:53:04	emilio salcedo	emiliosalcedoorrego@gmail.com	15	22	21	12	58	36	22	Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.	Desbordado | Funcionalidad sostenida con sobre pensamiento y desbordes emocionales.	`;

async function seed() {
    // Normalizing newlines
    const rawData = data.replace(/\\r/g, '');
    const rows = rawData.split('\n');
    let c = 0;

    for (const row of rows) {
        if (!row.trim()) continue;
        
        // Ensure \t properly splits it.
        const cols = row.split('\t');
        if (cols.length < 12) continue;

        const email = cols[2].trim().toLowerCase();
        const name = cols[1].trim();

        // Safe Date Parsing
        const dateStrRaw = cols[0].trim();
        let parsedDate = new Date();
        try {
           const [dateP, timeP] = dateStrRaw.split(' ');
           if (dateP && timeP) {
               const [dd, mm, yyyy] = dateP.split('/');
               const [H, M, S] = timeP.split(':');
               parsedDate = new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T${H.padStart(2, '0')}:${M.padStart(2, '0')}:${(S||'00').padStart(2, '0')}Z`);
           }
        } catch(e) {}

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    role: 'USER',
                    passwordHash: 'N/A'
                }
            });
        }

        const diagData = {
           date: parsedDate,
           af: parseInt(cols[3]) || 0,
           am: parseInt(cols[4]) || 0,
           ae: parseInt(cols[5]) || 0,
           r: parseInt(cols[6]) || 0,
           ita: parseInt(cols[7]) || 0,
           re: parseInt(cols[8]) || 0,
           idsE: parseInt(cols[9]) || 0,
           interpretation: cols[10]?.trim() || '',
           profile: cols[11]?.trim() || '',
           status: cols[12]?.trim() || ''
        };

        const existingDiag = await prisma.diagnosticResult.findUnique({ where: { userId: user.id } });
        if (existingDiag) {
            await prisma.diagnosticResult.update({
                where: { userId: user.id },
                data: diagData
            });
        } else {
            await prisma.diagnosticResult.create({
                data: {
                    userId: user.id,
                    ...diagData
                }
            });
        }
        c++;
    }
    console.log(`Se insertaron/actualizaron exitosamente ${c} Diagnósticos Web RFAI en Prisma.`);
}

seed().catch(console.error).finally(() => prisma.$disconnect());
