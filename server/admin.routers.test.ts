import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function makeAdminCtx(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@blrd.tv",
    name: "BLRD Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function makeUserCtx(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@blrd.tv",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function makeAnonCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("admin router — access control", () => {
  it("rejects unauthenticated users from admin.stats", async () => {
    const caller = appRouter.createCaller(makeAnonCtx());
    await expect(caller.admin.stats()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects regular users from admin.stats with FORBIDDEN", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.admin.stats()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects regular users from admin.blog.list", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.admin.blog.list({ status: "all", page: 1, pageSize: 10 })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects regular users from admin.reviews.create", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.admin.reviews.create({
        title: "Test Review",
        body: "Test body",
        category: "games",
        isFeatured: false,
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects regular users from admin.events.create", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.admin.events.create({
        name: "Test Event",
        eventType: "convention",
        category: "gaming",
        isVirtual: false,
        isActive: true,
        startDate: new Date().toISOString(),
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects regular users from admin.contacts.list", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.admin.contacts.list({ status: "all", page: 1, pageSize: 10 })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("admin router — input validation", () => {
  it("validates review category enum", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    await expect(
      caller.admin.reviews.create({
        title: "Test",
        body: "Test body content",
        category: "invalid" as any,
        isFeatured: false,
      })
    ).rejects.toThrow();
  });

  it("validates event type enum", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    await expect(
      caller.admin.events.create({
        name: "Test Event",
        eventType: "invalid-type" as any,
        category: "gaming",
        isVirtual: false,
        isActive: true,
        startDate: new Date().toISOString(),
      })
    ).rejects.toThrow();
  });

  it("validates blog list status enum", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    await expect(
      caller.admin.blog.list({ status: "invalid" as any, page: 1, pageSize: 10 })
    ).rejects.toThrow();
  });

  it("validates contact status update enum", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    await expect(
      caller.admin.contacts.updateStatus({ id: 1, status: "invalid" as any })
    ).rejects.toThrow();
  });

  it("validates review title min length", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    await expect(
      caller.admin.reviews.create({
        title: "X",
        body: "Test body content",
        category: "games",
        isFeatured: false,
      })
    ).rejects.toThrow();
  });

  it("validates event name min length", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    await expect(
      caller.admin.events.create({
        name: "X",
        eventType: "convention",
        category: "gaming",
        isVirtual: false,
        isActive: true,
        startDate: new Date().toISOString(),
      })
    ).rejects.toThrow();
  });
});

describe("admin router — blog approval workflow", () => {
  it("approve procedure requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.admin.blog.approve({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("reject procedure requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.admin.blog.reject({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("delete procedure requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.admin.blog.delete({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("feature procedure requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.admin.blog.feature({ id: 1, featured: true })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("admin router — review management", () => {
  it("update procedure requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.admin.reviews.update({ id: 1, title: "Updated" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("delete procedure requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.admin.reviews.delete({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("feature procedure requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.admin.reviews.feature({ id: 1, featured: true })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("admin router — event management", () => {
  it("update procedure requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.admin.events.update({ id: 1, name: "Updated Event" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("delete procedure requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.admin.events.delete({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("toggleActive procedure requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.admin.events.toggleActive({ id: 1, isActive: false })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
