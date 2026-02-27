/**
 * @swagger
 * /api/share/{cvId}:
 *   post:
 *     summary: Crear enlace compartible de CV
 *     description: Generar un enlace público para compartir un CV
 *     tags: [Share]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cvId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del CV
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expiresIn:
 *                 type: string
 *                 example: "7d"
 *                 description: Tiempo de expiración del enlace
 *               password:
 *                 type: string
 *                 description: Contraseña opcional para proteger el enlace
 *     responses:
 *       201:
 *         description: Enlace compartible creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shareId:
 *                   type: string
 *                 shareUrl:
 *                   type: string
 *                   format: url
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *
 *   get:
 *     summary: Obtener información del enlace compartible
 *     description: Verificar si un enlace compartible es válido
 *     tags: [Share]
 *     parameters:
 *       - in: path
 *         name: cvId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información del enlace
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shareId:
 *                   type: string
 *                 views:
 *                   type: integer
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Enlace no encontrado
 */

/**
 * @swagger
 * /api/share/{shareId}/cv:
 *   get:
 *     summary: Ver CV compartido
 *     description: Acceder a un CV compartido públicamente
 *     tags: [Share]
 *     parameters:
 *       - in: path
 *         name: shareId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del enlace compartible
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *         description: Contraseña si el enlace está protegido
 *     responses:
 *       200:
 *         description: CV compartido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CV'
 *       401:
 *         description: Contraseña requerida o incorrecta
 *       404:
 *         description: CV no encontrado o enlace expirado
 */

/**
 * @swagger
 * /api/share/{shareId}/revoke:
 *   post:
 *     summary: Revocar enlace compartible
 *     description: Desactivar un enlace compartible
 *     tags: [Share]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shareId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enlace revocado
 *       404:
 *         description: Enlace no encontrado
 *       401:
 *         description: No autorizado
 */

module.exports = {};
