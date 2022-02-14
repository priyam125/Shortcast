import { createStore } from 'redux';
import { persistStore } from 'redux-persist';
import reducer from './reducer';

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const persister = persistStore(store);

export { store, persister };
