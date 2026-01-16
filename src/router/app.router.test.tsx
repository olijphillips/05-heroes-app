import { describe, expect, test, vi } from "vitest";
import { appRouter } from "./app.router";
import { render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  Outlet,
  RouterProvider,
  useParams,
} from "react-router";

vi.mock("@/components/custom/CustomMenu", () => ({
  CustomMenu: () => <div data-testid="custom-menu">Menu</div>,
}));

vi.mock("@/heroes/layouts/HeroesLayout", () => ({
  HeroesLayout: () => (
    <div data-testid="heroes-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock("@/heroes/pages/home/HomePage", () => ({
  HomePage: () => <div data-testid="home-page"></div>,
}));

vi.mock("@/heroes/pages/hero/HeroPage", () => ({
  HeroPage: () => {
    const { idSlug = "" } = useParams();

    return <div data-testid="hero-page"> Hero-Page {idSlug} </div>;
  },
}));

vi.mock("@/heroes/pages/search/SearchPage", () => ({
  default: () => <div data-testid="search-page"> </div>,
}));

describe("appRouter", () => {
  //   test("should be configured as expected", () => {
  //     expect(appRouter.routes).toMatchSnapshot();
  //   });

  //   test("should render home page at root path", () => {
  //     const router = createMemoryRouter(appRouter.routes, {
  //       initialEntries: ["/admin"],
  //     });

  //     render(<RouterProvider router={router} />);
  //     // screen.debug();
  //     expect(screen.getByTestId("home-page")).toBeDefined();
  //   });

  //   test("should render hero page at /heroes/:idSlug path", () => {
  //     const router = createMemoryRouter(appRouter.routes, {
  //       initialEntries: ["/heroes/superman"],
  //     });

  //     render(<RouterProvider router={router} />);
  //     screen.debug();
  //     expect(screen.getByTestId("hero-page").innerHTML).toContain("superman");
  //   });

  //   test("should render search page at /searchpath", async () => {
  //     const router = createMemoryRouter(appRouter.routes, {
  //       initialEntries: ["/search"],
  //     });

  //     render(<RouterProvider router={router} />);

  //     //  expect(await screen.findByText("Búsqueda de SuperHéroes")).toBeDefined();
  //     expect(await screen.findByTestId("search-page")).toBeDefined();
  //   });

  test("should redirect to home page for unknown routes * ", async () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ["/otra-pagina-rara"],
    });

    render(<RouterProvider router={router} />);

    //  expect(await screen.findByText("Búsqueda de SuperHéroes")).toBeDefined();
    //expect(await screen.findByTestId("search-page")).toBeDefined();
    screen.debug();
    expect(await screen.findByTestId("home-page")).toBeDefined();
  });
});
