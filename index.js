import {default as session} from './src/session.js';
import {readlineListener} from './src/readlineListener.js';

const App = () => {
    readlineListener.listen(session.start());
}

App();


