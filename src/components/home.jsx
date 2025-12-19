import { Link } from "react-router-dom";
import styles from "../styles/styles.module.css";
import backgroundImage from '../assets/pms.webp';

export default function Home() {
  return (
    // Main home container with background image set dynamically
    <div
      className={styles.homeContainer}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Main title for the home page */}
      <h1 className={styles.homeTitle}>Project Monitoring Dashboard</h1>

      {/* Button Section: Links to Admin Login and Department Login */}
      <div className={styles.homeButtonGroup}>
        {/* Link for Admin Login */}
        <Link to="/admin-login" className={styles.loginBtn}>
          Admin Login
        </Link>

        {/* Link for Department Login */}
        <Link to="/dept-login" className={styles.loginBtn}>
          Department Login
        </Link>
      </div>
    </div>
  );
}
