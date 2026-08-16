const BASE_URL = "https://nutriplan-api.vercel.app/api"
const NUTRITION_API_KEY = "He1yHAIqaCjYGAGQQU4Y3A7XmC4RGlVIILpMPznn"

export async function fetchMeals(query) {
    let response = await fetch(`${BASE_URL}/meals/search?q=${query}&page=1&limit=25`)
    return (await response.json()).results
}

export async function fetchMealById(id) {
    let response = await fetch(`${BASE_URL}/meals/${id}`)
    return (await response.json()).result
}

export async function fetchMealsByArea(areaName) {
    let response = await fetch(`${BASE_URL}/meals/filter?area=${areaName}&page=1&limit=25`)
    return (await response.json()).results
}

export async function fetchMealsByCategory(categoryName) {
    let response = await fetch(`${BASE_URL}/meals/filter?category=${categoryName}&page=1&limit=25`)
    return (await response.json()).results
}

export async function fetchAreas() {
    let response = await fetch(`${BASE_URL}/meals/areas`)
    return (await response.json()).results
}

export async function fetchCategories() {
    let response = await fetch(`${BASE_URL}/meals/categories`)
    return (await response.json()).results
}

export async function fetchNutrition(meal) {
    let ingredientsList = meal.ingredients.map(function (item) {
        return item.measure + " " + item.ingredient
    })

    let response = await fetch(`${BASE_URL}/nutrition/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": NUTRITION_API_KEY
        },
        body: JSON.stringify({
            recipeName: meal.name,
            ingredients: ingredientsList
        })
    })
    return (await response.json()).data
}

export async function fetchProductsBySearch(query) {
    let response = await fetch(`${BASE_URL}/products/search?q=${query}&page=1&limit=24`)
    return (await response.json()).results
}

export async function fetchProductByBarcode(barcode) {
    let response = await fetch(`${BASE_URL}/products/barcode/${barcode}`)
    if (!response.ok) {
        return null
    }
    return (await response.json()).result
}

export async function fetchProductsByCategory(category) {
    let response = await fetch(`${BASE_URL}/products/category/${category}`)
    if (!response.ok) {
        return null
    }
    return (await response.json()).results
}