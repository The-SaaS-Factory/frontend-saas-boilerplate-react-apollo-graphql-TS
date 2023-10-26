const  serverURL = process.env.NODE_ENV === 'development' ?  'http://localhost:8080' : 'https://backend-saas-boilerplate.fly.dev';
const  serverURLWS = process.env.NODE_ENV === 'development' ?  'ws://localhost:8080' : 'wss://backend-saas-boilerplate.fly.dev';
export  { serverURL,serverURLWS};

