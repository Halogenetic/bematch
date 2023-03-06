import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const KEY = 'azertyuiopqsdfghjklmwxcvbn';


export const signupRouter = router({
  signupForm: publicProcedure
    .input(z.object({ name: z.string(), password: z.string(), newsletter: z.boolean() }))
    .mutation( async ({ input, ctx }) => {
        const users = await ctx.prisma.user.create({
          data: {
            ...input, 
          }
        })
        return users;
    }),
  signin: publicProcedure
    .input(z.object({ name: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { name: input.name },
      });
      if (!user) {
        throw new Error("Invalid credentials");
      }
      const isMatch = await bcrypt.compare(input.password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }
      const token = jwt.sign({ username: input.name }, KEY);
      return token;
    }),
  getUsers: publicProcedure
    .query(async ({ ctx }) => {
      const users = await ctx.prisma.user.findMany({
        select: {
          name: true,
        },
      });
      return users.map((user) => user.name);
    }),
});
