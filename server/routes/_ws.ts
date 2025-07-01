import type { Peer, Message } from 'crossws'

export default defineWebSocketHandler({
    open(peer: Peer) {
        
    },

    message(peer: Peer, message: Message) {
        peer.send('test')
    },

    close(peer: Peer) {

    }
})