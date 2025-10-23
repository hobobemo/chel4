export class ChatRoom {
  connections: WebSocket[] = [];

  async fetch(request: Request) {
    // Only handle WebSocket upgrade requests
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected WebSocket", { status: 400 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    this.handleSession(server);
    return new Response(null, { status: 101, webSocket: client });
  }

  handleSession(ws: WebSocket) {
    ws.accept();
    this.connections.push(ws);

    ws.addEventListener("message", (event) => {
      // Broadcast incoming message to all connected clients
      for (const conn of this.connections) {
        if (conn.readyState === WebSocket.OPEN) {
          conn.send(event.data);
        }
      }
    });

    ws.addEventListener("close", () => {
      this.connections = this.connections.filter(c => c !== ws);
    });
  }
}
