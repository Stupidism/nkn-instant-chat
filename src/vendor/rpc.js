export default (async function rpcCall(addr, method, params = {}) {
  let response = await fetch(addr, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
    }),
  });
  let data = await response.json();
  return data;
});
