import { ec as EC } from 'elliptic';

export default function Key(options = {}) {
  if (!(this instanceof Key)) {
    return new Key(options);
  }

  const ec = new EC('p256');
  var key;

  if (options.privateKey) {
    key = ec.keyFromPrivate(options.privateKey, 'hex');
  } else {
    key = ec.genKeyPair();
  }

  this.key = key;
  this.publicKey = key.getPublic(true, 'hex');
  this.privateKey = key.getPrivate('hex');
}
