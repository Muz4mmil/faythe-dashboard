'use strict';

/**
 * music-library service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::music-library.music-library');
