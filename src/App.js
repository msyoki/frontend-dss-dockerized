import "./styles/App.css";
import "./styles/index.css";
import "./styles/ButtonClasses.css";
import "./styles/Dragdrop.css";
import "./styles/Loading.css";
import "./styles/Login.css";
import "./styles/Otp.css";
import "./styles/SignatureDialog.css";
import "./styles/style.css";
import "./styles/Dashboard.css";import "./styles/index.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import PrivateRoute from './utils/PrivateRoute';
import {AuthProvider} from './context/Authcontext';
import Login from './pages/auth/Login';
import Signing_Page_Self from "./pages/Signing_Page_Self";

import Dashboard from "./pages/dashboards/Dashboard";
import Signing_Page_Redirect from "./pages/Signing_Page_Redirect";
import NewCompany from "./pages/auth/NewCompany";
import Complete from "./pages/Complete";
import Voided from "./pages/Voided";
import Blocked from "./pages/Blocked";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";

import { registerLicense } from '@syncfusion/ej2-base';
import SelfSignOtherAction from "./pages/SelfSignOtherAction";
import NewIndividual from "./pages/auth/NewIndividual";
import NotFound from "./pages/NotFound";
import PasswordResetConfirm from "./pages/auth/PasswordResetConfirm";
import PasswordResetRequest from "./pages/auth/PasswordResetRequest";


function App() {
  registerLicense('Mgo+DSMBPh8sVXJ0S0J+XE9HflRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TckVnWHlbcXFWT2NbVA==');
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" exact={true} element={<PrivateRoute><Dashboard/></PrivateRoute> } />
          <Route path="/reset/:uid/:token" element={<PasswordResetConfirm/>}  />
          <Route path="/password-reset" element={<PasswordResetRequest/>}  />
          <Route element={<Login/>} path="/login"/>
          <Route element={<NewCompany/>} path="/company/register"/>
          <Route element={<NewIndividual/>} path="/individual/register"/>
          <Route element={<Complete/>} path="/complete"/>
          <Route element={<Voided/>} path="/declined"/>
          <Route element={<Blocked/>} path="/blocked"/>
          <Route element={<PrivateRoute><SelfSignOtherAction/></PrivateRoute>} path="selfsign/otheractions"/>
          <Route element={<PrivateRoute><AdminDashboard/></PrivateRoute>} path="/admin/dashboard"/>
          <Route element={<PrivateRoute><SuperAdminDashboard/></PrivateRoute>} path="/super/admin/dashboard"/>
          <Route element={<PrivateRoute><Signing_Page_Self/></PrivateRoute>} path="/sign"/>
          <Route element={<Signing_Page_Redirect/>} path="/mail/sign/:fileurl/:signerguid"/>
          <Route element={<NotFound/>} path="/404" />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </AuthProvider>
    </Router>

  );
}

export default App;



