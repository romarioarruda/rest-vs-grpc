const path = require('path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const notes = require('../notes.json')

const protoObject = protoLoader.loadSync(path.resolve(__dirname, 'notes.proto'))
const NotesDefinition = grpc.loadPackageDefinition(protoObject)


function List (_, callback) {
    return callback(null, { notes })
}

function ListStream (call) {
    notes.forEach(note => call.write(note))
    call.end()
}

function Find ({ request }, callback) {
    const note = notes.find((note) => note.id === request.id)

    if (note) return callback(null, note)

    return callback({ message: `Note ${request.id} not found` })
}

const server = new grpc.Server()
server.addService(
    NotesDefinition.NoteService.service,
    { List, ListStream, Find }
)

const host = 'localhost:50051'
server.bindAsync(
    host,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) return console.error(`Error on up server with port: ${port}`, err)

        server.start()
        console.log(`Server gRPC Listening on ${host}`)
    }
)