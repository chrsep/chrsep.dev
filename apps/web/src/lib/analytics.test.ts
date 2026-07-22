import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const posthogMock = vi.hoisted(() => ({
  init: vi.fn(),
  register: vi.fn(),
  capture: vi.fn(),
  captureException: vi.fn(),
}))

vi.mock("posthog-js", () => ({ default: posthogMock }))
vi.mock("$app/environment", () => ({ browser: true, dev: false }))

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  vi.stubEnv("MODE", "production")
  vi.stubEnv("PUBLIC_POSTHOG_KEY", "phc_test")
  vi.stubEnv("PUBLIC_POSTHOG_HOST", "https://eu.i.posthog.com")
  vi.stubEnv("PUBLIC_POSTHOG_ENVIRONMENT", "production")
  vi.stubEnv("PUBLIC_POSTHOG_DISABLED", "false")
  vi.stubGlobal("window", {
    location: {
      href: "https://chrsep.dev/id/cv?session=private#experience",
      origin: "https://chrsep.dev",
      pathname: "/id/cv",
    },
    requestIdleCallback: vi.fn((callback: IdleRequestCallback) => {
      callback({ didTimeout: false, timeRemaining: () => 50 })
      return 1
    }),
  })
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe("PostHog initialization", () => {
  it("initializes once with explicit analytics and privacy defaults", async () => {
    const { initPostHog } = await import("./posthog")

    expect(initPostHog()).toBe(true)
    expect(initPostHog()).toBe(true)
    await vi.waitFor(() => {
      expect(posthogMock.init).toHaveBeenCalledTimes(1)
    })
    expect(posthogMock.init).toHaveBeenCalledTimes(1)
    expect(posthogMock.init).toHaveBeenCalledWith(
      "phc_test",
      expect.objectContaining({
        api_host: "https://eu.i.posthog.com",
        defaults: "2026-06-25",
        capture_pageview: false,
        capture_pageleave: true,
        capture_heatmaps: true,
        capture_dead_clicks: true,
        advanced_disable_flags: false,
        advanced_disable_feature_flags: true,
        advanced_disable_feature_flags_on_first_load: true,
        person_profiles: "never",
        respect_dnt: true,
        disable_capture_url_hashes: true,
        mask_personal_data_properties: true,
        session_recording: expect.objectContaining({
          maskAllInputs: true,
          maskTextSelector: expect.stringContaining("[data-analytics-mask]"),
          recordBody: false,
          recordHeaders: false,
          maskCapturedNetworkRequestFn: expect.any(Function),
        }),
      }),
    )
  })

  it("does not initialize in test mode", async () => {
    vi.stubEnv("MODE", "test")
    const { initPostHog } = await import("./posthog")

    expect(initPostHog()).toBe(false)
    expect(posthogMock.init).not.toHaveBeenCalled()
  })

  it("suppresses remote configuration on an unknown entry route", async () => {
    vi.stubGlobal("window", {
      location: {
        href: "https://chrsep.dev/private/customer-slug?token=private",
        origin: "https://chrsep.dev",
        pathname: "/private/customer-slug",
      },
      requestIdleCallback: vi.fn((callback: IdleRequestCallback) => {
        callback({ didTimeout: false, timeRemaining: () => 50 })
        return 1
      }),
    })
    const { initPostHog } = await import("./posthog")

    expect(initPostHog()).toBe(true)
    await vi.waitFor(() => {
      expect(posthogMock.init).toHaveBeenCalledTimes(1)
    })
    expect(posthogMock.init).toHaveBeenCalledWith(
      "phc_test",
      expect.objectContaining({
        advanced_disable_flags: true,
        advanced_disable_feature_flags: true,
        advanced_disable_feature_flags_on_first_load: true,
      }),
    )
  })

  it("queues events and handled errors until the idle SDK load", async () => {
    let runIdle: IdleRequestCallback | undefined
    vi.stubGlobal("window", {
      location: {
        href: "https://chrsep.dev/id/cv",
        origin: "https://chrsep.dev",
        pathname: "/id/cv",
      },
      requestIdleCallback: vi.fn((callback: IdleRequestCallback) => {
        runIdle = callback
        return 1
      }),
    })
    const { capture, captureException } = await import("./analytics")

    capture("language changed", {
      from_locale: "en",
      to_locale: "id",
    })
    captureException(new Error("queued application error"), {
      source: "test",
    })

    expect(posthogMock.init).not.toHaveBeenCalled()
    expect(posthogMock.capture).not.toHaveBeenCalled()
    expect(posthogMock.captureException).not.toHaveBeenCalled()

    runIdle?.({ didTimeout: false, timeRemaining: () => 50 })
    await vi.waitFor(() => {
      expect(posthogMock.capture).toHaveBeenCalledTimes(1)
      expect(posthogMock.captureException).toHaveBeenCalledTimes(1)
    })
  })
})

