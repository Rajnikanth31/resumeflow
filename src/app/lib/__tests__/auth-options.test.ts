import { authOptions } from "../auth-options";
import { db } from "lib/db";
import bcrypt from "bcryptjs";

jest.mock("lib/db");
jest.mock("bcryptjs");

describe("NextAuth Credentials authorize callback", () => {
  const credentialsProvider = authOptions.providers.find(
    (p) => p.id === "credentials"
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error if email or password is missing", async () => {
    await expect(
      (credentialsProvider as any).options.authorize({ email: "", password: "" })
    ).rejects.toThrow("Missing email or password");
  });

  it("should throw error if user is not found in database", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      (credentialsProvider as any).options.authorize({
        email: "notfound@domain.com",
        password: "password123",
      })
    ).rejects.toThrow("No user found with this email");
  });

  it("should throw error if password verification fails", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-id",
      email: "user@domain.com",
      passwordHash: "somehashedvalue",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      (credentialsProvider as any).options.authorize({
        email: "user@domain.com",
        password: "wrongpassword",
      })
    ).rejects.toThrow("Incorrect password");
  });

  it("should return user object on successful authentication", async () => {
    const mockUser = {
      id: "user-uuid",
      email: "user@domain.com",
      name: "User Name",
      role: "USER",
      passwordHash: "correcthash",
    };
    (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const user = await (credentialsProvider as any).options.authorize({
      email: "user@domain.com",
      password: "correctpassword",
    });

    expect(user).toEqual({
      id: "user-uuid",
      email: "user@domain.com",
      name: "User Name",
      role: "USER",
    });
  });
});
