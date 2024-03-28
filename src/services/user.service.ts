import { eq } from "drizzle-orm";
import { InternalServerError } from "elysia";
import { db } from "../db";
import { InsertUser, userSchema } from "../db/schema";

export const userService = {
  async getById(userId: string) {
    const result = await db.query.userSchema.findFirst({
      where: (fields, { eq }) => eq(fields.id, userId),
    });
    return result;
  },

  async getByGoogleId(googleId: string) {
    const result = await db
      .select({
        id: userSchema.id,
        name: userSchema.name,
        googleId: userSchema.googleId,
        authType: userSchema.authType,
      })
      .from(userSchema)
      .where(eq(userSchema.googleId, googleId))
      .get();
    return result;
  },

  async getByEmail(email: string) {
    const result = await db
      .select({
        id: userSchema.id,
        name: userSchema.name,
        email: userSchema.email,
        password: userSchema.password,
        authType: userSchema.authType,
      })
      .from(userSchema)
      .where(eq(userSchema.email, email))
      .get();

    return result;
  },

  async deleteById(userId: string) {
    const result = await db
      .delete(userSchema)
      .where(eq(userSchema.id, userId))
      .returning()
      .get();
    if (!result) {
      throw new InternalServerError("User was not deleted.");
    }

    return result;
  },

  async create(createData: InsertUser) {
    const result = await db
      .insert(userSchema)
      .values(createData)
      .returning()
      .get();

    if (!result) {
      throw new InternalServerError("User was not created.");
    }

    return result;
  },

  // updateById<TAuthType>(
  //   userId: string,
  //   updateData: UpdateUserData<TAuthType>
  // ): User<TAuthType> | never {
  //   const user = this.getById(userId);
  //   if (!user) {
  //     throw new NotFoundError(`User does not exist`);
  //   }
  //   const updateObj: UpdateUserDB<TAuthType> = {
  //     $name: updateData.name ?? user.name,
  //     $id: user.id,
  //   };

  //   const result: User<TAuthType> | null = db
  //     .query<User<TAuthType>, Record<string, string>>(
  //       `UPDATE users
  //         SET name = $name
  //         WHERE id = $id`
  //     )
  //     .get(updateObj);

  //   if (!result) {
  //     throw new InternalServerError("User was not updated.");
  //   }

  //   return result;
  // },
};
