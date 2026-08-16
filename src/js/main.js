import * as api from "./api/mealdb.js"
import { state, saveMealList, checkNewDay } from "./state/appState.js"
import * as ui from "./ui/components.js"

let search = document.getElementById("search-filters-section")
let mealCategories = document.getElementById("meal-categories-section")
let allRecipes = document.getElementById("all-recipes-section")
let mealDetails = document.getElementById("meal-details")
let products = document.getElementById("products-section")
let foodLog = document.getElementById("foodlog-section")
let btnMeals = document.getElementById("btn-meals")
let btnProduct = document.getElementById("btn-product")
let btnFoodLog = document.getElementById("btn-food-log")
let btnClear = document.getElementById("clear-foodlog")
let title = document.getElementById("title")
let caption = document.getElementById("caption")
let gridView = document.getElementById("grid-view-btn")
let listView = document.getElementById("list-view-btn")
let allRecipesBtn = document.getElementById("all-recipes")
let mealSearchInput = document.getElementById("search-input")
let logModal = document.getElementById("log-meal-modal")
let input = document.getElementById("meal-servings")

btnMeals.addEventListener("click", function (e) {
    e.preventDefault()
    mealCategories.classList.remove("hidden")
    search.classList.remove("hidden")
    allRecipes.classList.remove("hidden")
    products.classList.add("hidden")
    foodLog.classList.add("hidden")
    btnProduct.classList.remove("bg-emerald-50", "text-emerald-700")
    btnProduct.classList.add("text-gray-600", "hover:bg-gray-50")
    btnMeals.classList.add("bg-emerald-50", "text-emerald-700")
    btnMeals.classList.remove("text-gray-600", "hover:bg-gray-50")
    btnFoodLog.classList.remove("bg-emerald-50", "text-emerald-700")
    btnFoodLog.classList.add("text-gray-600", "hover:bg-gray-50")
    title.textContent = "Meals & Recipes"
    caption.textContent = "Discover delicious and nutritious recipes tailored for you"
    history.pushState(null, "", "#meals")
})

btnProduct.addEventListener("click", function (e) {
    e.preventDefault()
    mealCategories.classList.add("hidden")
    search.classList.add("hidden")
    allRecipes.classList.add("hidden")
    products.classList.remove("hidden")
    foodLog.classList.add("hidden")
    mealDetails.classList.add("hidden")
    btnProduct.classList.add("bg-emerald-50", "text-emerald-700")
    btnProduct.classList.remove("text-gray-600", "hover:bg-gray-50")
    btnMeals.classList.remove("bg-emerald-50", "text-emerald-700")
    btnMeals.classList.add("text-gray-600", "hover:bg-gray-50")
    btnFoodLog.classList.remove("bg-emerald-50", "text-emerald-700")
    btnFoodLog.classList.add("text-gray-600", "hover:bg-gray-50")
    title.textContent = "Product Scanner"
    caption.textContent = "Search packaged foods by name or barcode"
    history.pushState(null, "", "#products")
})

btnFoodLog.addEventListener("click", function (e) {
    e.preventDefault()
    mealCategories.classList.add("hidden")
    search.classList.add("hidden")
    allRecipes.classList.add("hidden")
    products.classList.add("hidden")
    foodLog.classList.remove("hidden")
    mealDetails.classList.add("hidden")
    btnProduct.classList.remove("bg-emerald-50", "text-emerald-700")
    btnProduct.classList.add("text-gray-600", "hover:bg-gray-50")
    btnMeals.classList.remove("bg-emerald-50", "text-emerald-700")
    btnMeals.classList.add("text-gray-600", "hover:bg-gray-50")
    btnFoodLog.classList.add("bg-emerald-50", "text-emerald-700")
    btnFoodLog.classList.remove("text-gray-600", "hover:bg-gray-50")
    title.textContent = "Food Log"
    caption.textContent = "Track your daily nutrition and food intake"
    history.pushState(null, "", "#foodlog")
})

document.getElementById("back-to-meals-btn")?.addEventListener("click", goBackToMeals)
mealDetails.addEventListener("click", function (e) {
    if (e.target.closest("#back-to-meals-btn")) goBackToMeals()
})

function goBackToMeals() {
    search.classList.remove("hidden")
    mealCategories.classList.remove("hidden")
    allRecipes.classList.remove("hidden")
    mealDetails.classList.add("hidden")
    title.textContent = "Meals & Recipes"
    caption.textContent = "Discover delicious and nutritious recipes tailored for you"
    history.pushState(null, "", "#meals")
}

gridView.addEventListener("click", function () {
    state.currentView = "grid"
    gridView.classList.add("bg-white", "rounded-md", "shadow-sm")
    listView.classList.remove("bg-white", "rounded-md", "shadow-sm")
    ui.showMeals(openMealDetails)
})

listView.addEventListener("click", function () {
    state.currentView = "list"
    gridView.classList.remove("bg-white", "rounded-md", "shadow-sm")
    listView.classList.add("bg-white", "rounded-md", "shadow-sm")
    ui.showMeals(openMealDetails)
})

