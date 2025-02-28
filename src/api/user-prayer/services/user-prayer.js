'use strict';

/**
 * user-prayer service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-prayer.user-prayer');
