import { supabase }
  from './supabase'

export async function
fetchProducts() {

  // ========================
  // PRODUCTS
  // ========================

  const {
    data: products,
    error: productsError,
  } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)

  if (productsError) {

    console.error(
      'PRODUCT FETCH ERROR',
      productsError,
    )

    return []
  }

  // ========================
  // PRODUCT INGREDIENTS
  // ========================
// voila

  const {
    data: ingredientLinks,
    error: ingredientError,
  } = await supabase
    .from('product_ingredients')
    .select(`
      product_id,
      dosage,
      unit,

      ingredients (
        id,
        name,
        recommended_daily_optimal,
        recommended_daily_upper,
        recommended_unit
      )
    `)

  if (ingredientError) {

    console.error(
      'INGREDIENT FETCH ERROR',
      ingredientError,
    )     
  }

  // ========================
  // MERGE
  // ========================

  const mergedProducts =
    products.map(
      (product: any) => {

        const productIngredients =
          ingredientLinks?.filter(
            (link: any) =>
              link.product_id ===
              product.id,
          ) || []

        return {

          ...product,

          product_ingredients:
            productIngredients,

          scoreTargets:
            typeof product.score_targets ===
            'string'

              ? JSON.parse(
                  product.score_targets,
                )

              : product.score_targets || [],

          biologicalTargets:
            typeof product.biological_targets ===
            'string'

              ? JSON.parse(
                  product.biological_targets,
                )

              : product.biological_targets || [],

          stackCompatibility:
            typeof product.stack_compatibility ===
            'string'

              ? JSON.parse(
                  product.stack_compatibility,
                )

              : product.stack_compatibility || [],
              secondaryPhases:

  typeof product.secondary_phases ===
  'string'

    ? JSON.parse(
        product.secondary_phases,
      )

    : product.secondary_phases || [],
        }
      },
    )

  return mergedProducts
}