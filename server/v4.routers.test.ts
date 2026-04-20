import { describe, expect, it, vi } from "vitest";

// ─── Mocks must use factory functions (no top-level vars referenced) ──────────
vi.mock("./db", () => {
  // orderByResult supports both .limit() chaining AND direct await (thenable)
  const orderByResult = {
    limit: vi.fn().mockResolvedValue([]),
    then: (resolve: (v: unknown[]) => unknown, _reject?: unknown) => Promise.resolve([]).then(resolve),
  };
  const chainable = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    orderBy: vi.fn().mockReturnValue(orderByResult),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    onDuplicateKeyUpdate: vi.fn().mockResolvedValue(undefined),
  };
  return { getDb: vi.fn().mockResolvedValue(chainable) };
});

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Context helpers ──────────────────────────────────────────────────────────
function makeAdminCtx(): TrpcContext {
  return {
    user: {
      id: 1, openId: "admin-user", email: "admin@blrd.tv", name: "Admin",
      loginMethod: "manus", role: "admin",
      createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makePublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeUserCtx(): TrpcContext {
  return {
    user: {
      id: 2, openId: "regular-user", email: "user@blrd.tv", name: "User",
      loginMethod: "manus", role: "user",
      createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Authors Router Tests ─────────────────────────────────────────────────────
describe("authors router", () => {
  it("list returns array (public)", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.authors.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("bySlug returns null for unknown slug (public)", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.authors.bySlug({ slug: "unknown-author" });
    expect(result).toBeNull();
  });

  it("articles returns array for known slug (public)", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.authors.articles({ slug: "kai-reeves", limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("create requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.authors.create({ slug: "test-author", name: "Test Author", vertical: "gaming" })
    ).rejects.toThrow();
  });

  it("create succeeds for admin", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.authors.create({
      slug: "test-author", name: "Test Author", vertical: "gaming",
      title: "Gaming Writer", bio: "A test author bio.", shortBio: "Short bio.",
    });
    expect(result).toEqual({ success: true });
  });

  it("update requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.authors.update({ id: 1, name: "New Name" })).rejects.toThrow();
  });

  it("update succeeds for admin", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.authors.update({ id: 1, name: "Updated Name" });
    expect(result).toEqual({ success: true });
  });

  it("delete requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.authors.delete({ id: 1 })).rejects.toThrow();
  });

  it("delete succeeds for admin", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.authors.delete({ id: 1 });
    expect(result).toEqual({ success: true });
  });
});

// ─── Pipeline Router Tests ────────────────────────────────────────────────────
describe("pipeline router", () => {
  it("generateToken requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.pipeline.generateToken({ label: "Test Token" })).rejects.toThrow();
  });

  it("generateToken succeeds for admin and returns token string", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.pipeline.generateToken({ label: "Test Pipeline Token" });
    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("label", "Test Pipeline Token");
    expect(typeof result.token).toBe("string");
    expect(result.token.length).toBeGreaterThan(10);
  });

  it("listTokens requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.pipeline.listTokens()).rejects.toThrow();
  });

  it("listTokens returns array for admin", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.pipeline.listTokens();
    expect(Array.isArray(result)).toBe(true);
  });

  it("revokeToken requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.pipeline.revokeToken({ id: 1 })).rejects.toThrow();
  });

  it("draftQueue requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.pipeline.draftQueue({ limit: 10 })).rejects.toThrow();
  });

  it("draftQueue returns array for admin", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.pipeline.draftQueue({ limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("submit rejects empty token", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.pipeline.submit({
        token: "",
        title: "Test Article",
        content: "Content here.",
        vertical: "gaming",
        author_slug: "kai-reeves",
        status: "draft",
      })
    ).rejects.toThrow();
  });

  it("submit rejects invalid token (no matching DB row → UNAUTHORIZED)", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.pipeline.submit({
        token: "invalid-token-xyz",
        title: "Test Article",
        content: "Content here.",
        vertical: "gaming",
        author_slug: "kai-reeves",
        status: "draft",
      })
    ).rejects.toThrow();
  });
});
