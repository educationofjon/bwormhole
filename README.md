# Bwormhole

[![CircleCi Status][circleci-status-img]][circleci-status-url]
[![Coverage Status][coverage-status-img]][coverage-status-url]

**Bcash** is an alternative implementation of the bitcoin cash wormhole protocol,
written in node.js.

Bwormhole is undergoing development and testing and is in alpha stage. Bwormhole
is a fork of [bcash][bcoin] and has the same RPC API.

## Uses

- Full Node
- SPV Node
- Wallet Backend (bip44 derivation)
- Mining Backend (getblocktemplate support)
- General Purpose Bitcoin Library

Try it in the browser: https://bcoin.io/browser/

## Install

```
$ git clone git://github.com/copernet/bwormhole.git
$ cd bwormhole
$ npm install
$ ./bin/bcash
```

See the [Beginner's Guide][guide] for more in-depth installation instructions.

## Documentation

- API Docs: https://bcoin.io/docs/
- REST Docs: https://bcoin.io/api-docs/
- Docs: [docs/](docs/README.md)

## Support

Join us on [freenode][freenode] in the [#bcoin][irc] channel.

## Disclaimer

Bcash does not guarantee you against theft or lost funds due to bugs, mishaps,
or your own incompetence. You and you alone are responsible for securing your
money.

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work. `</legalese>`

## License

- Copyright (c) 2014-2015, Fedor Indutny (MIT License).
- Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
- Copyright (c) 2018, bcash developers.

See LICENSE for more info.

[bcoin]: https://bcoin.io
[purse]: https://purse.io
[freenode]: https://freenode.net/
[irc]: irc://irc.freenode.net/bcoin
[guide]: ./docs/Beginner's-Guide.md
[changelog]: ./CHANGELOG.md


[coverage-status-img]: https://codecov.io/gh/bcoin-org/bcash/badge.svg?branch=master
[coverage-status-url]: https://codecov.io/gh/bcoin-org/bcash?branch=master
[circleci-status-img]: https://circleci.com/gh/bcoin-org/bcash/tree/master.svg?style=shield
[circleci-status-url]: https://circleci.com/gh/bcoin-org/bcash/tree/master



## 贡献与许可协议

如果您为这个项目贡献代码，就默认你允许你的代码在MIT许可证下分发。你应该保证你的所有代码都是原创工作。
