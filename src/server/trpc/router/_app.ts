import { router } from "../trpc";
import { signupRouter } from "./signupRouter";

export const appRouter = router({
  signup: signupRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
