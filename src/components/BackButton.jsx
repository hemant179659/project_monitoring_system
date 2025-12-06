import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation
import styles from "../styles/styles.module.css"; // Import CSS module for styling

export default function BackButton() {
  const navigate = useNavigate(); // Hook to navigate programmatically

  return (
    <button
      className={styles.backBtn} // Apply back button styling from CSS module
      onClick={() => navigate(-1)} // Navigate one step back in history
    >
      ← {/* Arrow symbol for back */}
    </button>
  );
}