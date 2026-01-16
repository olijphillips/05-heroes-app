import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { SearchControls } from "./SearchControls";
import { MemoryRouter } from "react-router";

vi.mock("@/ui/SearchControls", () => ({
  SearchControls: () => <div data-testid="search-controls">SC</div>,
}));

if (typeof window.ResizeObserver === "undefined") {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
}

const renderWithRouter = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SearchControls />
    </MemoryRouter>
  );
};

describe("SearchControls", () => {
  //   test("should render Search Controls with defaults values", () => {
  //     const { container } = renderWithRouter();

  // expect(container).toMatchSnapshot();
  //   });

  test("should set input value when search param name is set ", () => {
    renderWithRouter(["/?name=Batman"]);

    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams..."
    );

    expect(input.getAttribute("value")).toBe("Batman");
    //  screen.debug(input);
  });

  test("should change params when input is changed and enter is pressed", () => {
    renderWithRouter(["/?name=Batman"]);

    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams..."
    );

    expect(input.getAttribute("value")).toBe("Batman");

    fireEvent.change(input, { target: { value: "Superman" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(input.getAttribute("value")).toBe("Superman");

    // screen.debug(input);
  });

  test("should change params strength when slider is changed", async () => {
    renderWithRouter(["/?name=Batman&active-accordion=advanced-filters"]);

    // Esperar a que el slider aparezca
    const slider = await screen.getByRole("slider");

    // screen.debug(slider);
    expect(slider.getAttribute("aria-valuenow")).toBe("0");

    // Cambiar el valor del slider
    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(slider.getAttribute("aria-valuenow")).toBe("1");
  });

  test("should accordionbe open when active-accordion param is set", () => {
    renderWithRouter(["/?name=Batman&active-accordion=advanced-filters"]);

    const accordion = screen.getByTestId("accordion");
    const accordionItem = accordion.querySelector("div");
    expect(accordionItem?.getAttribute("data-state")).toBe("open");
  });
});
