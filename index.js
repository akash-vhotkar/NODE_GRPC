const path = require('path');
const grpc  = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PORT = 8082
const PROTO_FILE = './protos/random.proto'

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE))
const grpcObj = grpc.loadPackageDefinition(packageDef) 
const randomPackage = grpcObj.randomPackage
const interceptor  = new grpc.InterceptingCall();

function getServer() {
    const server = new grpc.Server(interceptor)
    server.addService(randomPackage.Random.service, {
        PingPong: (req, res) => {
            console.log(req.request)
            res(null, {message: "Pong"})
          }
  })
  return server;
};
  
  
function main() {
  const server = getServer()
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`Your server as started on port ${port}`)
    server.start()
  })
}

main();

