import React from "react";
import "./Header.css";

interface HeaderProps {
  right: React.ReactNode;
}

export type HeaderComponentType = React.FunctionComponent<HeaderProps>;

const Header: HeaderComponentType = ({ right }) => (
  <header>
    <h1>The Water Temperature</h1>
    <span>{right}</span>
  </header>
);

export default Header;
