/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Obtener estadísticas del usuario
 *     description: Obtener estadísticas de CVs y vistas del usuario
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year, all]
 *           default: month
 *         description: Período de tiempo para las estadísticas
 *     responses:
 *       200:
 *         description: Estadísticas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCVs:
 *                   type: integer
 *                 totalViews:
 *                   type: integer
 *                 shareCount:
 *                   type: integer
 *                 downloadCount:
 *                   type: integer
 *                 viewsByDay:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       views:
 *                         type: integer
 *                 topCVs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       cvId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       views:
 *                         type: integer
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/analytics/{cvId}:
 *   get:
 *     summary: Obtener analytics de un CV específico
 *     description: Obtener estadísticas de vistas de un CV individual
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cvId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del CV
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year, all]
 *           default: month
 *     responses:
 *       200:
 *         description: Estadísticas del CV
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cvId:
 *                   type: string
 *                 totalViews:
 *                   type: integer
 *                 downloads:
 *                   type: integer
 *                 shares:
 *                   type: integer
 *                 viewsChart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                       count:
 *                         type: integer
 *       404:
 *         description: CV no encontrado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/analytics/{cvId}/views:
 *   post:
 *     summary: Registrar visualización de CV
 *     description: Registrar que un usuario visualizó un CV compartido
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: cvId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               referrer:
 *                 type: string
 *                 description: Referrer de la request
 *               userAgent:
 *                 type: string
 *                 description: User-Agent del navegador
 *     responses:
 *       200:
 *         description: Visualización registrada
 *       404:
 *         description: CV no encontrado
 */

module.exports = {};
