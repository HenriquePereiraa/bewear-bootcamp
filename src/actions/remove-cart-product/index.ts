"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { removeProductFromCartSchema } from "./schema";

export const removeProductFromCart = async (
  data: z.infer<typeof removeProductFromCartSchema>,
) => {
  removeProductFromCartSchema.parse(data);

  //verificar se user esta logado
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  //verificar se a variante já existe no carrinho
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });

  const cartDoesNotBelongToUSer = cartItem?.cart.userId !== session.user.id;
  if (cartDoesNotBelongToUSer) {
    throw new Error("Unauthorized");
  }

  // verificar se tem o cartItem
  if (!cartItem) {
    throw new Error("Product variant not found in cart");
  }

  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
};
