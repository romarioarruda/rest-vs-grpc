const path = require('path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const protoObject = protoLoader.loadSync(path.resolve(__dirname, 'notes.proto'))
const NotesDefinition = grpc.loadPackageDefinition(protoObject)

const host = 'localhost:50051'
const client = new NotesDefinition.NoteService(host, grpc.credentials.createInsecure())

const list = () => {
  client.list({}, (err, notes) => {
    if (err) return console.error('Error: ', err.details)
  
    console.log('Notes: ', notes)
  })
}

const listStream = () => {
  const noteStream = client.listStream({})

  noteStream.on('data', (note) => console.log('Note:', note))
  noteStream.on('end', () => console.log('Note finished!'))
}

const find = (id) => {
  client.find({ id }, (err, note) => {
    if (err) return console.error('Error: ', err.details)
  
    console.log('Note: ', note)
  })
}

const duplex = () => {
  const duplex = client.duplex()
  duplex.on('data', (data) => {
    console.log('Receiving data from server: ', data)
  })
  duplex.write({ id: 1 })
  duplex.end()
}

// list()
// listStream()
// find(3)
duplex()