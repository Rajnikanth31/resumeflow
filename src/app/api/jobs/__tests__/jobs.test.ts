/**
 * @jest-environment node
 */
import { POST as createJob, GET as listJobs } from "../route";
import { GET as getJob, PUT as updateJob, DELETE as deleteJob } from "../[id]/route";
import { getServerSession } from "next-auth/next";
import { db } from "lib/db";

jest.mock("next-auth/next");
jest.mock("lib/db");

describe("Job CRUD APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a job description manually", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-1" },
    });
    (db.jobDescription.create as jest.Mock).mockResolvedValue({
      id: "job-1",
      title: "Software Engineer",
      company: "Google",
    });

    const req = new Request("http://localhost/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        title: "Software Engineer",
        company: "Google",
        description: "Coding GraphQL APIs",
      }),
    });

    const res = await createJob(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe("job-1");
  });

  it("should list all jobs for the user", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-1" },
    });
    (db.jobDescription.findMany as jest.Mock).mockResolvedValue([
      { id: "job-1", title: "Software Engineer" },
    ]);

    const res = await listJobs();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(1);
  });

  it("should update a job description", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-1" },
    });
    (db.jobDescription.findFirst as jest.Mock).mockResolvedValue({
      id: "job-1",
    });
    (db.jobDescription.update as jest.Mock).mockResolvedValue({
      id: "job-1",
      title: "Senior Software Engineer",
    });

    const req = new Request("http://localhost/api/jobs/job-1", {
      method: "PUT",
      body: JSON.stringify({
        title: "Senior Software Engineer",
      }),
    });

    const res = await updateJob(req, { params: { id: "job-1" } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe("Senior Software Engineer");
  });
});
