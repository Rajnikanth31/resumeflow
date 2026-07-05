/**
 * @jest-environment node
 */
import { DELETE } from "../route";
import { db } from "lib/db";
import { getServerSession } from "next-auth/next";

jest.mock("lib/db");
jest.mock("next-auth/next");

describe("DELETE /api/user/delete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if unauthorized", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const res = await DELETE();
    expect(res.status).toBe(401);
  });

  it("should update user deletedAt on success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-uuid" },
    });

    const res = await DELETE();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(db.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-uuid" },
        data: expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      })
    );
  });
});
