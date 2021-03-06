'use strict';

const express = require('express');
const router = express.Router();
const Transaction = require('../database/models/Transaction');
const Order = require('../database/models/Order');
const Item = require('../database/models/Item');
const CartedItem = require('../database/models/CartedItem');
const isLoggedInGuard = require('../middleware/isLoggedInGuard');

const knex = require('../database/knex.js');

router.route('/').post(isLoggedInGuard, (req, res) => {
  new Transaction()
    .save({
      purchased_by: req.user.id,
      shipping_address_id: parseInt(req.body.shipping_address_id),
      payment_card_id: parseInt(req.body.payment_card_id),
    })
    .then((result) => {
      const orderList = req.body.orders;
      orderList.forEach((order) => {
        (order.transaction_id = result.attributes.id), (order.order_status_id = 1);
      });
      // return posted orders (next: fetch purchased items)
      return Order.collection(orderList).invokeThen('save');
    })
    .then(() => {
      const orderList = req.body.orders;
      let orderedItems = [];
      orderList.forEach((order) => {
        orderedItems.push(order.item_id);
      });
      // return purchased items (next: decrease inventory)
      return Item.where('id', 'IN', orderedItems)
        .orderBy('id', 'ASC')
        .fetchAll();
    })
    .then((result) => {
      const orderedItems = result.toJSON();
      const sortedOrders = req.body.orders.sort((a, b) => {
        return a.item_id - b.item_id;
      });

      let itemList = [];

      orderedItems.forEach((orderedItem, index) => {
        itemList.push({
          id: orderedItem.id,
          inventory: orderedItem.inventory - sortedOrders[index].quantity,
        });
      });
      // return updated inventories on purchased items (next: fetch user's cart)
      return Item.collection(itemList).invokeThen('save');
    })
    .then(() => {
      return CartedItem.where({ carted_by: req.user.id }).fetchAll();
      // return res.json(result);
    })
    .then((result) => {
      const userCart = result.toJSON();
      return CartedItem.collection(userCart).invokeThen('destroy');
    })
    .then(() => {
      console.log('order works');
      return res.send('Order successfully submitted');
    })
    .catch((err) => {
      console.log('error:', err);
      return res.status(500).send('Server error');
    });
});

router.route('/sales').get(isLoggedInGuard, (req, res) => {
  knex
    .raw(
      `SELECT DISTINCT ON (orders.id)
        orders.id AS id,
        orders.quantity AS quantity,
        orders.created_at AS created_at,
        orders.updated_at AS updated_at,
        os.status_name AS status,
        ub.username AS purchased_by,
        us.username AS sold_by,
        items.name AS item_name,
        items.description AS item_description,
        items.price AS item_price,
        items.shipping_cost AS shipping_cost,
        item_images.image_link AS image_link,
        sa.tax_rate AS tax_rate,
        ship_addr.address_name AS shipping_addr_name,
        ship_addr.street AS shipping_addr_street,
        ship_addr.apt_suite AS shipping_addr_apt_suite,
        ship_addr.city AS shipping_addr_city,
        ship_addr.country AS shipping_addr_country,
        ship_addr.zip AS shipping_addr_zip,
        sa.postal_code AS shipping_addr_state_abbr,
        sa.name AS shipping_addr_state_name
      FROM orders
      INNER JOIN transactions txn ON txn.id = orders.transaction_id
      INNER JOIN items ON items.id = orders.item_id
      INNER JOIN item_images ON item_images.item_id = items.id
      INNER JOIN order_statuses os ON os.id = orders.order_status_id
      INNER JOIN users ub ON ub.id = txn.purchased_by
      INNER JOIN users us ON us.id = items.user_id
      INNER JOIN shipping_addresses ship_addr ON ship_addr.id = txn.shipping_address_id
      INNER JOIN states sa ON sa.id = ship_addr.state_id
      WHERE items.user_id = ?`,
      [req.user.id],
    )
    .then((result) => {
      // respond with all orders
      return res.json(result.rows);
    })
    .catch((err) => {
      console.log('error:', err);
      return res.status(500).send('Server error');
    });
});

router.route('/purchases').get(isLoggedInGuard, (req, res) => {
  knex
    .raw(
      `SELECT
        txn_orders.txn_id,
        ub.username AS purchased_by,
        ship_addr.address_name AS shipping_addr_name,
        ship_addr.street AS shipping_addr_street,
        ship_addr.apt_suite AS shipping_addr_apt_suite,
        ship_addr.city AS shipping_addr_city,
        ship_addr.country AS shipping_addr_country,
        ship_addr.zip AS shipping_addr_zip,
        sa.postal_code AS shipping_addr_state_abbr,
        sa.name AS shipping_addr_state_name,
        sa.tax_rate AS tax_rate,
        txn_orders.txn_orders 
      FROM
        (SELECT
          txn.id AS txn_id,
          txn.purchased_by,
          txn.shipping_address_id AS ship_addr_id,
          json_agg(order_details) AS txn_orders
        FROM
          (SELECT orders.transaction_id AS txn_id, json_build_object(
            'order_id', orders.id,
            'order_quantity', orders.quantity,
            'order_created_at', orders.created_at,
            'order_updated_at', orders.updated_at,
            'order_status', os.status_name,
            'sold_by', us.username,
            'item_name', items.name,
            'item_description', items.description,
            'item_price', items.price,
            'shipping_cost', items.shipping_cost) AS order_details
          FROM orders
          INNER JOIN order_statuses os ON os.id = orders.order_status_id
          INNER JOIN items ON items.id = orders.item_id
          INNER JOIN users us ON us.id = items.user_id) orders
        INNER JOIN transactions txn ON txn.id = orders.txn_id
        GROUP BY txn.id) txn_orders
      INNER JOIN users ub ON ub.id = txn_orders.purchased_by
      INNER JOIN shipping_addresses ship_addr ON ship_addr.id = txn_orders.ship_addr_id
      INNER JOIN states sa ON sa.id = ship_addr.state_id
      WHERE txn_orders.purchased_by = ?`,
      [req.user.id],
    )
    .then((result) => {
      // respond with all orders
      return res.json(result.rows);
    })
    .catch((err) => {
      console.log('error:', err);
      return res.status(500).send('Server error');
    });
});

module.exports = router;
