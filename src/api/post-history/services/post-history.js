'use strict';

/**
 * post-history service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::post-history.post-history');
