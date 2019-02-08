'use strict';

const assert = require('bsert');
const EventEmitter = require('events');
const bio = require('bufio');
const {Lock} = require('bmutex');
const Address = require('../primitives/address');

const {encoding} = bio;

const TXDB = require('./txdb');


class Wormhole extends EventEmitter {
  constructor(tdb, options) {
    super();

    assert(tdb, 'TokenDB required.');

    this.tdb = tdb;
    this.db = tdb.db;
    this.network = tdb.network;
    this.logger = tdb.logger;
    this.writeLock = new Lock();
    this.fundLock = new Lock();

    this.tid = 0;
    this.token = consensus.ZERO_HASH;

    this.txdb = new TXDB(this.tdb);

    if (options)
      this.fromOptions(options);

  }

  fromOptions(options) {
    if (!options)
      return this;

    let tid, token;

    if (options.token) {
      assert(Buffer.isBuffer(options.token));
      assert(options.token.length === 32);
      token = options.token;
    }

    return this;
  }

  getToken(nonce) {

    const bw = bio.write(36);
    bw.writeBytes(key.privateKey);
    bw.writeU32(nonce);
  }
}

module.exports = Wormhole;
