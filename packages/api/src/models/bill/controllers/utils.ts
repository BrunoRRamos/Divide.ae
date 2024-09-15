import { Context } from "../../..";

// export const verifyBillOwner = publicProcedure
// .input(z.object({ billId: z.string() }))
// .query(async ({ ctx, input }) => {
  //   const bill = await ctx.db.bill.findUnique({ where: { id: input.billId } });
  //   if (!bill) {
    //     throw new Error("Bill not found");
    //   }
    //   return bill.userId;
    // });

interface IsUserOwnerOfBillArgs {
  userId: string;
  billId: string;
  ctx: Context;
}
    
interface IsGroupAdminArgs {
  userId: string;
  groupId: string;
  ctx: Context;
}

interface isUserInGroupArgs {
  userId: string;
  groupId: string;
  ctx: Context;
}


export const isGroupAdmin = async ({
  ctx,
  groupId,
  userId,
}: IsGroupAdminArgs) => {
  const group = await ctx.db.group.findUnique({ where: { id: groupId } });

  const user = await ctx.db.user.findUnique({ where: { id: userId } });
  if (!group) {
    throw new Error("Group not found");
  }
  if (!user) {
    throw new Error("User not found");
  }

  return group.userId === user.id;
};


export const isUserInGroup = async ({
  ctx,
  groupId,
  userId,
}: isUserInGroupArgs) => {
  const group = await ctx.db.group.findUnique({
    where: { id: groupId, users: { some: { id: userId } } },
  });
  if (!group) {
    throw new Error("Group not found");
  }

  return !!group;
};


export const isUserOwnerOfBill = async ({
  ctx,
  userId,
  billId,
}: IsUserOwnerOfBillArgs) => {
  const bill = await ctx.db.bill.findUnique({ where: { id: billId } });
  if (!bill) {
    throw new Error("Bill not found");
  }
  const isAdmin = await isGroupAdmin({ctx, groupId: bill.groupId, userId: userId});
  return (bill.userId === userId || isAdmin);
};