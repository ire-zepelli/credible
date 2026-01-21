import "./App.css";
import BrokerPreview from "./pages/BrokerPreview.jsx";
import Home from "./pages/Home.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Profile from "./pages/Profile.jsx";
import ConnectWallet from "./pages/ConnectWallet.jsx";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="broker/:id" element={<BrokerPreview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="connect-wallet" element={<ConnectWallet />} />
      </Route>,
    ),
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

const Root = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default App;
