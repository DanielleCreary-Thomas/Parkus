import './Navbar.css';
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            {/*using link to replace anchor tag*/}
            <button><Link to="/">Home</Link></button>
            <button><Link to="/updateSchedule">UpdateSchedule</Link></button>
            <button><Link to="/spotSharing">SpotSharing</Link></button>
            <button><Link to="/payment">Payment</Link></button>
        </nav>
    );
}

export default Navbar;
