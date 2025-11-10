const registerQuizSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Player connected', socket.id)

    socket.on('score:update', (payload) => {
      // Broadcast score updates to everyone else
      socket.broadcast.emit('score:sync', payload)
    })

    socket.on('disconnect', () => {
      console.log('Player disconnected', socket.id)
    })
  })
}

export default registerQuizSocketHandlers
