interface SearchProps {
  search: string;
  onSearch: (search: string) => void;
}

export const Search: React.FC<SearchProps> = ({ search, onSearch }) => {
  return (
    <div>
      <input
        className="border border-grayc-200 p-2 rounded-md"
        type="text"
        placeholder="Search products"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};
