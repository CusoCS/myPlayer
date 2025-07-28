import { useState } from "react";
import styles from "./SearchBar.module.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for your favorite songs..."
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>
        🔍 Search
      </button>
    </form>
  );
};

export default SearchBar;
