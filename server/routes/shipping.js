'use strict';

const express = require('express');
const router = express.Router();
const ShippingAddress = require('../database/models/ShippingAddress');
const isLoggedInGuard = require('../middleware/isLoggedInGuard');
const shippingAddressGuard = require('../middleware/shippingAddressGuard');

router
  .route('/')
  .get(isLoggedInGuard, (req, res) => {
    ShippingAddress.where({ user_id: req.user.id, active: true })
      .orderBy('active', 'DESC')
      .orderBy('primary', 'DESC')
      .orderBy('id', 'ASC')
      .fetchAll({ withRelated: ['states', 'users'] })
      .then((result) => {
        // respond with all active shipping addresses, sorted
        return res.json(result);
      })
      .catch((err) => {
        console.log('error:', err);
        return res.status(500).send('Server error');
      });
  })
  .post(isLoggedInGuard, (req, res) => {
    // get all of user's active addresses
    ShippingAddress.where({ user_id: req.user.id, active: true })
      .fetchAll()
      .then((result) => {
        // if no active addresses, set primary = true. Otherwise, false
        const primary = result.length > 0 ? false : true;
        // return posted address (next: get all of user's addresses)
        return new ShippingAddress().save({
          primary: primary,
          active: true,
          address_name: req.body.address_name,
          street: req.body.street,
          apt_suite: req.body.apt_suite,
          city: req.body.city,
          state_id: parseInt(req.body.state_id),
          country: req.body.country,
          zip: req.body.zip,
          user_id: parseInt(req.user.id),
        });
      })
      .then(() => {
        // return all of user's active addresses, sorted (next: send response)
        return ShippingAddress.where({ user_id: req.user.id, active: true })
          .orderBy('active', 'DESC')
          .orderBy('primary', 'DESC')
          .orderBy('id', 'ASC')
          .fetchAll({ withRelated: ['states'] });
      })
      .then((result) => {
        // respond with all active addresses
        return res.json(result);
      })
      .catch((err) => {
        console.log('error:', err);
        return res.status(500).send('Server error');
      });
  });

router
  .route('/:id')
  .put(isLoggedInGuard, shippingAddressGuard, (req, res) => {
    // get all of user's active addresses
    ShippingAddress.where({ user_id: req.user.id, active: true })
      .fetchAll()
      .then((result) => {
        if (result.length < 1) {
          throw new Error('Must have at least one active address to toggle primary.');
        }
        // return primary address (next: update 'primary' to false)
        return ShippingAddress.where({ user_id: req.user.id, primary: true }).fetch();
      })
      .then((result) => {
        // if trying to set primary address to primary: exit out.
        if (result.id === parseInt(req.params.id)) {
          throw new Error(`This is already the user's primary address`);
        }
        // return prior primary address to false (next: update requested 'primary' to true)
        return new ShippingAddress('id', result.id).save({
          primary: false,
        });
      })
      .then(() => {
        // return requested address as primrary (next: get all of user's addresses)
        return new ShippingAddress('id', parseInt(req.params.id)).save({
          primary: true,
        });
      })
      .then(() => {
        // return all of user's active addresses, sorted (next: send response)
        return ShippingAddress.where({ user_id: req.user.id, active: true })
          .orderBy('active', 'DESC')
          .orderBy('primary', 'DESC')
          .orderBy('id', 'ASC')
          .fetchAll({ withRelated: ['states'] });
      })
      .then((result) => {
        // respond with all addresses
        return res.json(result);
      })
      .catch((err) => {
        console.log(err.message);
        return res.status(500).send('Server error');
      });
  })
  .delete(isLoggedInGuard, shippingAddressGuard, (req, res) => {
    // get all of user's active addresses
    ShippingAddress.where({ user_id: req.user.id, active: true })
      .fetchAll()
      .then((result) => {
        const addresses = result.toJSON();
        const addressToDelete = addresses.find((address) => address.id === parseInt(req.params.id));
        const addressToPrimary = addresses.find((address) => address.id !== parseInt(req.params.id));

        // if address-to-delete is the only active address or is not the primary address...
        if (result.length === 1 || !addressToDelete.primary) {
          // defer (next: set orig address to inactive & nonprimary)
          return;
          // if multiple active addresses & trying to delete primary...
        } else {
          // return conversion of active secondary address to primary (next: set orig address to inactive & nonprimary)
          return new ShippingAddress('id', addressToPrimary.id).save({
            primary: true,
          });
        }
      })
      .then(() => {
        // return conversion of orig address to inactive/secondary (next: send response)
        return new ShippingAddress('id', parseInt(req.params.id)).save({
          primary: false,
          active: false,
        });
      })
      .then(() => {
        return res.send('Successful delete');
      })
      .catch((err) => {
        console.log('error', err);
        return res.status(500).send('Server error');
      });
  });

module.exports = router;
