import { Route, Routes } from "react-router-dom";
import Chat from "../pages/Chat";
import Home from "../pages/Home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />
      <Route
        path="/chat"
        element={<Chat />}
      />
      <Route
        path="/about"
        element={<h1>this is about page</h1>}
      />
      <Route
        path="*"
        element={<h1>404 Page Not Found</h1>}
      />
    </Routes>
  );
};
export default AppRoutes;
