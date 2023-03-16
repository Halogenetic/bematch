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
        return JSON.parse(JSON.stringify(users));
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
      return JSON.parse(JSON.stringify(token));
    }),
  getUsers: publicProcedure
    .query(async ({ ctx }) => {
      const email = await ctx.prisma.user.findMany({
        select: {
          email: true,
        },
      });
      return JSON.parse(JSON.stringify(email.map((user) => user.email)));

    }),
    editForm: publicProcedure
    .input(z.object({ username: z.string(), lastname: z.string(), firstname: z.string(), promotion: z.string(), isActive: z.boolean(), tags: z.array(z.string()) }))
    .mutation( async ({ input, ctx }) => {
        const profile = await ctx.prisma.user.update({
          where: {
            email: input.username
          },
          data: {
            lastname: input.lastname, firstname: input.firstname, promotion: input.promotion, isActive: input.isActive, tags: input.tags 
          }
        })
        return JSON.parse(JSON.stringify(profile));
      }),
    getProfileByEmail: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return JSON.parse(JSON.stringify(user));
    }),
    getProfilesByTags: publicProcedure
    .input(z.array(z.string()))
    .query(async ({ input, ctx }) => {
      const profiles = await ctx.prisma.user.findMany({
        where: {
          tags: {
            hasSome: input
          }
        }
      });
      return JSON.parse(JSON.stringify(profiles));
    }),
});
