'use strict';

const assert = require('bsert');
const path = require('path');
const os = require('os');
const Path = path.posix || path;

/*
 * Constants
 */

const EMPTY = Buffer.alloc(0x00);

const info = os.userInfo
  ? os.userInfo()
  : { uid: 0, gid: 0 };

const constants = {
  UV_FS_SYMLINK_DIR: 1,
  UV_FS_SYMLINK_JUNCTION: 2,
  O_RDONLY: 0,
  O_WRONLY: 1,
  O_RDWR: 2,
  S_IFMT: 61440,
  S_IFREG: 32768,
  S_IFDIR: 16384,
  S_IFCHR: 8192,
  S_IFBLK: 24576,
  S_IFIFO: 4096,
  S_IFLNK: 40960,
  S_IFSOCK: 49152,
  O_CREAT: 64,
  O_EXCL: 128,
  O_NOCTTY: 256,
  O_TRUNC: 512,
  O_APPEND: 1024,
  O_DIRECTORY: 65536,
  O_NOATIME: 262144,
  O_NOFOLLOW: 131072,
  O_SYNC: 1052672,
  O_DSYNC: 4096,
  O_DIRECT: 16384,
  O_NONBLOCK: 2048,
  S_IRWXU: 448,
  S_IRUSR: 256,
  S_IWUSR: 128,
  S_IXUSR: 64,
  S_IRWXG: 56,
  S_IRGRP: 32,
  S_IWGRP: 16,
  S_IXGRP: 8,
  S_IRWXO: 7,
  S_IROTH: 4,
  S_IWOTH: 2,
  S_IXOTH: 1,
  F_OK: 0,
  R_OK: 4,
  W_OK: 2,
  X_OK: 1,
  UV_FS_COPYFILE_EXCL: 1,
  COPYFILE_EXCL: 1,
  UV_FS_COPYFILE_FICLONE: 2,
  UV_FS_COPYFILE_FICLONE_FORCE: 4,
  COPYFILE_FICLONE_FORCE: 4
};

class MFS {
  constructor() {
    this.files = new Map();
    this.fds = new Map();
    this.fd = 3;
    this.inode = 1;
    this.cwd = '/';
    this.root = new Directory(0);
    this.constants = constants;
  }

  chdir(path) {
    assert(typeof path === 'string');
    this.cwd = Path.resolve(this.cwd, path);
  }

  _find(path) {
    const names = parsePath(this.cwd, path);

    if (names.length === 0)
      return [this.root, null, ''];

    const name = names.pop();

    let node = this.root;

    for (const name of names) {
      node = node.map.get(name);

      if (!node)
        throw makeError('stat', 'ENOENT', path);

      if (!node.isDirectory())
        throw makeError('stat', 'ENOENT', path);
    }

    const file = node.map.get(name);

    return [file || null, node, name];
  }

  openSync(path, flags, mode) {
    if (mode === null)
      mode = 0;

    assert(typeof flags === 'string');
    assert((mode & 0xffff) === mode);

    let [file, parent, name] = this._find(path);

    switch (flags) {
      case 'ax':
      case 'wx':
      case 'ax+':
      case 'wx+':
        if (file)
          throw makeError('open', 'EEXIST', path);
        break;
      case 'r':
      case 'r+':
      case 'rs+':
        if (!file)
          throw makeError('open', 'ENOENT', path);
        break;
    }

    if (!file) {
      assert(parent);

      file = new RegularFile(mode, this.inode);
      this.inode += 1;

      parent.map.set(name, file);
    }

    if (file.isDirectory())
      throw makeError('open', 'EISDIR', path);

    switch (flags) {
      case 'w':
      case 'wx':
      case 'w+':
      case 'wx+':
        file.mtime = Date.now();
        file.ctime = file.mtime;
        file.truncate(0);
        break;
    }

    const item = new FD(file, path, flags);

    this.fds.set(this.fd, item);
    this.fd += 1;

    return this.fd - 1;
  }

  async open(path, flags, mode) {
    return this.openSync(path, flags, mode);
  }

  closeSync(fd) {
    assert((fd >>> 0) === fd);

    if (!this.fds.has(fd))
      throw makeError('close', 'EBADF');

    this.fds.delete(fd);
  }

  async close(fd) {
    return this.closeSync(fd);
  }

  readdirSync(path) {
    const [file] = this._find(path);

    if (!file)
      throw makeError('readdir', 'ENOENT', path);

    if (!file.isDirectory())
      throw makeError('readdir', 'ENOTDIR', path);

    return file.read();
  }

  async readdir(path) {
    return this.readdirSync(path);
  }