function openMealDetails(mealId) {
    search.classList.add("hidden")
    mealCategories.classList.add("hidden")
    allRecipes.classList.add("hidden")
    mealDetails.classList.remove("hidden")
    title.textContent = "Recipe Details"
    caption.textContent = "View full recipe information and nutrition facts"
    loadMeal(mealId)
}

async function loadMeal(id) {
    let meal = await api.fetchMealById(id)
    state.currentFilterLabel = ""
    ui.showDetails(meal)
    loadMealNutrition(meal)
let mealSlug = meal.name.toLowerCase().trim().replace(/\s+/g, "-")
    history.pushState(null, "", `#meal/${mealSlug}`)
}

async function loadMealNutrition(meal) {
    let nutrition = await api.fetchNutrition(meal)
    state.currentMeal = meal
    state.currentNutrition = nutrition

    document.getElementById("hero-servings").textContent = "1 serving"
    document.getElementById("hero-calories").textContent = `${nutrition.perServing.calories} kcal`

    let slot = document.getElementById("meal-details-nutrition-slot")
    if (slot) slot.innerHTML = ui.showNutrition(nutrition)

    let logBtn = document.getElementById("log-meal-btn")
    logBtn.disabled = false
    logBtn.classList.remove("opacity-60", "cursor-not-allowed")
    document.getElementById("log-meal-btn-spinner").classList.add("hidden")
    document.getElementById("log-meal-btn-icon-wrap").classList.remove("hidden")
    document.getElementById("log-meal-btn-icon-wrap").classList.add("flex")
    document.getElementById("log-meal-btn-text").textContent = "Log This Meal"

    logBtn.addEventListener("click", function () {
        state.currentValue = 1
        input.value = 1
        ui.showModal(nutrition, meal)
        logModal.classList.remove("hidden")
    })
}

async function getMeals(query) {
    state.dataMeals = await api.fetchMeals(query)
    ui.showMeals(openMealDetails)
}
getMeals("chicken")

allRecipesBtn.addEventListener("click", function () {
    state.currentFilterLabel = ""
    getMeals("chicken")
})

let mealDebounceTimer
mealSearchInput.addEventListener("input", function () {
    clearTimeout(mealDebounceTimer)
    mealDebounceTimer = setTimeout(searchMeals, 500)
})

async function searchMeals() {
    let inputText = mealSearchInput.value.trim()
    if (inputText === "") return
    state.dataMeals = await api.fetchMeals(inputText)
    ui.showMeals(openMealDetails)
}

async function initAreas() {
    let areaList = await api.fetchAreas()
    ui.showArea(areaList, async function (areaName) {
        state.dataMeals = await api.fetchMealsByArea(areaName)
        state.currentFilterLabel = areaName
        ui.showMeals(openMealDetails)
    })
}
initAreas()

async function initCategories() {
    let categoryList = await api.fetchCategories()
    ui.showCategory(categoryList, async function (categoryName) {
        state.dataMeals = await api.fetchMealsByCategory(categoryName)
        state.currentFilterLabel = categoryName
        ui.showMeals(openMealDetails)
    })
}
initCategories()

document.getElementById("increase-servings").addEventListener("click", function () {
    state.currentValue += 0.5
    if (state.currentValue > 10) state.currentValue = 10
    input.value = state.currentValue
})

document.getElementById("decrease-servings").addEventListener("click", function () {
    state.currentValue -= 0.5
    if (state.currentValue < 0.5) state.currentValue = 0.5
    input.value = state.currentValue
})

document.getElementById("cancel-log-meal").addEventListener("click", function () {
    logModal.classList.add("hidden")
})

document.addEventListener("click", function (e) {
    if (e.target === logModal) logModal.classList.add("hidden")
})

document.getElementById("confirm-log-meal").addEventListener("click", function () {
    let multipliedNutrition = {
        perServing: {
            calories: state.currentNutrition.perServing.calories * state.currentValue,
            protein: state.currentNutrition.perServing.protein * state.currentValue,
            carbs: state.currentNutrition.perServing.carbs * state.currentValue,
            fat: state.currentNutrition.perServing.fat * state.currentValue
        }
    }

    Swal.fire({
        title: "Meal Logged!",
        html: `${state.currentMeal.name} (${state.currentValue} serving) has been added to your daily log.<br>
        + ${multipliedNutrition.perServing.calories.toFixed(0)} calories`,
        icon: "success",
        showCancelButton: false,
        showConfirmButton: false,
        timer: 1500
    })

    state.mealList.push({
        meal: state.currentMeal,
        nutrition: multipliedNutrition,
        servings: state.currentValue,
        loggedAt: new Date().toISOString()
    })
    ui.addMeal()
    ui.todayNutrition()
    saveMealList()

    logModal.classList.add("hidden")
})

