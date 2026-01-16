import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import {
  FavoriteHeroContext,
  FavoriteHeroProvider,
} from "./FavoriteHeroContext";
import { use } from "react";
import type { Hero } from "../types/heroes.interface";

const mockHero = {
  id: "1",
  name: "batman",
  image: "heroes/batman.jpg",
} as Hero;

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", { value: localStorageMock });

//este la consume (data)
//CONSUME y MUESTRA DATOS
const TestComponent = () => {
  const { favoriteCount, favorites, isFavorite, toggleFavorite } =
    use(FavoriteHeroContext);

  return (
    <div>
      <div data-testid="favorite-count">{favoriteCount}</div>

      <div data-testid="favorite-list">
        {favorites.map((hero) => (
          <div key={hero.id} data-testid={`hero-${hero.id}`}>
            {hero.name}
          </div>
        ))}
      </div>

      <button
        data-testid="toggle-favorite"
        onClick={() => toggleFavorite(mockHero)}
      >
        Toggle Favorite
      </button>
      <div data-testid="is-favorite">{isFavorite(mockHero).toString()}</div>
    </div>
  );
};

//este prepara la data, Crea el contexto, mete al consumidor, renderiza
//MONTA y prepara
const renderContextTest = () => {
  return render(
    <FavoriteHeroProvider>
      <TestComponent />
    </FavoriteHeroProvider>,
  );
};

describe("FavoriteHeroContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should initialize with default values", async () => {
    renderContextTest(); //ejecuta todo lo anterior

    screen.debug(); //VERIFICA QUE SE RENDERIZO

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("favorite-list").children.length).toBe(0);
  });

  test("should add hero to favorite when toggleFavorite is called with a new hero", () => {
    renderContextTest();

    const button = screen.getByTestId("toggle-favorite");
    // screen.debug(); //Antes de clickear

    fireEvent.click(button);

    // screen.debug(); //Despues de clickear

    // console.log(localStorage.getItem("favorites"));

    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("batman");

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "favorites",
      '[{"id":"1","name":"batman","image":"http://localhost:3001/images/batman.jpg"}]',
    );
  });

  test("should remove hero from favorites when toggleFavorite is called", () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockHero]));

    renderContextTest(); //antes de!!!!
    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("batman");

    const button = screen.getByTestId("toggle-favorite");

    fireEvent.click(button);

    screen.debug(); //Despues de clickear

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("is-favorite").textContent).toBe("false");
    expect(screen.queryByTestId("hero-1")).toBeNull();
    expect(localStorageMock.setItem).toHaveBeenCalledWith("favorites", "[]");
  });
});
