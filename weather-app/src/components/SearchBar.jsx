import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onSearch, onLocationSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="w-full pl-12 pr-20 py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={onLocationSearch}
            className="absolute right-2 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 group"
            disabled={isLoading}
            title="Use current location"
          >
            <MapPin className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;