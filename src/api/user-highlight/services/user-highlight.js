'use strict';

/**
 * user-highlight service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-highlight.user-highlight');
