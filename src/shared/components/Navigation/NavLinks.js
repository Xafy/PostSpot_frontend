import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import './NavLinks.css';

const NavLinks = props => {
    const auth = useContext(AuthContext)
    const userId = auth.userId
    return(
        <ul className="nav-links">
            <li>
                <NavLink to='/' >Spots users</NavLink>
            </li>
            {auth.isLoggedIn && <li>
                <NavLink to={`/${userId}/places`}>My spots</NavLink>
            </li>}
            {auth.isLoggedIn && <li>
                <NavLink to='/places/new'>Add spots</NavLink>
            </li>}
            {!auth.isLoggedIn &&<li>
                <NavLink to='/auth'>Authinticate</NavLink>
            </li>}
            {auth.isLoggedIn &&
            <li>
                <button className="auth-btn" onClick={auth.logout}>Logout</button>
            </li>}
        </ul>
    )
}

export default NavLinks;