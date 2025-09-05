// PAGE PARAMETRES

import { Link } from "react-router-dom";
export default function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <ul>
        <li>
          <Link to="/theme">Theme</Link>
        </li>
        <li>
          <Link to="/language">Language</Link>
        </li>
        <li>
          <Link to="/cookies">Cookie settings</Link>
        </li>
      </ul>
    </div>
  );
}
