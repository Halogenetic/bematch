import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const KEY = 'azertyuiopqsdfghjklmwxcvbn';


export const signupRouter = router({
  signupForm: publicProcedure
    .input(z.object({ email: z.string(), password: z.string()}))
    .mutation( async ({ input, ctx }) => {
        const users = await ctx.prisma.user.create({
          data: {
            ...input, 
          }
        })
        return users;
    }),
  signin: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user) {
        throw new Error("Invalid credentials");
      }
      const isMatch = await bcrypt.compare(input.password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }
      const token = jwt.sign({ username: input.email }, KEY);
      return token;
    }),
  // getUsers: publicProcedure
  //   .query(async ({ ctx }) => {
  //     const users = await ctx.prisma.user.findMany({
  //       select: {
  //         email: true,
  //       },
  //     });
  //     return users.map((user) => user.email);
  //   }),
    editForm: publicProcedure
    .input(z.object({ lastname: z.string(), firstname: z.string(), promotion: z.string(), isActive: z.boolean(), tags: z.array(z.string()) }))
    .mutation( async ({ input, ctx }) => {
        const profile = await ctx.prisma.user.updateMany({
          data: {
            ...input, 
          }
        })
        return profile;
    }),
});
