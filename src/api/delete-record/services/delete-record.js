'use strict';

/**
 * delete-record service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::delete-record.delete-record');
