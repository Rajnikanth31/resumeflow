/**
 * @jest-environment node
 */
import { POST as createHandler, GET as listHandler } from "../route";
import { GET as getHandler, PUT as putHandler, DELETE as deleteHandler } from "../[id]/route";
import { db } from "lib/db";
import { getServerSession } from "next-auth/next";

jest.mock("lib/db");
jest.mock("next-auth/next");

describe("Resume CRUD Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/resumes", () => {
    it("should return 401 if unauthorized", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/resumes", { method: "POST" });
      const res = await createHandler(req);
      expect(res.status).toBe(401);
    });

    it("should create resume on success", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-uuid", email: "user@domain.com", name: "John" },
      });
      (db.resume.create as jest.Mock).mockResolvedValue({
        id: "resume-uuid",
        userId: "user-uuid",
        title: "My Resume",
      });

      const req = new Request("http://localhost/api/resumes", {
        method: "POST",
        body: JSON.stringify({ title: "My Resume" }),
      });

      const res = await createHandler(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.resume.id).toBe("resume-uuid");
      expect(db.resume.create).toHaveBeenCalled();
    });
  });

  describe("GET /api/resumes/[id]", () => {
    it("should fetch resume details on success", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-uuid" },
      });
      (db.resume.findFirst as jest.Mock).mockResolvedValue({
        id: "resume-uuid",
        userId: "user-uuid",
        title: "Test Resume",
      });

      const res = await getHandler(
        new Request("http://localhost/api/resumes/resume-uuid"),
        { params: { id: "resume-uuid" } }
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.resume.title).toBe("Test Resume");
    });
  });
});
