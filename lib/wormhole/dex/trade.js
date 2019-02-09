/*!
 * trades.js - MetaDex trade rules.
 * Copyright (c), 2019, Jonathan Gonzales (MIT License).
 * https://github.com/wormhole/bwormhole
 */

'use strict';

const assert = require('bsert');
const bio = require('bufio');
const {BufferSet} = require('buffer-map');
const trade = exports;

const types = {
  INVALID: 0,
  OPEN: 1,
  FILLED: 3,
  CANCELLED: 4
};

trade.typesByVal = {
  [types.INVALID]: 'INVALID',
  [types.OPEN]: 'OPEN',
  [types.FILLED]: 'FILLED',
  [types.CANCELLED]: 'CANCELLED'
};

class MetaDex extends bio.Struct {
  constructor() {
    super();

    this.txid = null;
    this.tokenId = null;
    this.value = null;
    this.desired = null;
    this.remaining = null;
    this.subaction = null;
  }

  isNull() {
    return this.tokenId === null
        && this.value === null
        && this.desired === null
        && this.supply === null
        && this.subaction === null;
  }

  getSize() {
    let size = 0;

    size += 4;

    return size;
  }
}

module.exports = MetaDex;
