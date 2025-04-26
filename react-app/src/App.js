import {Navigate, Route, Routes} from 'react-router-dom';


import {AuthProvider} from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserPanel from './components/UserPanel';
import MainPage from './components/MainPage';
import ItemRent from "./components/ItemRent";
import AboutPage from "./components/AboutPage";
import InfoPage from "./components/InfoPage";
import AdminPanel from "./components/AdminPanel";
import LogoutHandler from './components/LogoutHandler';
import AdminPanelForUsers from "./components/AdminPanelForUsers";
import AdminPanelForItems from "./components/AdminPanelForItems";
import AdminPanelForAgreements from "./components/AdminPanelForAgreements";


function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Публичные маршруты */}
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/info" element={<InfoPage/>}/>
                <Route path="/login" element={<LoginForm/>}/>
                <Route path="/register" element={<RegisterForm/>}/>
                <Route path="/main" element={<MainPage/>}/>
                <Route path="/logout" element={<LogoutHandler/>}/>
                <Route path="/itemrent" element={<ItemRent/>}/>



                {/* Защищенные маршруты */}

                <Route path="/userPanel" element={
                    <ProtectedRoute allowedRoles={'USER'}>
                        <UserPanel/>
                    </ProtectedRoute>
                }/>

                <Route path="/adminpanel" element={
                    <ProtectedRoute requiredRole="ADMIN">
                        <AdminPanel/>
                    </ProtectedRoute>
                }/>

                <Route path="/admin/users" element={
                    <ProtectedRoute requiredRole="ADMIN">
                        <AdminPanel/>
                    </ProtectedRoute>
                }/>

                <Route path="/admin/items" element={
                    <ProtectedRoute requiredRole="ADMIN">
                        <AdminPanel/>
                    </ProtectedRoute>
                }/>

                <Route path="/admin/agreements" element={
                    <ProtectedRoute requiredRole="ADMIN">
                        <AdminPanel/>
                    </ProtectedRoute>
                }/>

                <Route path="*" element={<Navigate to="/main"/>}/>
            </Routes>
        </AuthProvider>
    );
}

export default App;