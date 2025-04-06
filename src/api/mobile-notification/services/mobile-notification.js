'use strict';

/**
 * mobile-notification service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::mobile-notification.mobile-notification');
