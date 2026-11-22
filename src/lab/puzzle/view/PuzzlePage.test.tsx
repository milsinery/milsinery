import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../../App";

// Meta tags live on document.head, outside Testing Library's container.

function viewportMeta(): HTMLMetaElement {
  // eslint-disable-next-line testing-library/no-node-access
  const existing = document.querySelector('meta[name="viewport"]');
  if (existing instanceof HTMLMetaElement) {
    return existing;
  }
  const created = document.createElement("meta");
  created.name = "viewport";
  created.content = "width=device-width, initial-scale=1";
  document.head.appendChild(created);
  return created;
}

describe("puzzle route", () => {
  test("is reachable and marked noindex, then clears that tag", () => {
    const viewport = viewportMeta();
    viewport.content = "width=device-width, initial-scale=1";

    const view = render(
      <MemoryRouter initialEntries={["/lab/puzzle"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Sandbox" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mute" })).toBeInTheDocument();
    expect(screen.queryByText("Not found")).not.toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-node-access
    const robots = document.querySelector('meta[name="robots"]');
    expect(robots).not.toBeNull();
    expect(robots!.getAttribute("content")).toBe("noindex");
    expect(viewport.getAttribute("content")).toContain("viewport-fit=cover");

    view.unmount();

    expect(
      // eslint-disable-next-line testing-library/no-node-access
      document.querySelector('meta[data-puzzle-robots="true"]')
    ).toBeNull();
    expect(viewport.getAttribute("content")).toBe(
      "width=device-width, initial-scale=1"
    );
  });

  test("is not linked from the home page", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.queryByRole("link", { name: /puzzle/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Sandbox" })).not.toBeInTheDocument();
    expect(
      // eslint-disable-next-line testing-library/no-node-access
      document.querySelector('meta[name="robots"]')
    ).toBeNull();
  });
});
