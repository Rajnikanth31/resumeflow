import { withRetry } from "../retry";

describe("withRetry", () => {
  it("should return resolved value immediately on success", async () => {
    const fn = jest.fn().mockResolvedValue("success");
    const result = await withRetry(fn);
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should retry up to max limit on failure", async () => {
    const fn = jest.fn().mockRejectedValue(new Error("failure"));
    await expect(withRetry(fn, { maxRetries: 2, initialDelay: 10 })).rejects.toThrow("failure");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("should resolve if subsequent attempt passes", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("err1"))
      .mockResolvedValueOnce("pass");

    const result = await withRetry(fn, { maxRetries: 2, initialDelay: 10 });
    expect(result).toBe("pass");
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
