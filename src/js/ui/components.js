import { state, saveMealList, getKcalForDate, getItemsCountForDate } from "../state/appState.js"

export function getYoutubeEmbedUrl(url) {
    if (!url) return ""
    const videoId = url.split("v=")[1]?.split("&")[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ""
}

export function getBarWidth(value, dailyValue) {
    let percentage = (value / dailyValue) * 100
    if (percentage > 100) percentage = 100
    if (percentage < 0 || isNaN(percentage)) percentage = 0
    return percentage.toFixed(0)
}

export function showToast(message) {
    let toast = document.getElementById("toast-notification")
    toast.textContent = message
    toast.style.display = "block"

    setTimeout(function () {
        toast.style.display = "none"
    }, 2000)
}

export function showTodayDate() {
    let dateToday = document.getElementById("foodlog-date")
    let today = new Date()

    let dayName = today.toLocaleDateString("en-US", { weekday: "long" })
    let monthDay = today.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    dateToday.innerHTML = `${dayName}, ${monthDay}`
}

export function showMeals(onCardClick) {
    document.getElementById("recipes-count").textContent = `Showing ${state.dataMeals.length}  ${state.currentFilterLabel} recipes`

    if (state.dataMeals.length === 0) {
        document.getElementById("recipes-grid").className = ""
        document.getElementById("recipes-grid").innerHTML = `
        <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="text-2xl text-gray-400 fa-solid fa-magnifying-glass"></i>
            </div>
            <p class="text-gray-500 text-lg">No recipes found. Try a different search term.</p>
        </div>
        `
        return
    }

    if (state.currentView === "grid") {
        document.getElementById("recipes-grid").className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    } else {
        document.getElementById("recipes-grid").className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
    }

    let boxMeals = state.dataMeals.map(function (item) {
        if (state.currentView === "grid") {
                        return `
                <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="${item.id}">
                    <div class="relative h-48 overflow-hidden">
                        <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${item.thumbnail}" alt="${item.name}" loading="lazy" />
                        <div class="absolute bottom-3 left-3 flex gap-2">
                            <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">${item.category}</span>
                            <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">${item.area}</span>
                        </div>
                    </div>
                    <div class="p-4">
                        <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">${item.name}</h3>
                        <p class="text-xs text-gray-600 mb-3 line-clamp-2">${item.instructions[0]}</p>
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-semibold text-gray-900"><i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>${item.category}</span>
                            <span class="font-semibold text-gray-500"><i class="fa-solid fa-globe text-blue-500 mr-1"></i>${item.area?item.area:"International"}</span>
                        </div>
                    </div>
                </div>
            `
        } else {
            return `
                <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex" data-meal-id="${item.id}">
                    <img class="w-40 h-32 object-cover shrink-0" src="${item.thumbnail}" alt="${item.name}" loading="lazy" />
                    <div class="p-4 flex-1">
                        <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">${item.name}</h3>
                        <p class="text-xs text-gray-600 mb-3 line-clamp-2">${item.instructions[0]}</p>
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-semibold text-gray-900"><i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>${item.category}</span>
                            <span class="font-semibold text-gray-500"><i class="fa-solid fa-globe text-blue-500 mr-1"></i>${item.area}</span>
                        </div>
                    </div>
                </div>
            `
        }
    }).join("")

    document.getElementById("recipes-grid").innerHTML = boxMeals

    let cards = document.querySelectorAll(".recipe-card")
    cards.forEach(function (card) {
        card.addEventListener("click", function () {
            let clickedId = card.getAttribute("data-meal-id")
            onCardClick(clickedId)
        })
    })
}

export function showArea(areaList, onAreaClick) {
    let boxArea = areaList.slice(0, 10).map(function (item) {
        return `
        <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all">
              ${item.name}
            </button>
        `
    }).join("")
    document.getElementById("area-buttons").insertAdjacentHTML("beforeend", boxArea)

    let buttonsArea = document.querySelectorAll("#area-buttons button")
    buttonsArea.forEach(function (button) {
        button.addEventListener("click", function () {
            buttonsArea.forEach(function (btn) {
                btn.classList.remove("bg-emerald-600", "text-white")
                btn.classList.add("bg-gray-100", "text-gray-700")
            })

            button.classList.remove("bg-gray-100", "text-gray-700")
            button.classList.add("bg-emerald-600", "text-white")

            onAreaClick(button.textContent.trim())
        })
    })
}

const categoryStyles = {
    "Beef": { bg: "from-red-50 to-rose-50", border: "border-red-200 hover:border-red-400", icon: "from-red-400 to-rose-500", faIcon: "fa-drumstick-bite" },
    "Chicken": { bg: "from-amber-50 to-orange-50", border: "border-amber-200 hover:border-amber-400", icon: "from-amber-400 to-orange-500", faIcon: "fa-drumstick-bite" },
    "Dessert": { bg: "from-pink-50 to-rose-50", border: "border-pink-200 hover:border-pink-400", icon: "from-pink-400 to-rose-500", faIcon: "fa-cake-candles" },
    "Lamb": { bg: "from-orange-50 to-amber-50", border: "border-orange-200 hover:border-orange-400", icon: "from-orange-400 to-amber-500", faIcon: "fa-drumstick-bite" },
    "Miscellaneous": { bg: "from-slate-50 to-gray-50", border: "border-slate-200 hover:border-slate-400", icon: "from-slate-400 to-gray-500", faIcon: "fa-bowl-rice" },
    "Pasta": { bg: "from-yellow-50 to-amber-50", border: "border-yellow-200 hover:border-yellow-400", icon: "from-yellow-400 to-amber-500", faIcon: "fa-bowl-food" },
    "Pork": { bg: "from-rose-50 to-red-50", border: "border-rose-200 hover:border-rose-400", icon: "from-rose-400 to-red-500", faIcon: "fa-bacon" },
    "Seafood": { bg: "from-cyan-50 to-blue-50", border: "border-cyan-200 hover:border-cyan-400", icon: "from-cyan-400 to-blue-500", faIcon: "fa-fish" },
    "Side": { bg: "from-green-50 to-emerald-50", border: "border-green-200 hover:border-green-400", icon: "from-green-400 to-emerald-500", faIcon: "fa-plate-wheat" },
    "Starter": { bg: "from-teal-50 to-cyan-50", border: "border-teal-200 hover:border-teal-400", icon: "from-teal-400 to-cyan-500", faIcon: "fa-utensils" },
    "Vegan": { bg: "from-emerald-50 to-green-50", border: "border-emerald-200 hover:border-emerald-400", icon: "from-emerald-400 to-green-500", faIcon: "fa-leaf" },
    "Vegetarian": { bg: "from-lime-50 to-green-50", border: "border-lime-200 hover:border-lime-400", icon: "from-lime-400 to-green-500", faIcon: "fa-seedling" }
}

export function showCategory(categoryList, onCategoryClick) {
    let boxCategory = categoryList.slice(0, 12).map(function (item) {
        let style = categoryStyles[item.name] || { bg: "from-emerald-50 to-teal-50", border: "border-emerald-200 hover:border-emerald-400", icon: "from-emerald-400 to-green-500", faIcon: "fa-utensils" }

        return `
        <div class="category-card bg-gradient-to-br ${style.bg} rounded-xl p-3 border ${style.border} hover:shadow-md cursor-pointer transition-all group" data-category="${item.name}">
            <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 bg-gradient-to-br ${style.icon} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <i class="text-sm text-white fa-solid ${style.faIcon}"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-gray-900">${item.name}</h3>
                </div>
            </div>
        </div>
        `
    }).join("")
    document.getElementById("categories-grid").innerHTML = boxCategory

    let buttonsCategory = document.querySelectorAll("#categories-grid .category-card")
    buttonsCategory.forEach(function (button) {
        button.addEventListener("click", function () {
            onCategoryClick(button.dataset.category)
        })
    })
}

export const boxNoProduct = `
        <div class="text-center">
                        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="text-3xl text-gray-400 fa-solid fa-box-open"></i>
                        </div>
                        <p class="text-gray-500 text-lg mb-2">No products to display</p>
                        <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
                    </div>
        `

function productCardHtml(item) {
    let imageBox = item.image
        ? `<img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" src="${item.image}" alt="${item.name}" loading="lazy" />`
        : `<div class="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center"><i class="text-2xl text-gray-400 fa-solid fa-box"></i></div>`

    return `
<div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${item.barcode}">
                <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                  ${imageBox}
                  <div class="absolute top-2 left-2 ${item.nutritionGrade ? "bg-green-500" : "bg-gray-400"} text-white text-xs font-bold px-2 py-1 rounded uppercase">
                    Nutri-Score ${item.nutritionGrade || "Unknown"}
                  </div>
                  <div class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${!item.novaGroup ? "hidden" : ""}" title="NOVAgggggggggggg ${item.novaGroup}">
                    ${item.novaGroup}
                  </div>
                </div>
                <div class="p-4">
                  <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${item.brand}</p>
                  <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">${item.name}</h3>
                  <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span class="${!item.quantity ? "hidden" : ""}"><i class="fa-solid fa-weight-scale mr-1"></i>${item.quantity}</span>
                    <span><i class="fa-solid fa-fire mr-1"></i>${Number(item.nutrients.calories).toFixed(1)} kcal/100g</span>
                  </div>
                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${Number(item.nutrients.protein).toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${Number(item.nutrients.carbs).toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${Number(item.nutrients.fat).toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${Number(item.nutrients.sugar).toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                  </div>
                </div>
              </div>
`
}

export function renderProducts() {
    let productList = state.allProducts

    if (state.selectedGrade !== "") {
        productList = []
        for (let i = 0; i < state.allProducts.length; i++) {
            if (state.allProducts[i].nutritionGrade === state.selectedGrade) {
                productList.push(state.allProducts[i])
            }
        }
    }

    if (productList.length === 0) {
        document.getElementById("products-grid").innerHTML = boxNoProduct
        return
    }

    document.getElementById("products-grid").innerHTML = productList.map(productCardHtml).join("")
}

export function renderSingleProduct(item) {
    document.getElementById("products-grid").innerHTML = productCardHtml(item)
}

export function fillProductModal(item) {
    let modal = document.getElementById("product-detail-modal")

    modal.querySelector("img").src = item.image
    modal.querySelector("img").alt = item.name
    modal.querySelector("h2").textContent = item.name

    let brandEl = modal.querySelector(".text-emerald-600.font-semibold")
    if (brandEl) brandEl.textContent = item.brand

    let quantityEl = modal.querySelectorAll("p")[2]
    if (quantityEl) quantityEl.textContent = item.quantity

    let gradeColors = { A: "#038141", B: "#85bb2f", C: "#fecb02", D: "#ee8100", E: "#e63e11" }
    let gradeLabels = { A: "Excellent", B: "Good", C: "Average", D: "Poor", E: "Bad" }
    let grade = item.nutritionGrade ? item.nutritionGrade.toUpperCase() : ""
    let gradeColor = gradeColors[grade] || "#9ca3af"
    let gradeLabel = gradeLabels[grade] || "Unknown"
    let badgeBoxes = modal.querySelectorAll(".flex.items-center.gap-2.px-3.py-1\\.5.rounded-lg")

    let gradeBox = badgeBoxes[0]
    if (gradeBox) {
        gradeBox.style.backgroundColor = gradeColor + "20"
        let gradeBadge = gradeBox.querySelector("span")
        gradeBadge.style.backgroundColor = gradeColor
        gradeBadge.textContent = grade || "?"
        gradeBox.querySelector("p.font-bold").style.color = gradeColor

        let labelEl = gradeBox.querySelector("p:not(.font-bold)")
        if (labelEl) labelEl.textContent = gradeLabel
    }

    let novaBox = badgeBoxes[1]
    if (novaBox) {
        if (item.novaGroup) {
            novaBox.classList.remove("hidden")
            novaBox.querySelector("span").textContent = item.novaGroup
        } else {
            novaBox.classList.add("hidden")
        }
    }

    modal.querySelector(".text-4xl").textContent = Number(item.nutrients.calories).toFixed(1)

    let statBlocks = modal.querySelectorAll(".grid.grid-cols-4.gap-4 .text-center")
    if (statBlocks[0]) statBlocks[0].querySelector(".text-lg").textContent = Number(item.nutrients.protein).toFixed(1) + "g"
    if (statBlocks[1]) statBlocks[1].querySelector(".text-lg").textContent = Number(item.nutrients.carbs).toFixed(1) + "g"
    if (statBlocks[2]) statBlocks[2].querySelector(".text-lg").textContent = Number(item.nutrients.fat).toFixed(1) + "g"
    if (statBlocks[3]) statBlocks[3].querySelector(".text-lg").textContent = Number(item.nutrients.sugar).toFixed(1) + "g"

    let ingredientsBox = modal.querySelector(".bg-gray-50.rounded-xl.p-5.mb-6")
    if (ingredientsBox) ingredientsBox.classList.add("hidden")

    let allergensBox = modal.querySelector(".bg-red-50.rounded-xl.p-5.mb-6")
    if (allergensBox) allergensBox.classList.add("hidden")

    let logBtn = modal.querySelector(".add-product-to-log")
    logBtn.dataset.barcode = item.barcode
    logBtn.dataset.name = item.name
    logBtn.dataset.image = item.image
    logBtn.dataset.brand = item.brand
    logBtn.dataset.category = item.nutritionGrade ? "Product · Nutri-Score " + item.nutritionGrade : "Product"
    logBtn.dataset.calories = item.nutrients.calories
    logBtn.dataset.protein = item.nutrients.protein
    logBtn.dataset.carbs = item.nutrients.carbs
    logBtn.dataset.fat = item.nutrients.fat
}

export function showNutrition(nutrition) {
    return `
              <div class="space-y-6">
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                  Nutrition Facts
                </h2>
                <div id="nutrition-facts-container">
                  <p class="text-sm text-gray-500 mb-4">Per serving</p>

                  <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
                    <p class="text-sm text-gray-600">Calories per serving</p>
                    <p class="text-4xl font-bold text-emerald-600">${nutrition.perServing.calories}</p>
                    <p class="text-xs text-gray-500 mt-1">Total: ${nutrition.totals.calories}col</p>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrition.perServing.protein}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div class="bg-emerald-500 h-2 rounded-full" style="width: ${getBarWidth(nutrition.perServing.protein, 50)}%"></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrition.perServing.carbs}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div class="bg-blue-500 h-2 rounded-full" style="width: ${getBarWidth(nutrition.perServing.carbs, 275)}%"></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrition.perServing.fat}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div class="bg-purple-500 h-2 rounded-full" style="width: ${getBarWidth(nutrition.perServing.fat, 78)}%"></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrition.perServing.fiber}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div class="bg-orange-500 h-2 rounded-full" style="width: ${getBarWidth(nutrition.perServing.fiber, 28)}%"></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrition.perServing.sugar}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div class="bg-pink-500 h-2 rounded-full" style="width: ${getBarWidth(nutrition.perServing.sugar, 50)}%"></div>
                    </div>
                  </div>

                  <div class="mt-6 pt-6 border-t border-gray-100">
                    <h3 class="text-sm font-semibold text-gray-900 mb-3">other</h3>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Cholesterol</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    `
}

export function showModal(nutrition, meal) {
    document.getElementById("modal-calories").textContent = nutrition.perServing.calories
    document.getElementById("modal-protein").textContent = `${nutrition.perServing.protein}g`
    document.getElementById("modal-carbs").textContent = `${nutrition.perServing.carbs}g`
    document.getElementById("modal-fat").textContent = `${nutrition.perServing.fat}g`
    document.getElementById("modal-image").src = meal.thumbnail
    document.getElementById("modal-image").alt = meal.name
    document.getElementById("modal-name").textContent = meal.name
}

export function showDetails(meal) {
    let ingredients = meal.ingredients.map(function (step) {
        return `
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
                <span class="text-gray-700">
                    <span class="font-medium text-gray-900">${step.measure}</span> ${step.ingredient}
                </span>
            </div>
        `
    }).join("")

    let instructions = meal.instructions.map(function (step, index) {
        return `
            <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    ${index + 1}
                </div>
                <p class="text-gray-700 leading-relaxed pt-2">${step}</p>
            </div>
        `
    }).join("")

    let videoUrl = meal.video || meal.youtube || meal.strYoutube || ""
    let embedUrl = getYoutubeEmbedUrl(videoUrl)
    let videoSection = embedUrl
        ? `
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-circle-play text-emerald-600"></i>
                  Video Tutorial
                </h2>
                <div class="relative w-full rounded-xl overflow-hidden" style="padding-top: 56.25%">
                  <iframe
                    class="absolute top-0 left-0 w-full h-full"
                    src="${embedUrl}"
                    title="${meal.name} video tutorial"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
        `
        : ""

    let boxDetails = `
 <div class="max-w-7xl mx-auto">
          <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Back to Recipes</span>
          </button>

          <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div class="relative h-80 md:h-96">
              <img src="${meal.thumbnail}" alt="${meal.name}" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.category}</span>
                  <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.area}</span>
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${meal.name}</h1>
                <div class="flex items-center gap-6 text-white/90">
                  <span class="flex items-center gap-2"><i class="fa-solid fa-clock"></i><span>30 min</span></span>
                  <span class="flex items-center gap-2"><i class="fa-solid fa-utensils"></i><span id="hero-servings">Calculating...</span></span>
                  <span class="flex items-center gap-2"><i class="fa-solid fa-fire"></i><span id="hero-calories">Calculating...</span></span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 mb-8">
            <button id="log-meal-btn" class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all opacity-60 cursor-not-allowed" data-meal-id="${meal.id}" disabled>
              <span id="log-meal-btn-spinner" class="flex items-center"><i class="fa-solid fa-spinner fa-spin"></i></span>
              <span id="log-meal-btn-icon-wrap" class="hidden items-center"><i class="fa-solid fa-clipboard-list"></i></span>
              <span id="log-meal-btn-text">Calculating...</span>
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-list-check text-emerald-600"></i>
                  Ingredients
                  <span class="text-sm font-normal text-gray-500 ml-auto">${meal.ingredients.length} items</span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${ingredients}
                </div>
              </div>

              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                  Instructions
                </h2>
                <div class="space-y-4">
                 ${instructions}
                </div>
              </div>

              ${videoSection}
            </div>

                        <div id="meal-details-nutrition-slot">
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                  Nutrition Facts
                </h2>
                <div class=" p-6 flex flex-col items-center justify-center text-center py-12">
                <div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <i class="fa-solid fa-calculator text-emerald-500"></i>
                </div>
                
                <p class="font-semibold text-gray-700">Calculating Nutrition</p>
                <p class="text-sm text-gray-400">Analyzing ingredients...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    `

    document.getElementById("meal-details").innerHTML = boxDetails
}

export function addMeal() {
    let mealCount = document.getElementById("meal-count")
    mealCount.textContent = `Logged Items (${state.mealList.length})`
    let btnClear = document.getElementById("clear-foodlog")

    if (state.mealList.length == 0) {
        btnClear.style.display = "none"
        let empty = `
<div class="text-center py-12">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="text-3xl text-gray-300 fa-solid fa-utensils"></i>
                    </div>
                    <p class="text-gray-500 font-medium mb-2">No food logged today</p>
                    <p class="text-gray-400 text-sm mb-4">Start tracking your nutrition by logging meals or scanning products</p>
                    <div class="flex justify-center gap-3">
                        <a id="browse-recipes-link" href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                            <i class="fa-solid fa-plus"></i>
                            Browse Recipes
                        </a>
                        <a id="scan-product-link" href="#" class="nav-link inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                            <i class="fa-solid fa-barcode"></i>
                            Scan Product
                        </a>
                    </div>
                </div>
    `
        document.getElementById("logged-items-list").innerHTML = empty

        document.getElementById("browse-recipes-link").addEventListener("click", function (e) {
            e.preventDefault()
            document.getElementById("btn-meals").click()
            history.pushState(null, "", "#foodlog#meals")
        })

        document.getElementById("scan-product-link").addEventListener("click", function (e) {
            e.preventDefault()
            history.pushState(null, "", "#products")
            location.reload()
        })
    } else {
        btnClear.style.display = "block"
        let box = state.mealList.map(function (entry, index) {
            let { meal, nutrition, servings } = entry
            return `
<div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                        <div class="flex items-center gap-4">
                            <img src="${meal.thumbnail}" alt="${meal.name}" class="w-14 h-14 rounded-xl object-cover">
                            <div>
                                <p class="font-semibold text-gray-900">${meal.name}</p>
                                <p class="text-sm text-gray-500">
                                ${servings} serving${servings > 1 ? "s" : ""}
                                    <span class="mx-1">•</span>
                                    <span class="text-emerald-600">Recipe</span>
                                </p>
                                <p class="text-xs text-gray-400 mt-1">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <p class="text-lg font-bold text-emerald-600">${nutrition.perServing.calories.toFixed(1)}</p>
                                <p class="text-xs text-gray-500">kcal</p>
                            </div>
                            <div class="hidden md:flex gap-2 text-xs text-gray-500">
                                <span class="px-2 py-1 bg-blue-50 rounded">${nutrition.perServing.protein.toFixed(1)}g P</span>
                                <span class="px-2 py-1 bg-amber-50 rounded">${nutrition.perServing.carbs.toFixed(1)}g C</span>
                                <span class="px-2 py-1 bg-purple-50 rounded">${nutrition.perServing.fat.toFixed(1)}g F</span>
                            </div>
                            <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${index}">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
`
        }).join(" ")

        document.getElementById("logged-items-list").innerHTML = box
    }

    let btnRemove = document.querySelectorAll(".remove-foodlog-item")
    btnRemove.forEach(function (btn) {
        btn.addEventListener("click", function () {
            state.mealList.splice(btn.dataset.index, 1)
            saveMealList()
            addMeal()
            todayNutrition()
            showToast("Item removed from log")
        })
    })

    todayNutrition()
    renderWeeklyOverview()
}

export function todayNutrition() {
    let calories = document.getElementById("calories")
    let caloriesPercentage = document.getElementById("calories-percentage")
    let protein = document.getElementById("protein")
    let proteinPercentage = document.getElementById("protein-percentage")
    let carbs = document.getElementById("carbs")
    let carbsPercentage = document.getElementById("carbs-percentage")
    let fat = document.getElementById("fat")
    let fatPercentage = document.getElementById("fat-percentage")

    let caloriesBar = document.getElementById("calories-bar")
    let proteinBar = document.getElementById("protein-bar")
    let carbsBar = document.getElementById("carbs-bar")
    let fatBar = document.getElementById("fat-bar")

    let totalKcal = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0

    state.mealList.forEach(function (item) {
        totalKcal += item.nutrition.perServing.calories
        totalProtein += item.nutrition.perServing.protein
        totalCarbs += item.nutrition.perServing.carbs
        totalFat += item.nutrition.perServing.fat
    })

    calories.textContent = `${totalKcal.toFixed(0)} kcal`
    protein.textContent = `${totalProtein.toFixed(0)} g`
    carbs.textContent = `${totalCarbs.toFixed(0)} g`
    fat.textContent = `${totalFat.toFixed(0)} g`

    let calculateCaloriesPercentage = `${Math.round((totalKcal / 2000) * 100)}%`
    let calculateProteinPercentage = `${Math.round((totalProtein / 50) * 100)}%`
    let calculateCarbsPercentage = `${Math.round((totalCarbs / 250) * 100)}%`
    let calculateFatPercentage = `${Math.round((totalFat / 65) * 100)}%`

    if (totalKcal > 2000) {
        caloriesPercentage.textContent = "100%"
        caloriesBar.style.width = "100%"
        calories.classList.replace("text-emerald-600", "text-red-500")
        caloriesPercentage.classList.replace("text-emerald-600", "text-red-500")
        caloriesBar.classList.replace("bg-emerald-500", "bg-red-500")
    } else {
        calories.classList.remove("text-red-500")
        calories.classList.add("text-emerald-600")
        caloriesPercentage.classList.remove("text-red-500")
        caloriesPercentage.classList.add("text-emerald-600")
        caloriesBar.classList.remove("bg-red-500")
        caloriesBar.classList.add("bg-emerald-500")
        caloriesPercentage.textContent = calculateCaloriesPercentage
        caloriesBar.style.width = calculateCaloriesPercentage
    }

    if (totalProtein > 50) {
        proteinPercentage.textContent = "100%"
        proteinBar.style.width = "100%"
        protein.classList.replace("text-blue-600", "text-red-500")
        proteinPercentage.classList.replace("text-blue-600", "text-red-500")
        proteinBar.classList.replace("bg-blue-500", "bg-red-500")
    } else {
        protein.classList.remove("text-red-500")
        protein.classList.add("text-blue-600")
        proteinPercentage.classList.remove("text-red-500")
        proteinPercentage.classList.add("text-blue-600")
        proteinBar.classList.remove("bg-red-500")
        proteinBar.classList.add("bg-blue-500")
        proteinPercentage.textContent = calculateProteinPercentage
        proteinBar.style.width = calculateProteinPercentage
    }

    if (totalCarbs > 250) {
        carbsPercentage.textContent = "100%"
        carbsBar.style.width = "100%"
        carbs.classList.replace("text-amber-600", "text-red-500")
        carbsPercentage.classList.replace("text-amber-600", "text-red-500")
        carbsBar.classList.replace("bg-amber-500", "bg-red-500")
    } else {
        carbs.classList.remove("text-red-500")
        carbs.classList.add("text-amber-600")
        carbsPercentage.classList.remove("text-red-500")
        carbsPercentage.classList.add("text-amber-600")
        carbsBar.classList.remove("bg-red-500")
        carbsBar.classList.add("bg-amber-500")
        carbsPercentage.textContent = calculateCarbsPercentage
        carbsBar.style.width = calculateCarbsPercentage
    }

    if (totalFat > 65) {
        fatPercentage.textContent = "100%"
        fatBar.style.width = "100%"
        fat.classList.replace("text-purple-600", "text-red-500")
        fatPercentage.classList.replace("text-purple-600", "text-red-500")
        fatBar.classList.replace("bg-purple-500", "bg-red-500")
    } else {
        fat.classList.remove("text-red-500")
        fat.classList.add("text-purple-600")
        fatPercentage.classList.remove("text-red-500")
        fatPercentage.classList.add("text-purple-600")
        fatBar.classList.remove("bg-red-500")
        fatBar.classList.add("bg-purple-500")
        fatPercentage.textContent = calculateFatPercentage
        fatBar.style.width = calculateFatPercentage
    }
}

export function renderWeeklyOverview() {
    let today = new Date()

    let totalWeekKcal = 0
    let totalWeekItems = 0
    let daysOnGoal = 0
    let dailyGoal = 2000

    let weekDays = []
    for (let i = 6; i >= 0; i--) {
        let d = new Date(today)
        d.setDate(today.getDate() - i)
        weekDays.push(d)
    }

    let box = weekDays.map(function (d) {
        let isToday = d.toDateString() === today.toDateString()
        let kcal = getKcalForDate(d)
        let itemsCount = getItemsCountForDate(d)
        let dayName = d.toLocaleDateString("en-US", { weekday: "short" })

        totalWeekKcal += kcal
        totalWeekItems += itemsCount
        if (kcal > 0 && kcal <= dailyGoal) {
            daysOnGoal++
        }

        return `
            <div class="text-center ${isToday ? "bg-indigo-100 rounded-xl" : ""}">
                <p class="text-xs text-gray-500 mb-1">${dayName}</p>
                <p class="text-sm font-medium text-gray-900">${d.getDate()}</p>
                <div class="mt-2 ${kcal > 0 ? "text-gray-900" : "text-gray-300"}">
                    <p class="text-lg font-bold">${kcal}</p>
                    <p class="text-xs">kcal</p>
                    <p class="text-xs text-gray-400">${itemsCount} items</p>
                </div>
            </div>
        `
    }).join(" ")

    document.getElementById("weekly-overview").innerHTML = box

    let weeklyAverage = Math.round(totalWeekKcal / 7)

    document.getElementById("weekly-average").textContent = `${weeklyAverage} kcal`
    document.getElementById("total-items-week").textContent = `${totalWeekItems} items`
    document.getElementById("days-on-goal").textContent = `${daysOnGoal} / 7`
}