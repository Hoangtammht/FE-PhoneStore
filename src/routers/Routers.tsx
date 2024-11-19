import { useEffect, useState } from 'react'
import AuthRouter from './AuthRouter'
import { addAuth, authSelector, AuthState } from '../reduxs/reducers/authReducer'
import { useDispatch, useSelector } from 'react-redux'
import { localDataNames } from '../constants/appInfos'
import { Spin } from 'antd'
import AdminScreen from '../screens/admin/AdminScreen'


const Routers = () => {

  const [isLoading, setIsLoading] = useState(false);

  const auth: AuthState = useSelector(authSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = localStorage.getItem(localDataNames.authData);
    res && dispatch(addAuth(JSON.parse(res)));
  }

  return isLoading ? <Spin /> :
    !auth.access_token ? (
      <AuthRouter />
    ) : (<AdminScreen />);
}

export default Routers