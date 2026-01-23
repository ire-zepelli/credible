import "./App.css";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import ConnectWallet from "./pages/ConnectWallet.jsx";
import Register from "./pages/Register.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import BrokerPreview from "./pages/BrokerPreview.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="broker/:walletAddress" element={<BrokerPreview />} />
        <Route path="connect-wallet" element={<ConnectWallet />} />
        <Route path="register" element={<Register />} />
        <Route path="profile/:walletAddress" element={<Profile />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

const Root = () => <Outlet />;

export default App;
