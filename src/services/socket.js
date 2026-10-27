import { io } from 'socket.io-client'

/** One shared real-time connection to the Chatify server (proxied by Vite in dev). */
export const socket = io()
