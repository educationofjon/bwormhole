/*!
 * rpc.js - a wormhole compatible json rpc for bwormhole.
 * Copyright (c) 2019, Rojikku (MIT License)
 * https://github.com/bitmain/wormhole
 */

'use strict';

const assert = require('bsert');
const {format} = require('util');
const bweb = require('bweb');
const {Lock} = require('bmutex');
const fs = require('bfile');
const Validator = require('bval');
const {BufferMap, BufferSet} = require('buffer-map');
const RPCBase = bweb.RPC;
const RPCError = bweb.RPCError;

/*
 * Constants
 */

const errs = {
  // Standard JSON-RPC 2.0 errors
  INVALID_REQUEST: bweb.errors.INVALID_REQUEST,
  METHOD_NOT_FOUND: bweb.errors.METHOD_NOT_FOUND,
  INVALID_PARAMS: bweb.errors.INVALID_PARAMS,
  INTERNAL_ERROR: bweb.errors.INTERNAL_ERROR,
  PARSE_ERROR: bweb.errors.PARSE_ERROR,

  MISC_ERROR: -1
  FORBIDDEN_BY_SAFE_MODE: -2,
  TYPE_ERROR: -3,
  INVALID_ADDRESS_OR_KEY: -5,
  OUT_OF_MEMORY: -7,
  INVALID_PARAMETER: -8,
  DATABASE_ERROR: -20,
  DESERIALIZATION_ERROR: -22,
  VERIFY_ERROR: -25,
  VERIFY_REJECTED: -26,
  VERIFY_ALREADY_IN_CHAIN: -27,
  IN_WARMUP: -28
};

class RPC extends RPCBase {
  constructor(node) {
    super();

    assert(node, 'RPC requires a node.');

    this.tdb = node.tdb;
    this.network = node.network;
    this.logger = node.logger.context('rpc');
    this.client = node.client;
    this.locker = new Lock();

    this.wallet = null;

    this.init();
  }

  init() {
    this.add('help', this.help);
    this.add('stop', this.stop);
  }

  async help(args, _help) {
    if (args.length === 0)
      return 'Select a command.';

    const json = {
      method: args[0],
      params: []
    };

    return await this.execute(json, true);
  }

  async stop(args, help) {
    if (help || args.length !== 0)
      throw new RPCError(errs.MISC_ERROR, 'stop');

    this.tdb.close();

    return 'Stopping.';
  }
}
