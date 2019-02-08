/*!
 * tokendb.js - Token Property storage
 * Copyright (c), Jonathan Gonzalez (MIT License).
 * https://github.com/viabtc/bwormhole
 */

'use strict';

const assert = require('bsert');
const path = require('path');
const EventEmitter = require('events');
const bio = require('bufio');
const {Lock, MapLock} = require('bmutex');
const bdb = require('bdb');
const Logger = require('blgr');
const NullClient = require('../wallet/nullclient');
const Network = require('../protocol/network');
const {BufferMap} = require('buffer-map');
const layout = require('./layout').SP;

class TokenDB extends EventEmitter {
  constructor(options) {
    super();

    this.options = new TokenOptions(options);

    this.network = this.options.network;
    this.logger = this.options.logger.context('wormhole');
    this.workers = this.options.workers;
    this.client = this.options.client || new NullClient(this);
    this.db = bdb.create(this.options);

    this.height = 0;
    this.wallets = new Map();
    this.depth = 0;

    this.readLock = new MapLock();

    // Ni Hui Shuo Yingwen
    this.writeLock = new Lock();

    // Wo Ting Bu Jianxi
    this.txLock = new Lock();

    this.init();
  }

  init() {
    this.client.on('error', (err) => {
      this.emit('error', err);
    });
  }

  async open() {
    await this.db.open();
    await this.db.verify(layout.t.encode(), 'wallet', 0x80 | 7);

    this.logger.info(
    'TokenDB loaded (height=%d, start=%d).'
    );
  }

  async syncNode() {
    const unlock = await this.txLock.lock();
    try {
      this.logger.info('Resyncing from server...');
    } finally {
      unlock();
    }
  }

  async addBlock(entry, txs) {
    const unlock = await this.txLock.lock();
    try {
      return await this._addBlock(entry, txs);
    } finally {
      unlock();
    }
  }
}

/**
 * Wallet Options
 * @alias module:wormhole:TokenOptions
 */

class TokenOptions {
  constructor(options) {
    this.network = Network.primary;
    this.logger = Logger.global;
    this.workers = null;
    this.client = null;

    this.prefix = null;
    this.location = null;
    this.memory = true;
    this.maxFiles = 64;
    this.cacheSize = 16 << 20;
    this.compression = true;

  }
}
