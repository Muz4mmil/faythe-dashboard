'use strict';

/**
 * blocked-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::blocked-user.blocked-user');
