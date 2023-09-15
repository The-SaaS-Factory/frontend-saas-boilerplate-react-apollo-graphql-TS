const  serverURL = process.env.NODE_ENV === 'development' ?  'http://localhost:8080' : 'https://boilerplateapi.thesaasfactory.dev';
const  serverURLWS = process.env.NODE_ENV === 'development' ?  'ws://localhost:8080' : 'wss://boilerplateapi.thesaasfactory.dev';
export  { serverURL,serverURLWS};

