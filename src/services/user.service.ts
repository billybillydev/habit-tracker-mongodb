import { User } from "$db/models";


export const userService = {
  google: {
  async getByGoogleId(googleId: string) {
    const result = await User.findOne({ googleId });
    return result;
  },

  },
  async getById(userId: string) {
    const result = await User.findById(userId);
    return result;
  },

  async getByEmail(email: string) {
    const result = await User.findOne({ email });

    return result;
  },

  // async deleteById(userId: string) {
  //   const result = await db
  //     .delete(userSchema)
  //     .where(eq(userSchema.id, userId))
  //     .returning()
  //     .get();
  //   if (!result) {
  //     throw new Error("User was not deleted.");
  //   }

  //   return result;
  // },

  async create(createData: User) {
    const result = new User(createData);

    if (!result) {
      throw new Error("User was not created.");
    }
    await result.save();
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
  //     throw new Error("User was not updated.");
  //   }

  //   return result;
  // },
};
