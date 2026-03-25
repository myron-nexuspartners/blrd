import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock DB ─────────────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        onDuplicateKeyUpdate: vi.fn().mockResolvedValue(undefined),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
  }),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// ─── Context Factories ────────────────────────────────────────────────────────
type AuthUser = NonNullable<TrpcContext["user"]>;

function makeUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 1,
    openId: "test-user-001",
    email: "test@blrd.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
}

function makeCtx(user: AuthUser | null = null): TrpcContext {
  const clearedCookies: unknown[] = [];
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: (_name: string, _opts: unknown) => clearedCookies.push({ _name, _opts }),
    } as TrpcContext["res"],
  };
}

// ─── Auth Tests ───────────────────────────────────────────────────────────────
describe("auth.logout", () => {
  it("clears the session cookie and returns success", async () => {
    const ctx = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
  });

  it("auth.me returns null when not authenticated", async () => {
    const ctx = makeCtx(null);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("auth.me returns user when authenticated", async () => {
    const user = makeUser();
    const ctx = makeCtx(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result?.id).toBe(1);
    expect(result?.email).toBe("test@blrd.com");
  });
});

// ─── Reviews Tests ────────────────────────────────────────────────────────────
describe("reviews.rate", () => {
  it("allows authenticated user to rate content", async () => {
    const ctx = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);
    const result = await caller.reviews.rate({ contentId: 1, rating: 4 });
    expect(result).toEqual({ success: true });
  });

  it("rejects unauthenticated rating attempts", async () => {
    const ctx = makeCtx(null);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.reviews.rate({ contentId: 1, rating: 4 })).rejects.toThrow();
  });

  it("rejects rating below 1", async () => {
    const ctx = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);
    await expect(caller.reviews.rate({ contentId: 1, rating: 0 })).rejects.toThrow();
  });

  it("rejects rating above 5", async () => {
    const ctx = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);
    await expect(caller.reviews.rate({ contentId: 1, rating: 6 })).rejects.toThrow();
  });
});

// ─── Blog Tests ───────────────────────────────────────────────────────────────
describe("blog.submit", () => {
  it("allows authenticated user to submit a blog post", async () => {
    const ctx = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);
    const result = await caller.blog.submit({
      title: "My Thoughts on Indie Gaming in 2025",
      body: "This is a detailed blog post about indie gaming trends that exceeds the minimum character count requirement for submission.",
      category: "gaming",
    });
    expect(result).toEqual({ success: true });
  });

  it("rejects unauthenticated blog submissions", async () => {
    const ctx = makeCtx(null);
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.blog.submit({
        title: "My Post",
        body: "This is a detailed blog post about indie gaming trends that exceeds the minimum character count.",
        category: "gaming",
      })
    ).rejects.toThrow();
  });

  it("rejects post with title too short", async () => {
    const ctx = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.blog.submit({ title: "Hi", body: "This is a detailed body that exceeds the minimum character count.", category: "gaming" })
    ).rejects.toThrow();
  });

  it("rejects post with body too short", async () => {
    const ctx = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.blog.submit({ title: "A Valid Title Here", body: "Too short", category: "gaming" })
    ).rejects.toThrow();
  });
});

// ─── Contact Tests ────────────────────────────────────────────────────────────
describe("contact.submit", () => {
  it("accepts a valid contact form submission", async () => {
    const ctx = makeCtx(null);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.contact.submit({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I am interested in advertising with BLRD.",
      inquiryType: "advertising",
    });
    expect(result).toEqual({ success: true });
  });

  it("accepts partnership inquiries", async () => {
    const ctx = makeCtx(null);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.contact.submit({
      name: "Brand Partner",
      email: "partner@brand.com",
      subject: "Q3 Partnership Proposal",
      message: "We would like to discuss a partnership opportunity with BLRD.",
      inquiryType: "partnership",
    });
    expect(result).toEqual({ success: true });
  });

  it("rejects invalid email address", async () => {
    const ctx = makeCtx(null);
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.contact.submit({
        name: "Jane",
        email: "not-an-email",
        message: "Hello there.",
        inquiryType: "general",
      })
    ).rejects.toThrow();
  });

  it("rejects message that is too short", async () => {
    const ctx = makeCtx(null);
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.contact.submit({
        name: "Jane",
        email: "jane@example.com",
        message: "Hi",
        inquiryType: "general",
      })
    ).rejects.toThrow();
  });
});

// ─── Events Tests ─────────────────────────────────────────────────────────────
describe("events.trackClick", () => {
  it("tracks a click on an event registration link", async () => {
    const ctx = makeCtx(null);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.events.trackClick({ eventId: 1 });
    expect(result).toEqual({ success: true });
  });
});
