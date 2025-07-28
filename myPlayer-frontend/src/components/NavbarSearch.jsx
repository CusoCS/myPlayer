import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NavbarSearch.module.css";

const NavbarSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to homepage with search query as URL parameter
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
      setQuery(""); // Clear the search input
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Quick search..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          🔍
        </button>
      </div>
    </form>
  );
};

export default NavbarSearch;
