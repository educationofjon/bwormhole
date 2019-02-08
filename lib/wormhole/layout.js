/*
 * layout.js - layout encoding for Tokens
 * Copyright (c) 2019, Jonathan Gonzales <MIT License>
 * https://github.com/viabtc/bwormhole
 */

'use strict';

const bdb = require('bdb');

exports.SP = {
  s: bdb.key('s', ['uint32']),
  t: bdb.key('t', ['hash256', 'uint32']),
  b: bdb.key('b', ['hash256', 'uint32'])
};
