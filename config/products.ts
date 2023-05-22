const mode = import.meta.env.DEV ? 'local' : 'prod'

const productIdOptions = {
  local: {
    pro: 'prod_M1K67JwsTDuIRj',
  },
  prod: {
    pro: 'prod_NvM5k5A2o6S36q',
  },
}

const priceIdOptions = {
  local: {
    monthly: 'price_1LJHSVC81hSlW91XZctu3lbs',
    yearly: 'price_1LJHSVC81hSlW91XWRVBZij6',
  },
  prod: {
    monthly: 'price_1N9VNWC81hSlW91XJhl8ZBY3',
    yearly: 'price_1N9VNWC81hSlW91X0EO7WITt',
  },
}

export const productIds = productIdOptions[mode]
export const priceIds = priceIdOptions[mode]

export const priceValues = {
  monthly: 10,
  yearly: 8,
}
