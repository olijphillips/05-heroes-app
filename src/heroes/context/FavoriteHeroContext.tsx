import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { Hero } from "../types/heroes.interface";

interface FavoriteHeroContext {
  //State
  favorites: Hero[];
  favoriteCount: number;

  //Methods
  toggleFavorite: (hero: Hero) => void; //se inserta el Hero en el arreglo
  isFavorite: (hero: Hero) => boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const FavoriteHeroContext = createContext({} as FavoriteHeroContext);

const BASE_URL = import.meta.env.VITE_API_URL;

const getFavoritesFromLocalStorage = (): Hero[] => {
  const favorites = localStorage.getItem("favorites");
  if (!favorites) return [];

  const parsedFavorites = JSON.parse(favorites) as Hero[];

  // Asegurar que todas las imágenes tengan la URL completa con el BASE_URL actual
  return parsedFavorites.map((hero) => {
    // Extraer solo el nombre del archivo de la imagen
    const imageName = hero.image.split("/").pop() || hero.image;

    return {
      ...hero,
      image: `${BASE_URL}/images/${imageName}`,
    };
  });
};

export const FavoriteHeroProvider = ({ children }: PropsWithChildren) => {
  const [favorites, setFavorites] = useState<Hero[]>(
    getFavoritesFromLocalStorage(),
  ); //get me sirve para inicializar

  const toggleFavorite = (hero: Hero) => {
    const heroExist = favorites.find((h) => h.id === hero.id);

    if (heroExist) {
      const newFavorites = favorites.filter((h) => h.id !== hero.id); //aqui elimino al heroe
      setFavorites(newFavorites);
      return;
    }
    setFavorites([...favorites, hero]); //Aqui lo agrego
  };

  useEffect(() => {
    // Normalizar las imágenes antes de guardar - extraer solo el nombre del archivo
    const normalizedFavorites = favorites.map((hero) => {
      const imageName = hero.image.split("/").pop() || hero.image;

      return {
        ...hero,
        image: `${BASE_URL}/images/${imageName}`,
      };
    });
    localStorage.setItem("favorites", JSON.stringify(normalizedFavorites));
  }, [favorites]);

  return (
    <FavoriteHeroContext
      value={{
        //State
        favorites: favorites, //aqui devuelvo los favoritos
        favoriteCount: favorites.length,
        //Methods
        isFavorite: (hero: Hero) => favorites.some((h) => h.id === hero.id), //esto devuelve true or false
        toggleFavorite: toggleFavorite, // esta viene de arriba
      }}
    >
      {children}
    </FavoriteHeroContext>
  );
};
