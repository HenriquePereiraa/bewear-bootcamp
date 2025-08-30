"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import {
  cartItemTable,
  cartTable,
  orderItemTable,
  orderTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

export const finishOrder = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
    with: {
      shippingAdress: true,
      items: {
        with: {
          productVariant: true,
        },
      },
    },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const totalPriceInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );

  // usar transaction para garantir a "atomisidade", ou seja, deve criar capaz de criar o order e o orderItem
  await db.transaction(async (tx) => {
    if (!cart.shippingAdress) {
      throw new Error("Shipping address not found");
    }
    const [order] = await tx
      .insert(orderTable)
      .values({
        email: cart.shippingAdress?.email,
        zipCode: cart.shippingAdress?.zipCode,
        country: cart.shippingAdress?.country,
        phone: cart.shippingAdress?.phone,
        cpfOrCnpj: cart.shippingAdress?.cpfOrCnpj,
        city: cart.shippingAdress?.city,
        complement: cart.shippingAdress?.complement,
        neighborhood: cart.shippingAdress?.neighborhood,
        number: cart.shippingAdress?.number,
        recipientName: cart.shippingAdress?.recipientName,
        state: cart.shippingAdress?.state,
        street: cart.shippingAdress?.street,
        userId: session.user.id,
        totalPriceInCents,
        shippingAdressId: cart.shippingAdress!.id,
      })
      .returning();

    if (!order) {
      throw new Error("Failed to create order");
    }

    const orderItemsPayload: Array<typeof orderItemTable.$inferInsert> =
      cart.items.map((item) => ({
        orderId: order.id,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        priceInCents: item.productVariant.priceInCents,
      }));

    await tx.insert(orderItemTable).values(orderItemsPayload);
    await tx.delete(cartTable).where(eq(cartTable.id, cart.id));
    await tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id));
  });
};
