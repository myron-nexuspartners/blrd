import { describe, it, expect } from "vitest";

/**
 * Validates that the BLRD_ADMIN_API_KEY secret is present in the environment.
 * This key is used by the external content pipeline to authenticate article submissions.
 * The pipeline route itself validates tokens from the database (pipeline_tokens table),
 * so this test confirms the secret is configured and non-empty.
 */
describe("BLRD_ADMIN_API_KEY secret", () => {
  it("should be set as an environment variable", () => {
    const key = process.env.BLRD_ADMIN_API_KEY;
    // The key must be present and non-empty
    expect(key).toBeDefined();
    expect(typeof key).toBe("string");
    expect((key as string).length).toBeGreaterThan(0);
  });

  it("should meet minimum length requirement for a secure API key", () => {
    const key = process.env.BLRD_ADMIN_API_KEY ?? "";
    // Enforce at least 8 characters to ensure it's not a placeholder
    expect(key.length).toBeGreaterThanOrEqual(8);
  });
});
