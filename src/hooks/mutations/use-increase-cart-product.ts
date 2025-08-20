import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductToCart } from "@/actions/add-cart-product";

import { getUserCartQueryKey } from "../queries/use-cart";

export const INCREASE_CART_PRODUCT_QUANTITY_MUTATION_KEY = (
  productVariantId: string,
) => ["increase-cart-product-quantity", productVariantId] as const;

export const useIncreaseCartProduct = (productVariantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: INCREASE_CART_PRODUCT_QUANTITY_MUTATION_KEY(productVariantId),
    mutationFn: () => addProductToCart({ productVariantId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUserCartQueryKey() });
    },
  });
};
