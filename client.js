const path = require('path');
const grpc  = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PORT = 8082
const PROTO_FILE = './protos/random.proto'

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE))
const grpcObj = grpc.loadPackageDefinition(packageDef) 


const client = new grpcObj.randomPackage.Random(
  `0.0.0.0:${PORT}`, grpc.credentials.createInsecure()
)

const deadline = new Date()
deadline.setSeconds(deadline.getSeconds() + 5);

client.waitForReady(deadline, (err) => {
  if (err) {
    console.error(err)
    return '';
  }
  onClientReady()
})


function onClientReady() {
  client.PingPong({message: "Ping"}, (err, result) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(result)
  })
}