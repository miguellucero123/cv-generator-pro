/**
 * @swagger
 * /api/cvs:
 *   post:
 *     summary: Crear un nuevo CV
 *     description: Crear un nuevo CV para el usuario autenticado
 *     tags: [CV]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CV'
 *     responses:
 *       201:
 *         description: CV creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CV'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *
 *   get:
 *     summary: Obtener CVs del usuario
 *     description: Obtener lista de CVs del usuario autenticado
 *     tags: [CV]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de resultados
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de documentos a saltar
 *     responses:
 *       200:
 *         description: Lista de CVs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CV'
 *                 total:
 *                   type: integer
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/cvs/{id}:
 *   get:
 *     summary: Obtener detalle de un CV
 *     description: Obtener información completa de un CV específico
 *     tags: [CV]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del CV
 *     responses:
 *       200:
 *         description: Detalle del CV
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CV'
 *       404:
 *         description: CV no encontrado
 *       401:
 *         description: No autorizado
 *
 *   put:
 *     summary: Actualizar un CV
 *     description: Actualizar información de un CV existente
 *     tags: [CV]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del CV
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CV'
 *     responses:
 *       200:
 *         description: CV actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CV'
 *       404:
 *         description: CV no encontrado
 *       401:
 *         description: No autorizado
 *
 *   delete:
 *     summary: Eliminar un CV
 *     description: Eliminar un CV existente
 *     tags: [CV]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del CV
 *     responses:
 *       200:
 *         description: CV eliminado exitosamente
 *       404:
 *         description: CV no encontrado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/cvs/{id}/duplicate:
 *   post:
 *     summary: Duplicar un CV
 *     description: Crear una copia de un CV existente
 *     tags: [CV]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del CV a duplicar
 *     responses:
 *       201:
 *         description: CV duplicado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CV'
 *       404:
 *         description: CV no encontrado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/cvs/{id}/export:
 *   get:
 *     summary: Exportar CV a PDF
 *     description: Generar PDF del CV
 *     tags: [CV]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del CV
 *     responses:
 *       200:
 *         description: PDF generado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: CV no encontrado
 *       401:
 *         description: No autorizado
 */

module.exports = {};
