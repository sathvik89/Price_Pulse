const Search = ({ loading }) => {
  return (
    <button
      type="submit"
      className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-500 transition duration-300 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? "Tracking..." : "Track Price"}
    </button>
  );
};

export default Search;
