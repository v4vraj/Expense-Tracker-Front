import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./pages/Login";

const Router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={Router} />;
}

export default App;
