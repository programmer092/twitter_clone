import RouterProvider from "./Router/Routes";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <div>
        <Toaster />
      </div>
      <RouterProvider />
    </>
  );
}