describe("safe analytics helpers", () => {
  it("adds shared context to typed events", async () => {
    const { capture } = await import("./analytics")

    capture("contact cta clicked", {
      location: "home_hero",
      destination: "email",
    })

    await vi.waitFor(() => {
      expect(posthogMock.capture).toHaveBeenCalledTimes(1)
    })
    expect(posthogMock.capture).toHaveBeenCalledWith(
      "contact cta clicked",
      expect.objectContaining({
        environment: "test",
        release: expect.any(String),
        app_surface: "website",
        locale: "id",
        route: "cv",
        location: "home_hero",
      }),
    )
  })

  it("infers locale and route from the current pathname by default", async () => {
    const { getSharedAnalyticsContext } = await import("./posthog")

    expect(getSharedAnalyticsContext()).toEqual(
      expect.objectContaining({ locale: "id", route: "cv" }),
    )
  })

  it("prefers registered locale and route over inferred fallbacks", async () => {
    const { getSharedAnalyticsContext, registerAnalyticsContext } =
      await import("./posthog")

    registerAnalyticsContext({ locale: "en", route: "home" })

    expect(getSharedAnalyticsContext()).toEqual(
      expect.objectContaining({ locale: "en", route: "home" }),
    )
  })

  it("redacts pageview query parameters and hashes", async () => {
    const { capturePageview } = await import("./analytics")

    capturePageview("https://chrsep.dev/id/cv?token=private#experience", {
      route_id: "cv",
      locale: "id",
    })

    await vi.waitFor(() => {
      expect(posthogMock.capture).toHaveBeenCalledTimes(1)
    })
    expect(posthogMock.capture).toHaveBeenCalledWith(
      "$pageview",
      expect.objectContaining({
        $current_url: "https://chrsep.dev/id/cv",
        route_id: "cv",
        locale: "id",
      }),
    )
  })

  it("never throws when capture or exception reporting fails", async () => {
    const { capture, captureException } = await import("./analytics")
    posthogMock.capture.mockImplementationOnce(() => {
      throw new Error("capture failed")
    })
    posthogMock.captureException.mockImplementationOnce(() => {
      throw new Error("exception capture failed")
    })

    expect(() =>
      capture("language changed", {
        from_locale: "en",
        to_locale: "id",
      }),
    ).not.toThrow()
    expect(() =>
      captureException(new Error("application error"), {
        source: "test",
      }),
    ).not.toThrow()

    await vi.waitFor(() => {
      expect(posthogMock.capture).toHaveBeenCalledTimes(1)
      expect(posthogMock.captureException).toHaveBeenCalledTimes(1)
    })
  })
})

