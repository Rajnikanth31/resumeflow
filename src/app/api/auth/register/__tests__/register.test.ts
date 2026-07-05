/**
 * @jest-environment node
 */
import { POST } from "../route";
import { db } from "lib/db";

jest.mock("lib/db");

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if email is invalid", async () => {
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "invalid-email",
        password: "securepassword123",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid email format");
  });

  it("should return 400 if password is too short", async () => {
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@domain.com",
        password: "short",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Password must be at least 8 characters long");
  });

  it("should return 400 if email already exists", async () => {
    const mockFindUnique = db.user.findUnique as jest.Mock;
    mockFindUnique.mockResolvedValue({ id: "123", email: "existing@domain.com" });

    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "existing@domain.com",
        password: "securepassword123",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Email already registered");
  });

  it("should create user and return 201 on success", async () => {
    const mockFindUnique = db.user.findUnique as jest.Mock;
    mockFindUnique.mockResolvedValue(null);

    const mockCreate = db.user.create as jest.Mock;
    mockCreate.mockResolvedValue({
      id: "user-uuid",
      email: "newuser@domain.com",
      name: "John Doe",
    });

    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "newuser@domain.com",
        password: "securepassword123",
        name: "John Doe",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.user.email).toBe("newuser@domain.com");
    expect(data.user.name).toBe("John Doe");
    expect(mockCreate).toHaveBeenCalled();
  });
});
