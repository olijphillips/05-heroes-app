import { beforeEach, describe, expect, test, vi } from "vitest";
import SearchPage from "../SearchPage";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { searchHeroAction } from "@/heroes/actions/search-hero.action";
import type { Hero } from "@/heroes/types/heroes.interface";

//estos 2 amiguitos siempre van juntos
//1 hace el mock y el otro crea el objeto que intercepta ese llamado
vi.mock("@/heroes/actions/search-hero.action");
const mockSearchHeroesAction = vi.mocked(searchHeroAction);

vi.mock("@/components/custom/CustomJumbotron", () => ({
  CustomJumbotron: () => <div data-testid="custom-jumbotron">Holis!</div>,
}));

vi.mock("@/heroes/components/HeroGrid", () => ({
  HeroGrid: ({ heroes }: { heroes: Hero[] }) => (
    <div data-testid="hero-grid">
      {heroes.map((hero) => (
        <div key={hero.id}>{hero.name}</div>
      ))}
    </div>
  ),
}));

const renderSearchPage = (initialEntries: string[] = ["/"]) => {
  // Crear un nuevo QueryClient para cada test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,

        staleTime: 0,
      },
    },
  });

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <SearchPage />
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock por defecto para evitar errores
    mockSearchHeroesAction.mockResolvedValue([]);
  });

  // test("should render SearchPage with default value", () => {
  //   const { container } = renderSearchPage();

  //   expect(mockSearchHeroesAction).toHaveBeenCalledWith({
  //     name: undefined,
  //     strength: undefined,
  //   });

  //   expect(container).toMatchSnapshot();
  // });

  // test("should call search action with name parameter", () => {
  //   const { container } = renderSearchPage(["/search?name=superman"]);

  //   expect(mockSearchHeroesAction).toHaveBeenCalledWith({
  //     name: "superman",
  //     strength: undefined,
  //   });

  //   expect(container).toMatchSnapshot();
  // });

  // test("should call search action with strength parameter", () => {
  //   const { container } = renderSearchPage(["/search?strength=6"]);

  //   expect(mockSearchHeroesAction).toHaveBeenCalledWith({
  //     name: undefined,
  //     strength: "6",
  //   });

  //   expect(container).toMatchSnapshot();
  // });

  // test("should call search action with strength and name parameter", () => {
  //   const { container } = renderSearchPage(["/search?strength=8&name=batman"]);

  //   expect(mockSearchHeroesAction).toHaveBeenCalledWith({
  //     name: "batman",
  //     strength: "8",
  //   });

  //   expect(container).toMatchSnapshot();
  // });

  test("should render HeroGrid with search results", async () => {
    const mockHeroes = [
      { id: "1", name: "Clark Kent" } as unknown as Hero,
      { id: "2", name: "Bruce Wayne" } as unknown as Hero,
    ];

    mockSearchHeroesAction.mockResolvedValue(mockHeroes);
    renderSearchPage();

    //screen.debug();

    await waitFor(() => {
      expect(screen.getByText("Clark Kent")).toBeDefined();
      expect(screen.getByText("Bruce Wayne")).toBeDefined();
    });

    // Verificación adicional del hero-grid
    const heroGrid = screen.getByTestId("hero-grid");
    expect(heroGrid).toBeDefined();

    // screen.debug(heroGrid); // Solo descomenta si necesitas debuggear
  });
});
