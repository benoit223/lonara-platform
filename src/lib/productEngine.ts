import { fetchProducts }
  from './fetchProducts'

export async function
getRecommendedProducts()
 {

  const products =
    await fetchProducts()

 return products
}