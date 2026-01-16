import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { HomePage } from "@/heroes/pages/home/HomePage";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";

vi.mock("@/heroes/hooks/usePaginatedHero");
const mockUsePaginatedHero = vi.mocked(usePaginatedHero);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderHomePage = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <FavoriteHeroProvider>
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      </FavoriteHeroProvider>
    </MemoryRouter>,
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUsePaginatedHero.mockReturnValue({
      data: { total: 0, pages: 0, heroes: [] },
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isFetching: false,
      isFetched: true,
      isPlaceholderData: false,
      isStale: false,
      refetch: vi.fn(),
      status: "success",
      fetchStatus: "idle",
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      errorUpdatedAt: 0,
      dataUpdatedAt: Date.now(),
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPaused: false,
      isRefetching: false,
    } as unknown as ReturnType<typeof mockUsePaginatedHero>);
  });

  //   test("should renderHomePage with default values", () => {
  //     const { container } = renderHomePage();
  //     expect(container).toMatchSnapshot();
  //     //screen.debug();
  //   });

  //   test("should call usePaginatedHero with default values", () => {
  //     renderHomePage();
  //     expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 6, "all");
  //   });

  //   test("should call usePaginatedHero with custom query params values", () => {
  //     renderHomePage(["/?page=1&limit=30&category=villians"]);
  //     expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 30, "villians");
  //   });

  test("should called usePaginatedHero with default page and same limit on tab click", () => {
    renderHomePage(["/?tab=favorites&page=2&limit=10"]);
    const [, , , villiansTab] = screen.getAllByRole("tab");

    fireEvent.click(villiansTab);
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 10, "villain");

    //screen.debug(villiansTab);
  });
});
