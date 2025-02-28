'use strict';

/**
 * comment-history service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::comment-history.comment-history');
