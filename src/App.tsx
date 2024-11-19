import './index.css';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import Routers from './routers/Routers';
import store from './reduxs/store';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return <ConfigProvider theme={{
    token:{
      colorTextHeading: '#1570EF'
    },
    components: {}
  }}>
    <Provider store={store}>
        <BrowserRouter >
          <Routers />
        </BrowserRouter>
      </Provider>
  </ConfigProvider>
}

export default App;