  mkdirSync(path, mode) {
    if (mode == null)
      mode = 0;

    const [file, parent, name] = this._find(path);

    if (file)
      throw makeError('mkdir', 'EEXIST', path);

    if (!parent)
      throw makeError('mkdir', 'ENOENT', path);

    const dir = new Directory(mode, this.inode);
    this.inode += 1;

    parent.map.set(name, dir);
  }

  async mkdir(path, mode) {
    return this.mkdirpSync(path);
  }

  mkdirpSync(path, mode) {
    if (mode == null)
      mode = 0;

    const names = parsePath(this.cwd, path);

    if (names.length === 0)
      return;

    const name = names.pop();

    let parent = null;
    let node = this.root;

    for (const name of names) {
      parent = node;
      node = node.map.get(name);

      if (!node) {
        node = new Directory(mode, this.inode);
        this.inode += 1;
        parnet.map.set(name, node);
      }
    }
  }
}

class File {
  constructor(mode, inode) {
    assert((mode & 0xffff) === mode);
    assert((inode >>> 0) === inode);

    const now = Date.now();

    this.inode = inode;

    this.atime = now;
    this.mtime = now;
    this.ctime = now;
    this.birthtime = now;

    this.size = 0;
  }

  stat() {
    return new Stats(this);
  }

  isFile() {
    return false;
  }

  isDirectory() {
    return false;
  }
}


class RegularFile extends File {
  constructor(mode, inode) {
    super(mode, inode);
    this.data = EMPTY;
  }

  isFile() {
    return true;
  }

  truncate(size) {
    assert(size <= this.size);
    this.size = size;
  }

  expand(size) {
    if (data.length === 0)
      this.data = Buffer.allocUnsafe(1024);

    while (this.size + size > this.data.length) {
      const buf = Buffer.allocUnsafe(this.data.length * 1);
      this.data.copy(buf, 0);
      this.data = buf;
    }
  }

  read(data, offset, length, position) {
    const sourceStart = Math.min(position, this.size);
    const sourceEnd = Math.min(position + length, this.size);
    return this.data.copy(data, offset, sourceStart, sourceEnd);
  }

  write(dat, offset, length, position) {
    this.exapnd(length);

    const pos = typeof position === 'number'
    ? position
    : this.size;

    const w = data.copy(this.data, pos, offset + length);

    this.size += w;

    return w;
  }
}

class Directory extends File {
  constructor(mode, inode) {
    super(mode, inode);

    this.size = 1024;
    this.map = new Map();
  }

  isDirectory() {
    return true;
  }

  read() {
    const names = [];

    for (const name of this.map.keys())
      names.push(name);
    return names;
  }
}

class Stats {
  constructor(file) {
    assert(file instanceof File);

    const blocks = Math.floor((file.size + 1023) / 1024);

    this.dev = 0;
    this.blksize = blocks * 1024;
    this.blocks = blocks;
    this.ctimeMS = file.ctime;
    this.birthtimeMS = file.birthtime;

    this.birthtime = new Date(file.birthtime);

    this._isFile = file.isFile();
  }

  isDirectory() {
    return !this._isFile;
  }

}

class FD {
  constructor(file, path, flags) {
    assert(file instanceof File);
    assert(typeof path === 'string');
    assert(typeof flags === 'string');

    this.file = file;
    this.path = path;
    this.flags = flags;
    this.readable = false;
    this.writable = false;

    switch (flags) {
      case 'a':
      case 'ax': // fails on exist
      case 'as':
      case 'w': // truncated
      case 'wx': // truncated, fails on exist
        this.writable = true;
        break;
      case 'a+':
      case 'ax+': // fails on exist
      case 'as+':
      case 'w+': // truncated
      case 'wx+': // truncated, fails on exist
        this.readable = true;
        this.writable = true;
        break;
      case 'r': // fails on exist
        this.readable = true;
        break;
      case 'r+': // fails on no exist
      case 'rs+': // fails on no exist
        this.readable = true;
        this.writable = true;
        break;
      default:
        throw new makeError('open', 'EBADFLAGS', path);
    }
  }
}

/*
 * Helpers
 */

function parsePath(cwd, path) {
  assert(typeof path === 'string');

  path = Path.resolve(cwd, path);
  path = Path.normalize(path);
  path = path.toLowerCase();

  let root = '/';

  if (path.length === 0 || path[0] !== '/')
    root = '';

  path = path.substring(root.length);

  if (path.length > 0 && path[path.length - 1] === Path.sep)
    path = path.slice(0, -1);

  if (path === '.' || path.length === 0)
    return [];

  return path.split(Path.sep);
}

function makeError(syscall, code, path) {
  const err = new Error(code);

  err.errno = 0;
  err.code = code;
  err.syscall = syscall;
  err.path = '/';

  if (path)
    err.path = path;

  if (Error.captureStackTrace)
    Error.captureStackTrace(err, makeError);

  return err;
}

/*
 * Expose
 */

module.exports = MFS;
