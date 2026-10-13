import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        environment: "node",
        env: {
            LEADERBOARD_OPTOUT_SECRET: "test-secret-do-not-use-in-prod",
        },
    },
})
