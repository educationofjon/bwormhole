'use strict';

const assert = require('bsert');
const network = exports;

network.types = ['main', 'testnet', 'regtest'];

const main = {};

main.type = 'main';

main.GENESIS_BLOCK = 540336;

main.block = {
  erc721height: 555655,
  freezeheight: 554007
};

main.deployments = {
  exodus: {
    name: 'exodus',
    startTime: 1377993600
  }
};

const testnet = {};

testnet.type = 'testnet';

testnet.block = {
  exodusHeight: 270775
};

const regtest = {};

regtest.type = 'regtest';

regtest.GENESIS = 101;

regtest.EXODUS_REWARD = 100;

regtest.block = {
  EXODUS_FUNDRAISER_HEIGHT: 101
};
