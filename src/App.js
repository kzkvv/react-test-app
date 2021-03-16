import logo from './logo.svg';
import './App.css';
import {
    BufferEncoders,
    encodeCompositeMetadata,
    encodeRoute,
    JsonSerializer,
    MESSAGE_RSOCKET_AUTHENTICATION,
    MESSAGE_RSOCKET_COMPOSITE_METADATA,
    RSocketClient,
} from 'rsocket-core';
import RSocketWebSocketClient from "rsocket-websocket-client/build";
import {MESSAGE_RSOCKET_ROUTING} from "rsocket-core/build/WellKnownMimeType";
import {IdentitySerializer} from "rsocket-core/build/RSocketSerialization";

const maxRSocketRequestN = 2147483647;

class MapHandler {

    constructor() {

    }

    fireAndForget(payload) {
        console.log("get response from backend")
        console.log(JSON.parse(payload.data.toString()))

        // if(payload.metadata.get() == "atmeye") {
        //     // add url check - see metadata
        // }
    }

}

function App() {
    const JSON_METADATA = 'application/vnd.spring.rsocket.metadata+json';
    const localeAndUserIdJson = JSON.stringify({
        locale: 'en-EN',
        userId: 1
    });

    const authToken = 'Bearer eyJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJmaXQiLCJpYXQiOjE2MTU4ODA0MzQsImV4cCI6MzM0Mzg4MDQzNCwiYWNjb3VudHMiOnsiMSI6eyJzZXNzaW9uSWQiOiI4WjlnREEweFQ5QW16VnA5Vk0wTW5NbFBMbmZ5Nlp6R1pGdUZrU1hPK0pVT1Z3ZEVrWVRCSld0b3JLWlhocUQvUE53bkwwdjlNa1VQcEhJUzB6YUdJaWp1ZjhDQ2M2VEl3N2RqcEhZWnpyST0iLCJ1c2VyUm9sZSI6eyJyb2xlTmFtZSI6IlNlcnZpY2UifSwidXNlck5hbWUiOiJhZG1pbiIsImNvbXBhbnlJZCI6NzEsImNvbXBhbnlOYW1lIjoiUGVua2nFsyBrb250aW5lbnTFsyBiYW5raW7El3MgdGVjaG5vbG9naWpvcywgSlNDIiwiY29tcGFueUNvdW50cnlJZCI6MX19fQ.FTyvvkvCrdSICyOkBhLhwFDfrIM4Z5O1JYqJxt6ByM49U1WgfjAOEswMKqsvqLGWt25TlSxWiqRoCPlp8PDH7bOpTZBazsj2LQ7RzD2A1J0MmmYfW5KNj0GuwZHq-UQTnfRV7b58ivV8I_V7w6UMHbXRC4-4nLzvtvFhOTxZVvTSTCy8KQFryAmbce6YCxsZOQ4-1P5DdLctMNMN_Z5_LfeZAgoA_604R3CUoVvXwTqsglGxOLQo9V8xFzCiKWgrygAc-R2XuZz3jxdU9w4urZ9Wb1vw0W95L0DJhuOSlvcsgy_BYee81L5q6j4zvBO9BQpHcTu5rvWYf9DlMhj7xA';

    const client = new RSocketClient({
        // serializers: {
        //     data: JsonSerializer,
        //     metadata: IdentitySerializer  //JsonMetadataSerializer
        // },
        setup: {
            keepAlive: 60000,
            lifetime: 180000,
            dataMimeType: 'application/json', //"application/cbor", //APPLICATION_JSON.string,
            metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.string,
            payload: {
                metadata: encodeCompositeMetadata([
                    [JSON_METADATA, Buffer.from(localeAndUserIdJson)],
                    [MESSAGE_RSOCKET_AUTHENTICATION, Buffer.from(authToken)]
                ])
            },
        },
        transport: new RSocketWebSocketClient({url: 'ws://localhost:7080'}, BufferEncoders),
        responder: new MapHandler()
    });

// Open the connection
    client.connect().then(
        socket => {
            // observe rsocket status
            // eslint-disable-next-line no-console
            socket.connectionStatus().subscribe(event => console.log(event));
            socket
                .fireAndForget({
                    data: Buffer.from('{"someParameter":"value"}'),
                    metadata: encodeCompositeMetadata([
                        [MESSAGE_RSOCKET_ROUTING, encodeRoute("/api/v1/device/VWBS0774/GET_ATM_PROPERTY")],
                        [JSON_METADATA, Buffer.from(localeAndUserIdJson)],
                        [MESSAGE_RSOCKET_AUTHENTICATION, Buffer.from(authToken)]
                    ]),
                })
                .subscribe({
                    // eslint-disable-next-line no-console
                    onComplete: () => console.log('Request-stream completed'),
                    onError: error =>
                        console.error(`Request-stream error:${error.message}`),
                    // eslint-disable-next-line no-console
                    onNext: value => console.log('%s %s', value.data, value.metadata),
                    onSubscribe: sub => sub.request(maxRSocketRequestN),
                });
        },
        error => {
            // handle connection error
            // eslint-disable-next-line no-console
            console.log('error:', error);
        },
    );
    setTimeout(() => {
    }, 30000000);

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
