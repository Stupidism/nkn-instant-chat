import Client from './client';
import consts from './const';
import crypto from './crypto';

export default function nkn(options = {}) {
  let key = crypto.Key({
    privateKey: options.privateKey,
  });
  let client = Client(key, options.identifier, {
    reconnectIntervalMin:
      options.reconnectIntervalMin || consts.reconnectIntervalMin,
    reconnectIntervalMax:
      options.reconnectIntervalMax || consts.reconnectIntervalMax,
    rpcServerAddr: options.seedRpcServerAddr || consts.seedRpcServerAddr,
  });
  return client;
}
