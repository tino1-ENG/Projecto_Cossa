import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private connected: boolean = false;

  init() {
    if (this.socket) return this.socket;

    this.socket = io({
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('[Socket.IO] Connected to MozBid Real-time Engine:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('[Socket.IO] Disconnected from server');
    });

    return this.socket;
  }

  getSocket(): Socket | null {
    if (!this.socket) {
      return this.init();
    }
    return this.socket;
  }

  joinAuction(auctionId: number) {
    this.getSocket()?.emit('join:auction', auctionId);
  }

  leaveAuction(auctionId: number) {
    this.getSocket()?.emit('leave:auction', auctionId);
  }

  joinUser(userId: number) {
    this.getSocket()?.emit('join:user', userId);
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.getSocket()?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.getSocket()?.off(event, callback);
  }
}

export const socketService = new SocketService();
export default socketService;
