'use strict';

const ShippingAddress = require('../database/models/shipping_addresses');

module.exports = function(req, res, next) {
  ShippingAddress.where({ user_id: req.user.id })
    .fetch({ withRelated: ['users'] })
    .then((result) => {
      const shipAddressUserId = result.toJSON().user_id;
      if (shipAddressUserId === req.user.id) {
        return next();
      } else {
        return res.send('You are not Authorized to view this.');
      }
    });
};