btnClear.addEventListener("click", function () {
    Swal.fire({
        title: "Clear Today's Log?",
        text: "This will remove all logged food items for today.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
                showCancelButton: false,
                showConfirmButton: false,
                timer: 1500
            })
            state.mealList.splice(0, state.mealList.length)
            localStorage.removeItem("mealList")
            btnClear.style.display = "none"
            ui.addMeal()
            ui.todayNutrition()
            ui.showToast("Today's log cleared")
        }
    })
})

let message = document.getElementById("products-count")
let searchInput = document.getElementById("product-search-input")
let barcodeInput = document.getElementById("barcode-input")

document.getElementById("search-product-btn").addEventListener("click", function () {
    if (searchInput.value.trim() !== "") searchProduct()
})

searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && searchInput.value.trim() !== "") searchProduct()
})

let nutriScoreButtons = document.querySelectorAll(".nutri-score-filter")
nutriScoreButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        let inputText = searchInput.value
        state.selectedGrade = this.dataset.grade

        if (state.selectedGrade === "") {
            message.textContent = state.allProducts.length > 0
                ? `Found ${state.allProducts.length} products`
                : `Search for products to see results`
        } else {
            let filteredCount = state.allProducts.filter(function (item) {
                return item.nutritionGrade === state.selectedGrade
            }).length

            message.textContent = filteredCount > 0
                ? `Found ${filteredCount} products for ${inputText}`
                : `No products found for  ${inputText}`
        }

        ui.renderProducts()
    })
})

async function searchProduct() {
    let inputText = searchInput.value
    state.allProducts = await api.fetchProductsBySearch(inputText)

    message.textContent = state.allProducts.length > 0
        ? `Found ${state.allProducts.length} products for "${inputText}"`
        : `No products found for "${inputText}"`

    ui.renderProducts()
}

document.getElementById("lookup-barcode-btn").addEventListener("click", function () {
    if (barcodeInput.value.trim() !== "") searchBarcode()
})

barcodeInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && barcodeInput.value.trim() !== "") searchBarcode()
})

async function searchBarcode() {
    let inputText = barcodeInput.value.trim()
    let item = await api.fetchProductByBarcode(inputText)

    if (!item) {
        document.getElementById("products-grid").innerHTML = ui.boxNoProduct
        message.textContent = `No product found for barcode "${inputText}"`
        return
    }

    message.textContent = `Found product: ${item.name}`
    ui.renderSingleProduct(item)
    ui.fillProductModal(item)
    document.getElementById("product-detail-modal").classList.remove("hidden")
}

let categoryButtons = document.querySelectorAll(".product-category-btn")
categoryButtons.forEach(function (btn) {
    btn.addEventListener("click", async function () {
        let category = this.dataset.category
        await getProductsByCategory(category)
    })
})

async function getProductsByCategory(category) {
    let results = await api.fetchProductsByCategory(category)

    if (!results) {
        document.getElementById("products-grid").innerHTML = ui.boxNoProduct
        message.textContent = `${category} - No products found`
        return
    }

    state.allProducts = results
    state.selectedGrade = ""

    message.textContent = state.allProducts.length > 0
        ? `Found ${state.allProducts.length} products in ${category}`
        : `${category} - No products found`

    ui.renderProducts()
}

document.getElementById("products-grid").addEventListener("click", async function (e) {
    let card = e.target.closest(".product-card")
    if (!card) return
    let item = await api.fetchProductByBarcode(card.dataset.barcode)
    if (!item) return
    ui.fillProductModal(item)
    document.getElementById("product-detail-modal").classList.remove("hidden")
})

document.querySelectorAll(".close-product-modal").forEach(function (btn) {
    btn.addEventListener("click", function () {
        document.getElementById("product-detail-modal").classList.add("hidden")
    })
})

document.getElementById("product-detail-modal").addEventListener("click", function (e) {
    if (!e.target.closest(".add-product-to-log")) return

    let btn = e.target.closest(".add-product-to-log")

    let productEntry = {
        meal: {
            id: btn.dataset.barcode,
            name: btn.dataset.name,
            thumbnail: btn.dataset.image,
            category: btn.dataset.category,
            area: btn.dataset.brand
        },
        nutrition: {
            perServing: {
                calories: Number(btn.dataset.calories),
                protein: Number(btn.dataset.protein),
                carbs: Number(btn.dataset.carbs),
                fat: Number(btn.dataset.fat)
            }
        },
        servings: 1,
        loggedAt: new Date().toISOString()
    }

    state.mealList.push(productEntry)
    saveMealList()

    ui.addMeal()
    ui.todayNutrition()

    document.getElementById("product-detail-modal").classList.add("hidden")
    ui.showToast(`${btn.dataset.name} logged to your daily intake!`)
})

checkNewDay()
ui.showTodayDate()
ui.addMeal()
if (location.hash === "" || location.hash === "#") {
    history.pushState(null, "", "#meals")
} else if (location.hash.includes("#product")) {
    btnProduct.click()
} else if (location.hash.includes("#foodlog")) {
    btnFoodLog.click()
}