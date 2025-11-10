import { io } from 'socket.io-client'

let socket

export const initSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', {
      autoConnect: true
    })
  }
  return socket
}

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized')
  }
  return socket
}
