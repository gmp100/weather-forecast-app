import React from 'react';
import { Heart, Trash2 } from 'lucide-react';

const Favorites = ({ favorites, onSelectCity, onRemoveFavorite, onToggleFavorite, currentCity }) => {
  // Helper function for unique city id
  const getCityId = (city) => `${city.name}-${city.country}`;

  // Add city to favorites if not already there
  const handleAddToFavorites = () => {
    if (
      currentCity &&
      !favorites.find(fav => getCityId(fav) === getCityId(currentCity))
    ) {
      onToggleFavorite(currentCity);
    }
  };

  // Check if city is already favorited
  const isCityFavorited =
    currentCity &&
    favorites.find(fav => getCityId(fav) === getCityId(currentCity));

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Favorite Cities</h3>

        {currentCity && (
          <button
            onClick={handleAddToFavorites}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
              isCityFavorited
                ? 'bg-red-500/20 text-red-200 cursor-not-allowed'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            disabled={isCityFavorited}
          >
            <Heart
              className={`h-4 w-4 ${isCityFavorited ? 'fill-current' : ''}`}
            />
            <span className="text-sm">
              {isCityFavorited ? 'Added to Favorites' : 'Add to Favorites'}
            </span>
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <Heart className="h-12 w-12 text-white/50 mx-auto mb-3" />
          <p className="text-white/70">No favorite cities yet.</p>
          <p className="text-white/50 text-sm">
            Search for a city and add it to your favorites!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((city) => (
            <div
              key={getCityId(city)}
              className="bg-white/15 backdrop-blur-sm rounded-xl p-4 hover:bg-white/25 transition-all duration-300 border border-white/20 cursor-pointer group"
              onClick={() => onSelectCity(city.name)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold text-lg mb-1">
                    {city.name}
                  </h4>
                  <p className="text-white/70 text-sm">{city.country}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(getCityId(city)); //Remove by unique id
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-all duration-200"
                  title="Remove from favorites"
                >
                  <Trash2 className="h-4 w-4 text-red-200" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
