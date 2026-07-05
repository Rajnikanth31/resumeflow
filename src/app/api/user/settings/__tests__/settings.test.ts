/**
 * @jest-environment node
 */
import { POST } from "../route";
import { db } from "lib/db";
import { getServerSession } from "next-auth/next";

jest.mock("lib/db");
jest.mock("next-auth/next");
jest.mock("bcryptjs");

describe("POST /api/user/settings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if unauthorized", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = new Request("http://localhost/api/user/settings", {
      method: "POST",
      body: JSON.stringify({ name: "Jane" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should update name on success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-id", email: "user@domain.com" },
    });
    (db.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-id",
      name: "John",
      email: "user@domain.com",
    });
    (db.user.update as jest.Mock).mockResolvedValue({
      id: "user-id",
      name: "Jane Doe",
      email: "user@domain.com",
    });

    const req = new Request("http://localhost/api/user/settings", {
      method: "POST",
      body: JSON.stringify({ name: "Jane Doe" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.name).toBe("Jane Doe");
  });

  it("should throw error if newPassword is provided without currentPassword", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-id" },
    });
    (db.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-id",
    });

    const req = new Request("http://localhost/api/user/settings", {
      method: "POST",
      body: JSON.stringify({ newPassword: "newpassword123" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Current password is required to set a new password");
  });
});
