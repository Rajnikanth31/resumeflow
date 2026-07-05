/**
 * @jest-environment node
 */
import { middlewareOptions, config } from "../middleware";

describe("Middleware Configuration", () => {
  it("should secure correct routes", () => {
    expect(config.matcher).toContain("/resume-builder/:path*");
    expect(config.matcher).toContain("/dashboard/:path*");
  });

  it("should authorize user if token is present", () => {
    const authorized = middlewareOptions.callbacks?.authorized;
    expect(authorized).toBeDefined();

    const result = authorized({ token: { id: "user-uuid" } });
    expect(result).toBe(true);
  });

  it("should deny access if token is missing", () => {
    const authorized = middlewareOptions.callbacks?.authorized;
    const result = authorized({ token: null });
    expect(result).toBe(false);
  });
});
