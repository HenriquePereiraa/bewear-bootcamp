import { useMutation, useQueryClient } from "@tanstack/react-query";

import { decreaseCartProductQuantityFromCart } from "@/actions/decrease-cart-product-quantity";

import { getUseCartQueryKey } from "../queries/use-cart";


export const DECREASE_CART_PRODUCT_QUANTITY_MUTATION_KEY = (cartItemId: string) =>
  ["decrease-cart-product-quantity", cartItemId] as const;

export const useDecreaseCartProduct = (cartItemId: string) => {

    const queryClient = useQueryClient();
    return useMutation({
    mutationKey: DECREASE_CART_PRODUCT_QUANTITY_MUTATION_KEY(cartItemId),
    mutationFn: () => decreaseCartProductQuantityFromCart({ cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey()});
    },
  });
}