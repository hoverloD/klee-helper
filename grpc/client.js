const vscode = require('vscode');
var PROTO_PATH = __dirname + '/../protos/msg.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var msg = grpc.loadPackageDefinition(packageDefinition).msg;
var client = new msg.KleeHelper('localhost:11451',
                grpc.credentials.createInsecure())

function runKleeGo(filePath) {
    client.kleeGenerate(filePath, (err, response) => {
        if(err) {
            vscode.window.showErrorMessage(err);
        } else {
            vscode.window.showInformationMessage(`KLEE helper: ${response.number} test cases generated`);
        }
    });
}

function runKleeShow(testCaseName) {
    client.kleeShowTestCase(testCaseName, (err, response) => {
        if(err) {
            vscode.window.showErrorMessage(err);
        } else {
            vscode.window.showInformationMessage(`KLEE helper: ${response.content}`);
        }
    });
}

module.exports = {
    runKleeGo,
    runKleeShow
}