describe("event redaction", () => {
  it("removes query parameters from nested URL properties", async () => {
    const { redactAnalyticsEvent } = await import("./posthog")

    expect(
      redactAnalyticsEvent({
        uuid: "018f0000-0000-7000-8000-000000000000",
        event: "$exception",
        properties: {
          $current_url: "https://chrsep.dev/resource?session=private#message",
          nested: {
            filename: "https://chrsep.dev/_app/chunk.js?cache=private",
          },
          safe_value: "keep me",
        },
      }),
    ).toEqual({
      uuid: "018f0000-0000-7000-8000-000000000000",
      event: "$exception",
      properties: {
        $current_url: "https://chrsep.dev/:unknown",
        nested: {
          filename: "https://chrsep.dev/_app/chunk.js",
        },
        safe_value: "keep me",
      },
    })
  })

  it("redacts URLs embedded in exception messages and autocapture chains", async () => {
    const { redactAnalyticsEvent } = await import("./posthog")

    expect(
      redactAnalyticsEvent({
        uuid: "018f0000-0000-7000-8000-000000000001",
        event: "$exception",
        properties: {
          $exception_list: [
            {
              value:
                "Request failed at https://chrsep.dev/resources/vibecoding-demo?token=private#message and /cv?secret=hidden",
            },
          ],
          $elements_chain:
            'a.session:attr__href="/resources/vibecoding-demo?session=private#message"href="https://chrsep.dev/cv?token=private"',
        },
      }),
    ).toEqual({
      uuid: "018f0000-0000-7000-8000-000000000001",
      event: "$exception",
      properties: {
        $exception_list: [
          {
            value:
              "Request failed at https://chrsep.dev/resources/vibecoding-demo and /cv",
          },
        ],
        $elements_chain:
          'a.session:attr__href="/resources/vibecoding-demo"href="https://chrsep.dev/cv"',
      },
    })
  })

  it("redacts replay network URLs before PostHog records them", async () => {
    const { initPostHog } = await import("./posthog")

    initPostHog()
    await vi.waitFor(() => {
      expect(posthogMock.init).toHaveBeenCalledTimes(1)
    })
    const config = posthogMock.init.mock.calls[0]?.[1]
    const maskRequest = config?.session_recording?.maskCapturedNetworkRequestFn

    expect(
      maskRequest?.({
        name: "https://chrsep.dev/resources/vibecoding-demo?session=private#message",
        entryType: "resource",
        startTime: 0,
        duration: 10,
      }),
    ).toEqual(
      expect.objectContaining({
        name: "https://chrsep.dev/resources/vibecoding-demo",
      }),
    )

    expect(
      maskRequest?.({
        name: "https://chrsep.dev/private/customer-slug?session=private",
        entryType: "resource",
        startTime: 0,
        duration: 10,
      }),
    ).toEqual(
      expect.objectContaining({
        name: "https://chrsep.dev/:unknown/:unknown",
      }),
    )
  })

  it("masks unknown route segments in automatic location properties", async () => {
    const { redactAnalyticsEvent } = await import("./posthog")

    expect(
      redactAnalyticsEvent({
        uuid: "018f0000-0000-7000-8000-000000000002",
        event: "$pageview",
        properties: {
          route: "unknown",
          $current_url:
            "https://chrsep.dev/private/customer-slug?token=secret#details",
          $pathname: "/private/customer-slug",
          $session_entry_url:
            "https://chrsep.dev/private/customer-slug?session=secret",
          $session_entry_pathname: "/private/customer-slug",
        },
      }),
    ).toEqual({
      uuid: "018f0000-0000-7000-8000-000000000002",
      event: "$pageview",
      properties: {
        route: "unknown",
        $current_url: "https://chrsep.dev/:unknown/:unknown",
        $pathname: "/:unknown/:unknown",
        $session_entry_url: "https://chrsep.dev/:unknown/:unknown",
        $session_entry_pathname: "/:unknown/:unknown",
      },
    })
  })

  it("preserves known route paths while removing their query values", async () => {
    const { redactAnalyticsEvent } = await import("./posthog")

    expect(
      redactAnalyticsEvent({
        uuid: "018f0000-0000-7000-8000-000000000003",
        event: "$pageview",
        properties: {
          route: "cv",
          $current_url: "https://chrsep.dev/id/cv?token=secret#experience",
          $pathname: "/id/cv",
        },
      }),
    ).toEqual({
      uuid: "018f0000-0000-7000-8000-000000000003",
      event: "$pageview",
      properties: {
        route: "cv",
        $current_url: "https://chrsep.dev/id/cv",
        $pathname: "/id/cv",
      },
    })
  })

  it("masks persisted unknown location properties after a known navigation", async () => {
    const { redactAnalyticsEvent } = await import("./posthog")

    expect(
      redactAnalyticsEvent({
        uuid: "018f0000-0000-7000-8000-000000000004",
        event: "$pageview",
        properties: {
          route: "cv",
          $current_url: "https://chrsep.dev/cv",
          $pathname: "/cv",
          $session_entry_url:
            "https://chrsep.dev/private/customer-slug?token=secret",
          $session_entry_pathname: "/private/customer-slug",
          $prev_pageview_url: "https://chrsep.dev/private/customer-slug",
          $prev_pageview_pathname: "/private/customer-slug",
        },
      }),
    ).toEqual({
      uuid: "018f0000-0000-7000-8000-000000000004",
      event: "$pageview",
      properties: {
        route: "cv",
        $current_url: "https://chrsep.dev/cv",
        $pathname: "/cv",
        $session_entry_url: "https://chrsep.dev/:unknown/:unknown",
        $session_entry_pathname: "/:unknown/:unknown",
        $prev_pageview_url: "https://chrsep.dev/:unknown/:unknown",
        $prev_pageview_pathname: "/:unknown/:unknown",
      },
    })
  })

  it("masks plain relative unknown paths in exception messages", async () => {
    const { redactAnalyticsEvent } = await import("./posthog")

    expect(
      redactAnalyticsEvent({
        uuid: "018f0000-0000-7000-8000-000000000005",
        event: "$exception",
        properties: {
          route: "unknown",
          $exception_message:
            "Failed to load /private/customer-slug while linking to /cv",
        },
      }),
    ).toEqual({
      uuid: "018f0000-0000-7000-8000-000000000005",
      event: "$exception",
      properties: {
        route: "unknown",
        $exception_message:
          "Failed to load /:unknown/:unknown while linking to /cv",
      },
    })
  })

  it("preserves PostHog's direct-referrer sentinel", async () => {
    const { redactAnalyticsEvent } = await import("./posthog")

    expect(
      redactAnalyticsEvent({
        uuid: "018f0000-0000-7000-8000-000000000006",
        event: "$pageview",
        properties: {
          route: "unknown",
          $referrer: "$direct",
          $initial_referrer: "$direct",
        },
      }),
    ).toEqual({
      uuid: "018f0000-0000-7000-8000-000000000006",
      event: "$pageview",
      properties: {
        route: "unknown",
        $referrer: "$direct",
        $initial_referrer: "$direct",
      },
    })
  })
})
