export function useChat() {
  const messages = ref<string[]>([]);
  let ws: WebSocket | null = null;

  function connect() {
    if (ws) return;
    const url = (process.dev ? 'ws://localhost:3000' : 'wss://chel.gg') + '/api/ws';
    ws = new WebSocket(url);

    ws.onmessage = (e) => {
      messages.value.push(e.data);
    };

    ws.onopen = () => {
      console.log('Connected to chat');
    };

    ws.onclose = () => {
      console.log('Disconnected from chat');
      ws = null;
      // Optional: auto-reconnect
      setTimeout(connect, 3000);
    };
  }

  function send(msg: string) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  }

  onMounted(connect);

  return { messages, send };
}
