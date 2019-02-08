'use strict';

const assert = require('bsert');
const policy = require('./policy');

exports.FLAGS = {
  FRESH: 1 << 0,
  DIRTY: 1 << 1
};

class ERC721 {
  constructor(options) {
    super();

    this.issuer = options.issuer;
    this.name = options.name;
    this.url = options.url;
    this.maxTokens = policy.MAX_TOKENS;
    this.issued = null;
    this.tokenID = null;
    this.txid = null;
  }
}

