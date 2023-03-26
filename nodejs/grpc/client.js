const path = require('path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const protoObject = protoLoader.loadSync(path.resolve(__dirname, 'notes.proto'))
const NotesDefinition = grpc.loadPackageDefinition(protoObject)

const host = 'localhost:50051'
const client = new NotesDefinition.NoteService(host, grpc.credentials.createInsecure())

client.list({}, (err, notes) => {
  if (err) throw err
  console.log(notes)
})

client.find({ id: 2 }, (err, note) => {
  if (err) throw err
  if (!note.id) return console.log('Note not found')
  return console.log(note)
})
