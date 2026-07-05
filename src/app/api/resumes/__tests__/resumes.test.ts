/**
 * @jest-environment node
 */
import { POST as createHandler, GET as listHandler } from "../route";
import { GET as getHandler, PUT as putHandler, DELETE as deleteHandler } from "../[id]/route";
import { POST as duplicateHandler } from "../[id]/duplicate/route";
import { POST as restoreHandler } from "../[id]/restore/route";
import { GET as getVersionsHandler, POST as createVersionHandler } from "../[id]/versions/route";
import { POST as restoreVersionHandler } from "../[id]/versions/[versionId]/restore/route";
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

  describe("GET /api/resumes search and filters", () => {
    it("should list resumes with pagination details", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-uuid" },
      });
      (db.resume.findMany as jest.Mock).mockResolvedValue([
        { id: "r1", title: "Developer Resume" },
      ]);
      (db.resume.count as jest.Mock).mockResolvedValue(1);

      const req = new Request("http://localhost/api/resumes?q=Developer&page=1&limit=5");
      const res = await listHandler(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.resumes.length).toBe(1);
      expect(data.pagination.totalCount).toBe(1);
      expect(data.pagination.totalPages).toBe(1);
      expect(db.resume.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            title: expect.objectContaining({ contains: "Developer" }),
          }),
          skip: 0,
          take: 5,
        })
      );
    });
  });

  describe("Duplicate and Restore API routes", () => {
    it("should duplicate resume on success", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-uuid" },
      });
      (db.resume.findFirst as jest.Mock).mockResolvedValue({
        id: "source-uuid",
        title: "Source Resume",
        workHistory: [],
        education: [],
        projects: [],
        skills: [],
        customs: [],
      });
      (db.resume.create as jest.Mock).mockResolvedValue({
        id: "copy-uuid",
        title: "Copy of Source Resume",
      });

      const res = await duplicateHandler(
        new Request("http://localhost/api/resumes/source-uuid/duplicate", { method: "POST" }),
        { params: { id: "source-uuid" } }
      );

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.resume.id).toBe("copy-uuid");
    });

    it("should restore soft-deleted resume on success", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-uuid" },
      });
      (db.resume.findFirst as jest.Mock).mockResolvedValue({
        id: "deleted-uuid",
      });

      const res = await restoreHandler(
        new Request("http://localhost/api/resumes/deleted-uuid/restore", { method: "POST" }),
        { params: { id: "deleted-uuid" } }
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(db.resume.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "deleted-uuid" },
          data: { deletedAt: null },
        })
      );
    });
  });

  describe("Resume Version History and Snapshots", () => {
    it("should list versions on success", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-uuid" },
      });
      (db.resume.findFirst as jest.Mock).mockResolvedValue({ id: "resume-uuid" });
      (db.resumeVersion.findMany as jest.Mock).mockResolvedValue([
        { id: "v1", versionName: "V1 Snapshot" },
      ]);

      const res = await getVersionsHandler(
        new Request("http://localhost/api/resumes/resume-uuid/versions"),
        { params: { id: "resume-uuid" } }
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.versions.length).toBe(1);
    });

    it("should create version snapshot on success", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-uuid" },
      });
      (db.resume.findFirst as jest.Mock).mockResolvedValue({
        id: "resume-uuid",
        title: "Test",
        workHistory: [],
        education: [],
        projects: [],
        skills: [],
        customs: [],
      });
      (db.resumeVersion.count as jest.Mock).mockResolvedValue(0);
      (db.resumeVersion.create as jest.Mock).mockResolvedValue({
        id: "v-new",
        versionName: "New Snapshot",
      });

      const res = await createVersionHandler(
        new Request("http://localhost/api/resumes/resume-uuid/versions", {
          method: "POST",
          body: JSON.stringify({ versionName: "New Snapshot" }),
        }),
        { params: { id: "resume-uuid" } }
      );

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.version.id).toBe("v-new");
    });
  });
});
