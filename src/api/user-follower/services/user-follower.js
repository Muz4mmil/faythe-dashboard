'use strict';

/**
 * user-follower service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-follower.user-follower');
