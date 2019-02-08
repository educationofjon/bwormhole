/*!
 * wormhole.js - Preliminary Design
 * Copyright (c) 2019, Jonathan Gonzalez (MIT License)
 * https://github.com/viabtc/wormhole
 */

'use strict';

const assert = require('bsert');
const EventEmitter = require('events');
const {Lock} = require('bmutex');
const bio = require('bufio');
const {BufferSet} = require('buffer-map');
const layout = require('./layout').SP;
const {encoding} = bio;


/*
 * Constants
 */

const EMPTY_BUFFER = Buffer.alloc(0x00);
const CLASS_C = '08776863'; // OP_RETURN
const CLASS_AB = '76a914946cb2e08075bcbaf157e47bcb67eb2b2339d24288ac'; // P2PKH

class Wormhole {
  constructor(tdb, pid) {
    this.tdb = tdb;
    this.db = tdb.db;
    this.logger = tdb.logger;
    this.tid = tid || 0;
    this.bucket = null;
    this.wallet = null;
    this.locked = new BufferSet();
  }

  async open(wallet) {
    const prefix = layout.t.encode(wallet.pid);

    this.pid = wallet.pid;
    this.bucket = this.db.bucket(prefix);
    this.wallet = wallet;
  }
}

module.exports = Wormhole;

