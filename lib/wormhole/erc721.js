'use strict';

const assert = require('bsert');


exports.FLAGS = {
  FRESH: 1 << 0,
  DIRTY: 1 << 1
};

class ERC721 {
  constructor(options) {

    this.issuer = options.issuer;
    this.name = options.name;
    this.url = options.url;
    this.maxTokens = null;
    this.issued = null;
    this.propertyID = null;
    this.txid = null;
  }
}

