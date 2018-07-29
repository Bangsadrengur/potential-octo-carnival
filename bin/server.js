const App = require('../backend/app');
const system = require('../backend/system');

const app = App(system);
const port = 3000;

app.start(port);
