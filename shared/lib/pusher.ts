// services/PusherService.ts
import Pusher, { Channel, PresenceChannel } from "pusher-js";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, PUSHER_SOCKET_ID } from "@/shared/const/cookie";

export type ChannelType = "public" | "private" | "presence";

export interface PusherConfig {
  key: string;
  cluster?: string;
  host?: string;
  port?: number;
  forceTLS?: boolean;
  authEndpoint?: string;
  csrfTokenSelector?: string;
}

class PusherService {
  private static instance: PusherService;
  private pusher: Pusher | null = null;
  private channels: Map<string, Channel> = new Map();
  private config: PusherConfig | null = null;
  private connectionPromise: Promise<Pusher> | null = null;

  private constructor() {
    // Private constructor to enforce singleton
  }

  /**
   * Get the singleton instance of PusherService
   */
  public static getInstance(): PusherService {
    if (!PusherService.instance) {
      PusherService.instance = new PusherService();
    }
    return PusherService.instance;
  }

  /**
   * Initialize the Pusher client with configuration
   */
  public initialize(config: PusherConfig): void {
    // Store config for later use
    this.config = {
      key: config.key,
      cluster: config.cluster || "ap1",
      host: config.host,
      port: config.port || 6001,
      forceTLS: config.forceTLS !== false,
      authEndpoint: config.authEndpoint || "/broadcasting/auth",
    };
  }

  /**
   * Get or create the Pusher instance
   */
  public getPusher(): Promise<Pusher> {
    // Return existing promise if connection is in progress
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Create new connection promise
    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        if (!this.config) {
          throw new Error("Pusher not initialized. Call initialize() first.");
        }

        if (this.pusher) {
          resolve(this.pusher);
          return;
        }

        const options: any = {
          cluster: this.config.cluster,
          enabledTransports: ["ws", "wss"],
        };

        // Add WebSocket options if custom host is provided
        if (this.config.host) {
          options.wsHost = this.config.host;
          options.wsPort = this.config.port;
          options.wssPort = this.config.port;
          options.forceTLS = this.config.forceTLS;
        }

        const accessToken = Cookies.get(ACCESS_TOKEN);
        // Add authorizer for private/presence channels
        options.auth = {
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        };

        options.authEndpoint = this.config.authEndpoint;
        // Initialize Pusher
        this.pusher = new Pusher(this.config.key, {
          ...options,
        });

        // Add connection event handlers
        this.pusher.connection.bind("connected", () => {
          console.debug("Pusher connected");
          // Store socket ID in cookie for authentication with private channels
          if (this.pusher && this.pusher.connection.socket_id) {
            Cookies.set(PUSHER_SOCKET_ID, this.pusher.connection.socket_id);
          }
          resolve(this.pusher!);
        });

        this.pusher.connection.bind("error", (err: any) => {
          console.error("Pusher connection error:", err);
          // Don't reject here, as we want to keep trying to connect
        });

        this.pusher.connection.bind("disconnected", () => {
          console.debug("Pusher disconnected");
        });

        // Resolve with pusher instance
        resolve(this.pusher);
      } catch (error) {
        console.error("Pusher initialization error:", error);
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  /**
   * Subscribe to a channel
   */
  public async subscribe(
    channelName: string,
    type: ChannelType = "public"
  ): Promise<Channel> {
    try {
      // Format the channel name based on type
      let formattedName = channelName;
      if (type === "private" && !channelName.startsWith("private-")) {
        formattedName = `private-${channelName}`;
      } else if (type === "presence" && !channelName.startsWith("presence-")) {
        formattedName = `presence-${channelName}`;
      }

      // Return existing channel if already subscribed
      if (this.channels.has(formattedName)) {
        return this.channels.get(formattedName)!;
      }

      // Get Pusher instance
      const pusher = await this.getPusher();

      // Subscribe to the appropriate channel type
      let channel: Channel;
      if (type === "presence") {
        channel = pusher.subscribe(formattedName) as PresenceChannel;
      } else {
        channel = pusher.subscribe(formattedName);
      }

      // Store the channel for reuse
      this.channels.set(formattedName, channel);

      // Return the channel
      return channel;
    } catch (error) {
      console.error(`Error subscribing to ${channelName}:`, error);
      throw error;
    }
  }

  /**
   * Unsubscribe from a channel
   */
  public unsubscribe(channelName: string, type: ChannelType = "public"): void {
    try {
      if (!this.pusher) return;

      // Format the channel name based on type
      let formattedName = channelName;
      if (type === "private" && !channelName.startsWith("private-")) {
        formattedName = `private-${channelName}`;
      } else if (type === "presence" && !channelName.startsWith("presence-")) {
        formattedName = `presence-${channelName}`;
      }

      // Unsubscribe from the channel
      this.pusher.unsubscribe(formattedName);
      this.channels.delete(formattedName);
    } catch (error) {
      console.error(`Error unsubscribing from ${channelName}:`, error);
    }
  }

  /**
   * Listen for an event on a channel
   */
  public async listen<T = any>(
    channelName: string,
    eventName: string,
    callback: (data: T) => void,
    type: ChannelType = "public"
  ): Promise<() => void> {
    try {
      // Get the channel (subscribing if necessary)
      const channel = await this.subscribe(channelName, type);
      // Bind to the event
      channel.bind(eventName, callback);

      // Return an unbind function
      return () => {
        channel.unbind(eventName, callback);
      };
    } catch (error) {
      console.error(
        `Error listening to ${eventName} on ${channelName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Clean up all subscriptions
   */
  public disconnect(): void {
    if (this.pusher) {
      this.pusher.disconnect();
      this.channels.clear();
      this.pusher = null;
      this.connectionPromise = null;
    }
  }
}

export default PusherService;
