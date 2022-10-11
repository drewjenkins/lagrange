import { Route, Routes } from "react-router-dom";
import App from "./components/App";
import Test from "./components/Test";

type RouterProps = {};

const Router = (props: RouterProps) => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
};

export default Router;
