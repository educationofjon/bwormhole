/*
 * common.js - common wormhole functions
 * Copyright (c) 2018-2019 Jonathan Gonzalez (MIT License).
 */

'use strict';

const assert = require('bsert');
const bio = require('bufio');
const {encoding} = bio;
const DUMMY = Buffer.alloc(0);

/**
 * Packet types.
 * @enum {Number}
 * @default
 */

exports.types = {
  SIMPLE_SEND: 0x00,
  BUY_TOKEN: 0x01,
  RESTRICTED_SEND: 0x02,
  SEND_TO_OWNERS: 0x03,
  SEND_ALL: 0x04,
  SAVINGS_MARK: 0x0a,
  SAVINGS_COMPROMISED: 0x0b,
  AUTOMATIC_DISPENSARY: 0x0f,
  TRADE_OFFER: 0x14,
  ACCEPT_OFFER_BCH: 0x16,
  METADEX_TRADE: 0x19,
  METADEX_TRADE_CANCEL_PRICE: 0x1a,
  METADEX_TRADE_CACNEL_PAIR: 0x1b,
  METADEX_TRADE_CANCEL_ECOSYSTEM: 0x1c,
  NOTIFICATION: 0x1f,
  OFFER_ACCEPT_BET: 0x28,
  CREATE_PROPERTY_FIXED: 0x32,
  CREATE_PROPERTY_VARIABLE: 0x33,
  PROMOTE_PROPERTY: 0x34,
  CLOSE_CROWDSALE: 0x35,
  CREATE_PROPERTY_MANUAL: 0x36,
  GRANT_PROPERTY_TOKENS: 0x37,
  REVOKE_PROPERTY_TOKENS: 0x38,
  GET_BASE_PROPERTY: 0x44,
  CHANGE_ISSUER_ADDRESS: 0x46,
  ENABLE_FREEZING: 0x47,
  DISABLE_FREEZING: 0x48,
  FREEZE_PROPERTY_TOKENS: 0xb9,
  UNFREEZE_PROPERTY_TOKENS: 0xba,
  DEACTIVATION: 0xfffd,
  ACTIVATION: 0xfffe,
  ALERT: 0xffff
};

/**
 * Packet types by value.
 * @const {Object}
 * @default
 */

exports.typesByVal = [
   'SIMPLE_SEND',
   'BUY_TOKEN',
   'RESTRICTED_SEND',
   'SEND_TO_OWNERS',
   'SEND_ALL',
   'SAVINGS_MARK',
   'SAVINGS_COMPROMISED',
   'AUTOMATIC_DISPENSARY',
   'TRADE_OFFER',
   'ACCEPT_OFFER_BCH',
   'METADEX_TRADE',
   'METADEX_TRADE_CANCEL_PRICE',
   'METADEX_TRADE_CANCEL_PAIR',
   'METADEX_TRADE_CANCEL_ECOSYSTEM',
   'NOTIFICATION',
   'OFFER_ACCEPT_BET',
   'CREATE_PROPERTY_FIXED',
   'CREATE_PROPERTY_VARIABLE',
   'PROMOTE_PROPERTY',
   'CLOSE_CROWDSALE',
   'CREATE_PROPERTY_MANUAL',
   'GRANT_PROPERTY_TOKENS',
   'REVOKE_PROPERTY_TOKENS',
   'GET_BASE_PROPERTY',
   'CHANGE_ISSUER_ADDRESS',
   'ENABLE_FREEZING',
   'DISABLE_FREEZING',
   'FREEZE_PROPERTY_TOKENS',
   'UNFREEZE_PROPERTY_TOKENS',
   'DEACTIVATION',
   'ACTIVATION',
   'ALERT'
];

/**
 * Base Packet
 */

class Packet extends bio.Struct {
  constructor() {
    this.type = -1;
    this.cmd = '';
  }

  getSize() {
    return 0;
  }


  toWriter(bw) {
    return bw;
  }

  toRaw() {
    return DUMMY;
  }

  fromReader(br) {
    return this;
  }


  fromRaw(data) {
    return this;
  }
}


class SimpleSendPacket extends Packet {
  constructor() {
    super();
    this.cmd = 'simple_send';
    this.type = exports.type.SIMPLE_SEND;
  }

  static fromRaw(data, enc) {
    if (typeof data === 'string')
      data = Buffer.from(data, enc);
    return new this().fromRaw(data);
  }
}


/*
 * Expose
 */

exports.Packet = Packet;
