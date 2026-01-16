import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { usePaginatedHero } from "./usePaginatedHero";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

vi.mock("../actions/get-heroes-by-page.action", () => ({
  getHeroesByPageAction: vi.fn(),
}));

const mockGetHeroesByPageAction = vi.mocked(getHeroesByPageAction);

const tanStacksCustomProvider = () => {
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePaginatedHero", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    queryClient.getQueryCache();
  });

  // test("should return the initial state is loading", () => {
  //   const { result } = renderHook(() => usePaginatedHero(1, 6), {
  //     wrapper: tanStacksCustomProvider(),
  //   });

  //   //  console.log(result);

  //   expect(result.current.isLoading).toBeTruthy();
  //   expect(result.current.isError).toBe(false);
  //   expect(result.current.data).toBe(undefined);
  //   expect(result.current.data).toBeUndefined();
  // });

  // test("should return success state with data when API call succeeds", async () => {
  //   const mockHeroesData = {
  //     total: 20,
  //     pages: 4,
  //     heroes: [],
  //   };

  //   mockGetHeroesByPageAction.mockResolvedValue(mockHeroesData); // cuando te llamen finge devolver estos datos

  //   const { result } = renderHook(() => usePaginatedHero(1, 6), {
  //     wrapper: tanStacksCustomProvider(),
  //   });

  //   await waitFor(() => {
  //     expect(result.current.isSuccess).toBe(true);
  //   });

  //   expect(result.current.status).toBe("success");
  //   expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1, 6, "all");

  //   console.log(result);
  // });

  test("should call getHeroesByPageActions with arguments", async () => {
    const mockHeroesData = {
      total: 20,
      pages: 4,
      heroes: [],
    };

    mockGetHeroesByPageAction.mockResolvedValue(mockHeroesData); // cuando te llamen finge devolver estos datos

    const { result } = renderHook(() => usePaginatedHero(1, 6, "heroesABC"), {
      wrapper: tanStacksCustomProvider(),
    }); //aqui se manda a llamar

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.status).toBe("success");
    expect(mockGetHeroesByPageAction).toHaveBeenCalled();
    expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1, 6, "heroesABC");

    console.log(result);
  });
});
