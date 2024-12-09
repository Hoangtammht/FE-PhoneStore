import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/ProductManagement';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/BannerManagement';
import FormLayout from './pages/Form/CustomerImage';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import './css/style.css';
import './css/satoshi.css';
import 'flatpickr/dist/flatpickr.min.css';
import QuoteManagement from './pages/Form/QuoteManagement';

function AdminScreen() {
    const [loading, setLoading] = useState<boolean>(true);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return loading ? (
        <Loader />
    ) : (
        <DefaultLayout>
            <Routes>
                {/* <Route
                    path="/dashboard"
                    element={
                        <>
                            <PageTitle title="Admin Dashboard | Cam phone" />
                            <ECommerce />
                        </>
                    }
                /> */}
                <Route
                    path="/products"
                    element={
                        <>
                            <PageTitle title="Admin Dashboard | Cam phone" />
                            <Calendar />
                        </>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <>
                            <PageTitle title="Admin Dashboard | Cam phone" />
                            <Profile />
                        </>
                    }
                />
                <Route
                    path="/forms/form-elements"
                    element={
                        <>
                            <PageTitle title="Admin Dashboard | Cam phone" />
                            <FormElements />
                        </>
                    }
                />
                <Route
                    path="/forms/form-layout"
                    element={
                        <>
                            <PageTitle title="Admin Dashboard | Cam phone" />
                            <FormLayout />
                        </>
                    }
                />
                <Route
                    path="/forms/quote"
                    element={
                        <>
                            <PageTitle title="Admin Dashboard | Cam phone" />
                            <QuoteManagement />
                        </>
                    }
                />
                <Route
                    path="/tables"
                    element={
                        <>
                            <PageTitle title="Admin Dashboard | Cam phone" />
                            <Tables />
                        </>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <>
                            <PageTitle title="Admin Dashboard | Cam phone" />
                            <Settings />
                        </>
                    }
                />
                <Route
                    path="/chart"
                    element={
                        <>
                            <PageTitle title="Admin Dashboard | Cam phone" />
                            <Chart />
                        </>
                    }
                />
                <Route
                    path="/ui/alerts"
                    element={
                        <>
                            <PageTitle title="Admin Dashboard | Cam phone" />
                            <Alerts />
                        </>
                    }
                />
                <Route
                    path="/ui/buttons"
                    element={
                        <>
                            <PageTitle title="Admin Dashboard | Cam phone" />
                            <Buttons />
                        </>
                    }
                />
                <Route
                    path="/auth/signin"
                    element={
                        <>
                            <PageTitle title="Admin Dashboard | Cam phone" />
                            <SignIn />
                        </>
                    }
                />
                <Route
                    path="/auth/signup"
                    element={
                        <>
                            <PageTitle title="Admin Dashboard | Cam phone" />
                            <SignUp />
                        </>
                    }
                />
            </Routes>
        </DefaultLayout>
    );
}

export default AdminScreen;
