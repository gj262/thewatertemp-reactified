import React from "react";
import "./Header.css";

interface HeaderProps {
  right?: React.ReactNode;
}

const Header: React.FunctionComponent<HeaderProps> = ({ right }) => (
  <header>
    <h1>The Water Temperature</h1>
    <span>{right}</span>
  </header>
);

export default Header;
