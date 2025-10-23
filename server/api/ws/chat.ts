export { ChatRoom } from '../../ws/chat';

export default defineEventHandler(async (event) => {
  const req = event.node.req as Request;
  const env = process.env as any;

  // Get or create a Durable Object instance
  const id = env.CHAT_ROOM.idFromName("main");
  const stub = env.CHAT_ROOM.get(id);

  // Forward the WebSocket upgrade request
  return await stub.fetch(req);
});
