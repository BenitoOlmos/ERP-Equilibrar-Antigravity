import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const seedData = [
  { date: '20/02/2026 21:28:19', name: 'Jenny Elizabeth Jara Canales', email: 'jnn.jaracanales@gmail.com', af: 12, am: 22, ae: 20, r: 10, ita: 54, re: 30, idsE: 24, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Reactivo', status: 'INICIA RFAI' },
  { date: '24/02/2026 14:22:47', name: 'Aldo Gutierrez', email: 'aldo.fr.39@gmail.com', af: 20, am: 23, ae: 19, r: 20, ita: 62, re: 60, idsE: 2, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Transicional', status: '' },
  { date: '24/02/2026 19:54:31', name: 'Camila Rodriguez', email: 'camila.rodriguez.vet@gmail.com', af: 17, am: 24, ae: 24, r: 22, ita: 65, re: 66, idsE: -1, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Transicional', status: '' },
  { date: '2/03/2026 10:16:23', name: 'Oscar Velozo Arce', email: 'oscar.velozo@gmail.com', af: 14, am: 15, ae: 9, r: 27, ita: 38, re: 81, idsE: -43, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Sobre Adaptado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: 'PROPUESTA ENTREGADA' },
  { date: '2/03/2026 22:42:53', name: 'Elizabeth Mejias Navarrete', email: 'elizabbetha@gmail.com', af: 13, am: 18, ae: 14, r: 25, ita: 45, re: 75, idsE: -30, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Sobre Adaptado | Balance funcional sin diferencias marcadas igual o superiores a 6 puntos.', status: '' },
  { date: '3/03/2026 9:41:12', name: 'Paula Andrea Escares Ramírez', email: 'pescaresr@gmail.com', af: 17, am: 19, ae: 24, r: 11, ita: 60, re: 33, idsE: 27, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Hiper Reactivo | Funcionalidad sostenida con sobre pensamiento y desbordes emocionales.', status: 'PROPUESTA ENTREGADA' },
  { date: '3/03/2026 9:58:42', name: 'Sol', email: 'katherine.elgueta.p@gmail.com', af: 12, am: 12, ae: 2, r: 22, ita: 26, re: 66, idsE: -40, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Hiper Regulado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: 'PILOTO' },
  { date: '3/03/2026 9:59:59', name: 'Hugo Rubén Berríos Arvey', email: 'berrios.arvey.h@gmail.com', af: 19, am: 16, ae: 10, r: 24, ita: 45, re: 72, idsE: -27, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Sobre Adaptado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: 'INICIA RFAI' },
  { date: '3/03/2026 13:55:23', name: 'Evelyn Cisterna vega', email: 'ep.cisterna@gmail.com', af: 6, am: 6, ae: 8, r: 20, ita: 20, re: 60, idsE: -40, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Hiper Regulado | Estado depresivo.', status: 'INICIA RFAI' },
  { date: '3/03/2026 21:43:48', name: 'Mayra', email: 'mayragogo@gmail.com', af: 15, am: 15, ae: 19, r: 14, ita: 49, re: 42, idsE: 7, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Posible Sobre adaptación o hiperreactividad evaluar síntomas de auto control percibido y estrés | Balance funcional sin diferencias marcadas igual o superiores a 6 puntos.', status: '' },
  { date: '6/03/2026 14:36:29', name: 'Elio Valentino Inostroza Dimter', email: 'elioinostrozadimter@gmail.com', af: 18, am: 25, ae: 20, r: 7, ita: 63, re: 21, idsE: 42, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Hiper Reactivo | Funcionalidad sostenida con sobre pensamiento y desbordes emocionales.', status: 'PROPUESTA ENTREGADA' },
  { date: '6/03/2026 16:52:41', name: 'Daniela Aguila', email: 'daguilarojas@gmail.com', af: 21, am: 28, ae: 19, r: 18, ita: 68, re: 54, idsE: 14, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Desborde generalizado del sistema.', status: '' },
  { date: '9/03/2026 14:32:46', name: 'Fernando Aldea', email: 'fernando.aldea@gmail.com', af: 20, am: 21, ae: 10, r: 18, ita: 51, re: 54, idsE: -3, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: '' },
  { date: '9/03/2026 21:49:04', name: 'Valeria Arbona Molina', email: 'valeriaarbona@gmail.com', af: 21, am: 23, ae: 23, r: 11, ita: 67, re: 33, idsE: 34, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Desbordado | Desborde generalizado del sistema.', status: '' },
  { date: '9/03/2026 22:37:41', name: 'Sandra Miranda', email: 'sandruca.miranda73@gmail.com', af: 20, am: 22, ae: 19, r: 17, ita: 61, re: 51, idsE: 10, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Desbordado | Desborde generalizado del sistema.', status: '' },
  { date: '10/03/2026 13:38:57', name: 'Catalina Durán', email: 'pepaduranj@gmail.com', af: 16, am: 13, ae: 16, r: 19, ita: 45, re: 57, idsE: -12, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Sobre Adaptado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '10/03/2026 14:53:07', name: 'Marcial Casas', email: 'marcial.casas.legal@gmail.com', af: 6, am: 14, ae: 9, r: 20, ita: 29, re: 60, idsE: -31, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Indeterminado | Perfil de Estabilidad Funcional.', status: 'PILOTO' },
  { date: '10/03/2026 20:09:05', name: 'Felipe Oyarzún', email: 'foya10@nbit.cl', af: 12, am: 19, ae: 13, r: 12, ita: 44, re: 36, idsE: 8, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: '' },
  { date: '10/03/2026 22:31:37', name: 'Solange García', email: 'solange.garcia.peralta@gmail.com', af: 13, am: 13, ae: 14, r: 22, ita: 40, re: 66, idsE: -26, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Sobre Adaptado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '11/03/2026 12:50:10', name: 'Camila Andrea Rodríguez Parraguez', email: 'camila.rodriguez.vet@gmail.com', af: 16, am: 17, ae: 11, r: 24, ita: 44, re: 72, idsE: -28, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Sobre Adaptado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: 'INICIA RFAI' },
  { date: '11/03/2026 23:02:19', name: 'Paola Rubio', email: 'paola.rubio@gmail.com', af: 17, am: 18, ae: 8, r: 15, ita: 43, re: 45, idsE: -2, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: 'PILOTO' },
  { date: '12/03/2026 7:36:32', name: 'Mariana Gonzalez', email: 'marianagonzal@gmail.com', af: 13, am: 13, ae: 13, r: 19, ita: 39, re: 57, idsE: -18, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Sobre Adaptado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '12/03/2026 8:12:02', name: 'Lucia Salas', email: 'ljsalasv@gmail.com', af: 16, am: 19, ae: 15, r: 17, ita: 50, re: 51, idsE: -1, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '12/03/2026 8:32:23', name: 'Caro Mera', email: 'mera.carolina@gmail.com', af: 10, am: 12, ae: 9, r: 22, ita: 31, re: 66, idsE: -35, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Indeterminado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '12/03/2026 8:45:19', name: 'Michi', email: 'mpvillaroela@gmail.com', af: 14, am: 11, ae: 12, r: 28, ita: 37, re: 84, idsE: -47, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Sobre Adaptado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '12/03/2026 8:45:24', name: 'Mónica Barrientos Zuñiga', email: 'lunacala@gmail.com', af: 16, am: 17, ae: 11, r: 19, ita: 44, re: 57, idsE: -13, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Sobre Adaptado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: '' },
  { date: '12/03/2026 8:57:18', name: 'Catalina Reyes', email: 'catalinapaz.reyes.her@gmail.com', af: 11, am: 17, ae: 11, r: 25, ita: 39, re: 75, idsE: -36, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Sobre Adaptado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: '' },
  { date: '12/03/2026 11:04:15', name: 'Daniela Pacheco Moreno', email: 'danny.pacheco19@gmail.com', af: 23, am: 26, ae: 27, r: 11, ita: 76, re: 33, idsE: 43, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Desbordado | Desborde generalizado del sistema.', status: '' },
  { date: '12/03/2026 11:10:34', name: 'Darinka Cardenas Valencia', email: 'd.cardenas.v@hotmail.com', af: 18, am: 24, ae: 16, r: 15, ita: 58, re: 45, idsE: 13, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Desbordado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: '' },
  { date: '12/03/2026 11:51:38', name: 'Leonel Muñoz Avilés', email: 'leemunoz.a@gmail.com', af: 23, am: 27, ae: 18, r: 15, ita: 68, re: 45, idsE: 23, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: '' },
  { date: '12/03/2026 11:57:12', name: 'Daniela Castro', email: 'ps.dcastroj@gmail.com', af: 9, am: 5, ae: 5, r: 24, ita: 19, re: 72, idsE: -53, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Indeterminado | Estado depresivo / Inhibido.', status: '' },
  { date: '12/03/2026 12:23:33', name: 'Fabiola Beatriz Contreras Muñoz', email: 'fabiolacontrerasmunoz@gmail.com', af: 11, am: 12, ae: 11, r: 23, ita: 34, re: 69, idsE: -35, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Sobre Adaptado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '12/03/2026 12:41:06', name: 'Sigal amaranta', email: 'sigalamaranta3@gmail.com', af: 16, am: 21, ae: 18, r: 9, ita: 55, re: 27, idsE: 28, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Indeterminado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '12/03/2026 13:10:33', name: 'Emilio', email: 'leslie.espinoza@gmail.com', af: 23, am: 23, ae: 7, r: 15, ita: 53, re: 45, idsE: 8, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: '' },
  { date: '12/03/2026 13:14:51', name: 'Natalia Patricia Herrera', email: 'Ourcullu@gmail.com', af: 22, am: 25, ae: 18, r: 9, ita: 65, re: 27, idsE: 38, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Hiper Reactivo | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: 'PROPUESTA ENTREGADA' },
  { date: '12/03/2026 13:18:32', name: 'Osvaldo Urcullu', email: 'ourcullu@gmail.com', af: 18, am: 19, ae: 21, r: 14, ita: 58, re: 42, idsE: 16, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Desbordado | Funcionalidad sostenida con sobre pensamiento y desbordes emocionales.', status: 'INICIA RFAI' },
  { date: '12/03/2026 13:57:14', name: 'Macarena Canales', email: 'pazintegrativa.cl@gmail.com', af: 15, am: 15, ae: 7, r: 23, ita: 37, re: 69, idsE: -32, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: '' },
  { date: '12/03/2026 15:20:51', name: 'sebastian retamal', email: 'neoakariano@gmail.com', af: 12, am: 25, ae: 20, r: 6, ita: 57, re: 18, idsE: 39, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Indeterminado | Funcionalidad sostenida con sobre pensamiento y desbordes emocionales.', status: 'SESION CON CLAUDIO' },
  { date: '12/03/2026 15:44:21', name: 'Milka Sotelo Fierro', email: 'milkasotelo20@gmail.com', af: 27, am: 28, ae: 26, r: 10, ita: 81, re: 30, idsE: 51, interpretation: 'Desbalance alto. Consumo excesivo prolongado que puede llevar a síndromes tensionales, disregulación anímica o agotamiento funcional.', profile: 'Desbordado | Desborde generalizado del sistema.', status: '' },
  { date: '12/03/2026 16:39:57', name: 'Brian Mancilla', email: 'Brian.mlla97@gmail.com', af: 10, am: 11, ae: 9, r: 21, ita: 30, re: 63, idsE: -33, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Indeterminado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '12/03/2026 21:47:27', name: 'Joyce', email: 'jcassu@gmail.com', af: 24, am: 17, ae: 24, r: 12, ita: 65, re: 36, idsE: 29, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Desbordado | Funcionalidad sostenida desde un predominio emocional con baja elaboración cognitiva.', status: '' },
  { date: '13/03/2026 8:50:54', name: 'Carla Castro', email: 'castro.carla1975@gmail.com', af: 16, am: 17, ae: 13, r: 20, ita: 46, re: 60, idsE: -14, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Sobre Adaptado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '13/03/2026 10:15:50', name: 'Ignacio Morales Herrera', email: 'ign.moralesherrera2@gmail.com', af: 13, am: 14, ae: 10, r: 14, ita: 37, re: 42, idsE: -5, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '13/03/2026 11:30:10', name: 'Lucia de la Quintana', email: 'lu.delaquintanar@gmail.com', af: 12, am: 16, ae: 14, r: 18, ita: 42, re: 54, idsE: -12, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '13/03/2026 12:05:53', name: 'Nicole Ahumada', email: 'nicoleahumadan0988@gmail.com', af: 22, am: 27, ae: 19, r: 15, ita: 68, re: 45, idsE: 23, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Desbordado | Desborde generalizado del sistema.', status: '' },
  { date: '13/03/2026 12:12:48', name: 'Lourdes Vélez', email: 'lourdesvelezb@hotmail.com', af: 14, am: 11, ae: 13, r: 14, ita: 38, re: 42, idsE: -4, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '13/03/2026 14:52:59', name: 'Laura Soto', email: 'ljsotom@gmail.com', af: 13, am: 19, ae: 17, r: 19, ita: 49, re: 57, idsE: -8, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Hiper Regulado | Perfil de Estabilidad Funcional.', status: '' },
  { date: '13/03/2026 15:15:25', name: 'Natalia Rosales', email: 'nataliarosalesotarola@gmail.com', af: 20, am: 20, ae: 11, r: 15, ita: 51, re: 45, idsE: 6, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: 'PILOTO' },
  { date: '13/03/2026 16:04:03', name: 'Estefani Lagos', email: 'estefani.lagos@gmail.com', af: 24, am: 24, ae: 22, r: 13, ita: 70, re: 39, idsE: 31, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Desbordado | Desborde generalizado del sistema.', status: '' },
  { date: '13/03/2026 16:10:08', name: 'Felipe', email: 'as@gmail.com', af: 16, am: 16, ae: 22, r: 14, ita: 54, re: 42, idsE: 12, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Funcionalidad sostenida desde un predominio emocional con baja elaboración cognitiva.', status: '' },
  { date: '15/03/2026 18:40:48', name: 'Martina vivas', email: 'martinavivas00@gmail.com', af: 6, am: 8, ae: 11, r: 11, ita: 25, re: 33, idsE: -8, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Inhibido | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '15/03/2026 18:40:59', name: 'Felipe Sahd', email: 'fsahd@hotmail.com', af: 12, am: 18, ae: 12, r: 10, ita: 42, re: 30, idsE: 12, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: '' },
  { date: '16/03/2026 12:15:17', name: 'Valentina Jáuregui Ubello', email: 'v.jaureguiubello@gmail.com', af: 22, am: 17, ae: 22, r: 10, ita: 61, re: 30, idsE: 31, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Desbordado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '16/03/2026 13:24:51', name: 'Daniela Ponce Maripangui', email: 'daniponcem@gmail.com', af: 19, am: 22, ae: 22, r: 9, ita: 63, re: 27, idsE: 36, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Hiper Reactivo | Desborde generalizado del sistema.', status: '' },
  { date: '17/03/2026 13:54:53', name: 'PAULINA ANDREA LOPEZ NAVARRETE', email: 'paulina.ln@gmail.com', af: 21, am: 18, ae: 14, r: 13, ita: 53, re: 39, idsE: 14, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Perfil de Estabilidad Funcional.', status: '' },
  { date: '17/03/2026 18:06:06', name: 'Catalina Reyes', email: 'catamiau.ra@gmail.com', af: 19, am: 22, ae: 15, r: 12, ita: 56, re: 36, idsE: 20, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Desbordado | Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.', status: '' },
  { date: '18/03/2026 0:09:11', name: 'Héctor Brito', email: 'hector.elias.brito@gmail.com', af: 24, am: 27, ae: 24, r: 10, ita: 75, re: 30, idsE: 45, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Desbordado | Desborde generalizado del sistema.', status: '' },
  { date: '18/03/2026 14:25:08', name: 'Daniela Carrión Toledo', email: 'danielacarriontoledo@gmail.com', af: 9, am: 15, ae: 12, r: 16, ita: 36, re: 48, idsE: -12, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Perfil de Estabilidad Funcional.', status: '' },
  { date: '18/03/2026 15:15:23', name: 'Pablo Marchant', email: 'pablo.marchant.f@gmail.com', af: 3, am: 4, ae: 5, r: 27, ita: 12, re: 81, idsE: -69, interpretation: 'Regulación robusta. Excedente de recursos que facilita resiliencia y salud.', profile: 'Indeterminado | Estado depresivo / Inhibido.', status: 'PILOTO' },
  { date: '18/03/2026 15:19:46', name: 'Javier Sotelo', email: 'jsotelof@gmail.com', af: 19, am: 17, ae: 14, r: 22, ita: 50, re: 66, idsE: -16, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '19/03/2026 10:14:58', name: 'Mónica Loreto Díaz Beros', email: 'diazberos@gmail.com', af: 19, am: 27, ae: 22, r: 14, ita: 68, re: 42, idsE: 26, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Desbordado | Desborde generalizado del sistema.', status: 'SESION CON CLAUDIO' },
  { date: '19/03/2026 14:37:10', name: 'Luis Alejandro Ferrada Gonzalez', email: 'ata.ferrada@gmail.com', af: 25, am: 24, ae: 25, r: 15, ita: 74, re: 45, idsE: 29, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Desbordado | Desborde generalizado del sistema.', status: '' },
  { date: '19/03/2026 20:14:01', name: 'Bianca Escobar Norambuena', email: 'bescobarn@gmail.com', af: 16, am: 11, ae: 15, r: 15, ita: 42, re: 45, idsE: -3, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '19/03/2026 20:23:18', name: 'Ailin Viloria', email: 'ailin.viloria@gmail.com', af: 24, am: 25, ae: 23, r: 9, ita: 72, re: 27, idsE: 45, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Hiper Reactivo | Desborde generalizado del sistema.', status: '' },
  { date: '20/03/2026 16:25:25', name: 'Juan Carlos Borgoño', email: 'jborgono@hotmail.com', af: 14, am: 17, ae: 12, r: 15, ita: 43, re: 45, idsE: -2, interpretation: 'Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.', profile: 'Indeterminado | Balance funcional sin diferencias marcadas.', status: '' },
  { date: '23/03/2026 19:53:04', name: 'emilio salcedo', email: 'emiliosalcedoorrego@gmail.com', af: 15, am: 22, ae: 21, r: 12, ita: 58, re: 36, idsE: 22, interpretation: 'Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.', profile: 'Desbordado | Funcionalidad sostenida con sobre pensamiento y desbordes emocionales.', status: '' }
];

async function parseDateStr(dateStr: string) {
  // Ej: '20/02/2026 21:28:19' or '2/03/2026 9:41:12'
  const [datePart, timePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('/');
  const [hours, mins, secs] = timePart.split(':');
  return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.padStart(2, '0')}:${mins.padStart(2, '0')}:${secs.padStart(2, '0')}Z`);
}

async function runSeed() {
  console.log('Seeding Diagnostic Results...');
  const defaultPassword = await bcrypt.hash('123456', 10);
  let processed = 0;

  for (const record of seedData) {
    // lowercase email to standard
    const emailStr = record.email.trim().toLowerCase();
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: emailStr }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: record.name.trim(),
          email: emailStr,
          passwordHash: defaultPassword,
          role: 'CLIENT',
          currentWeek: 0, 
        }
      });
    }

    // Check if diagnostic already exists for user
    const existingDiag = await prisma.diagnosticResult.findUnique({
      where: { userId: user.id }
    });

    if (!existingDiag) {
      await prisma.diagnosticResult.create({
        data: {
          userId: user.id,
          date: await parseDateStr(record.date),
          af: record.af,
          am: record.am,
          ae: record.ae,
          r: record.r,
          ita: record.ita,
          re: record.re,
          idsE: record.idsE,
          interpretation: record.interpretation,
          profile: record.profile,
          status: record.status.trim(),
        }
      });
      processed++;
    }
  }

  console.log(`Se completó con éxito. Total registros insertados: ${processed}`);
}

runSeed()
  .catch((e) => {
    console.error('Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
