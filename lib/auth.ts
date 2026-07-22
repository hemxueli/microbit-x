import { betterAuth } from "better-auth"
import { pool } from "@/lib/db"

export const auth = betterAuth({
  database: pool,

  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.V0_RUNTIME_URL),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,

    // 开发测试用：暂时把 Reset Password Link 打印到 Terminal
    sendResetPassword: async ({ user, url }) => {
      console.log("=================================")
      console.log("PASSWORD RESET REQUEST")
      console.log("User:", user.email)
      console.log("Reset URL:", url)
      console.log("=================================")
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
        input: true,
      },
    },
  },

  trustedOrigins: [
    ...(process.env.V0_RUNTIME_URL
      ? [process.env.V0_RUNTIME_URL]
      : []),

    ...(process.env.VERCEL_URL
      ? [`https://${process.env.VERCEL_URL}`]
      : []),

    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  ...(process.env.NODE_ENV === "development"
    ? {
        advanced: {
          // In dev (v0 preview iframe), force cross-site cookies
          // so the session cookie is stored by the browser.
          defaultCookieAttributes: {
            sameSite: "none" as const,
            secure: true,
          },
        },
      }
    : {}),
})