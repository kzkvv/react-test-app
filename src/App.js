import logo from './logo.svg';
import './App.css';
import {APPLICATION_JSON, BufferEncoders, JsonSerializer, JsonSerializers, RSocketClient,} from 'rsocket-core';
import RSocketTcpClient from 'rsocket-tcp-client';
import {RSocketResumableTransport, Utf8Encoders} from "rsocket-core/build";
import RSocketWebSocketClient from "rsocket-websocket-client/build";
import {JsonMetadataSerializer, Metadata} from "./metadata";
// Create an instance of a client




function App() {
    let socket;

    const client = new RSocketClient({
        // send/receive objects instead of strings/buffers
        serializers: {
            data: JsonSerializer,
            metadata: JsonMetadataSerializer
        },
        setup: {
            debug: true,
            // ms btw sending keepalive to server
            keepAlive: 60000,
            // ms timeout if no keepalive response
            lifetime: 180000,
            // format of `data`
            dataMimeType: "*/*", //"application/json", //APPLICATION_JSON.toString(),//'application/jsonq',
            // format of `metadata`
            metadataMimeType: "*/*", //JsonMetadataSerializer.MIME_TYPE, //"application/json", //APPLICATION_JSON.toString(),
            // 'application/jsonq',
            route: '/api/v1/device/DEVICE_NAME/GET_ATM_PROPERTY',
            locale: "en-EN",
            userId: 1,
            'message/x.rsocket.authentication.v0': "Bearer токен",
            metadata: {
                "route": '/api/v1/device/DEVICE_NAME/GET_ATM_PROPERTY',
                "locale": "en-EN",
                "userId": 1,
                "message/x.rsocket.authentication.v0": "Bearer токен"
            }
        },
         transport: new RSocketWebSocketClient({url: 'ws://localhost:7080'}, BufferEncoders),
        // transport: new RSocketTcpClient(
        //     {host: '127.0.0.1', port: 8080}, // options to Node.js net.connect()
        //     BufferEncoders,
        // ),
    });

    // Open the connection
    console.log("st")
    // console.log(client.getConnectionState())
    // Open the connection
    // client.connect()
    //     .then(sub => {
    //     return client.fetchUserProfile();
    // })
    let metadata11 = new Metadata();
    metadata11.set(Metadata.ROUTE, `/api/v1/device/DEVICE_NAME/GET_ATM_PROPERTY`);
    metadata11.set(Metadata.AUTHENTICATION_BEARER, "Bearer aaa");
    metadata11.set("userId", 1);
    metadata11.set("locale", "en-EN");


        // client.connect().subscribe({
        //     onComplete: s => {
        //         this.socket = s;
        //         resolve(this.socket);
        //     },
        //     onError: error => reject(error),
        //     onSubscribe: cancel => { this.cancel = cancel}
        // });
        //
        // .then(sub => {
        //     return new Promise((resolve, reject) => {
        //         let metadata = new Metadata();
        //         metadata.set(Metadata.ROUTE, `fetch.profile.${login}`);
        //         metadata.set(Metadata.AUTHENTICATION_BEARER, this.securityService.getToken());
        //         socket.requestResponse({
        //             metadata: metadata11,
        //         }).subscribe({
        //             onComplete: msg => resolve(msg.data),
        //             onError: error => reject(error)
        //         });
        //     });
        // })

    client.connect().subscribe({
        onComplete: socket => {
            //this.socket = socket;
            console.log("1122")
            // socket provides the rsocket interactions fire/forget, request/response,
            // request/stream, etc as well as methods to close the socket.
            let metadata = {
                route: '/api/v1/device/DEVICE_NAME/GET_ATM_PROPERTY',
                locale: "en-EN",
                userId: 1,
                "message/x.rsocket.authentication.v0": "Bearer токен"
            };
            socket.fireAndForget({
                data: metadata,
                metadata: metadata11,
            }).subscribe({
                onSubscribe: sub => sub.request({
                    metadata: metadata
                }),
                onError: error => console.log(error),
                onNext: msg => console.log(msg.data),
                onComplete: () => console.log("qw0")
            });
        },
        onError: error => console.error(error),
        onSubscribe: cancel => { console.log(cancel)}
    });
    // this.socket.fireAndForget(
    //     {
    //         data: {some: {json: {value: 1}}},
    //         metadata: {
    //             route: '/api/v1/device/DEVICE_NAME/GET_ATM_PROPERTY',
    //             locale: "en-EN",
    //             "userId": 1,
    //             "message/x.rsocket.authentication.v0": "Bearer токен"
    //         },
    //     }
    // )


    // client.connect().subscribe({
    //     onComplete: socket => {
    //         // socket provides the rsocket interactions fire/forget, request/response,
    //         // request/stream, etc as well as methods to close the socket.
    //         console.log("111")
    //         socket.fireAndForget({
    //             data: new Buffer("qwe"),
    //             metadata: new Buffer("qwe1"), // or new Buffer(...)
    //         });
    //     },
    //     onError: error => console.error(error),
    //     onSubscribe: cancel => {/* call cancel() to abort */
    //     }
    // });
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
