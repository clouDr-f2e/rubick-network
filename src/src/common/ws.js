export function initWs(wsPort = 8002, path = 'do-not-proxy') {
  if(!WebSocket){
    throw (new Error('WebSocket is not supported on this browser'));
  }

  const wsClient = new WebSocket(`ws://localhost:${wsPort}/${path}`);
  wsClient.onerror = (error) => {
    console.error(error);
  };

  wsClient.onopen = (e) => {
    console.info('websocket opened: ', e);
  };

  wsClient.onclose = (e) => {
    console.info('websocket closed: ', e);
  };

  return wsClient;
}

export default {
  initWs: initWs
};
