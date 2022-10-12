import { css } from "@emotion/react";
import logo from "../assets/images/logo-white.png";

const App = () => {
  return (
    <div
      className="h-full bg-slate-400 p-8"
      // You can use the `css` prop like this to write any styling
      // you can't do with tailwind
      css={css`
        color: white;
      `}
    >
      <img src={logo} />
      App
    </div>
  );
};

export default App;
