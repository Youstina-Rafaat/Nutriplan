export let state = {
    dataMeals: [],
    currentFilterLabel: "",
    currentView: "grid",

    mealList: JSON.parse(localStorage.getItem("mealList")) || [],
    dailyHistory: JSON.parse(localStorage.getItem("dailyHistory")) || {},
    weekStartDate: localStorage.getItem("weekStartDate") || new Date().toDateString(),

    currentMeal: null,
    currentNutrition: null,
    currentValue: 1,

    allProducts: [],
    selectedGrade: ""
}

if (!localStorage.getItem("weekStartDate")) {
    localStorage.setItem("weekStartDate", state.weekStartDate)
}

export function saveMealList() {
    localStorage.setItem("mealList", JSON.stringify(state.mealList))
}

export function saveDailyHistory() {
    localStorage.setItem("dailyHistory", JSON.stringify(state.dailyHistory))
}

export function saveWeekStartDate() {
    localStorage.setItem("weekStartDate", state.weekStartDate)
}

export function checkNewDay() {
    let lastActiveDate = localStorage.getItem("lastActiveDate")
    let today = new Date().toDateString()

    if (lastActiveDate && lastActiveDate !== today) {
        let totalKcal = 0
        state.mealList.forEach(function (item) {
            totalKcal += item.nutrition.perServing.calories
        })
        state.dailyHistory[lastActiveDate] = {
            calories: Math.round(totalKcal),
            items: state.mealList.length
        }
        saveDailyHistory()

        state.mealList = []
        saveMealList()

        let start = new Date(state.weekStartDate)
        let now = new Date(today)
        let diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24))
        if (diffDays >= 7) {
            state.dailyHistory = {}
            saveDailyHistory()
            state.weekStartDate = today
            saveWeekStartDate()
        }
    }

    localStorage.setItem("lastActiveDate", today)
}

export function getKcalForDate(date) {
    let dateStr = date.toDateString()
    let today = new Date().toDateString()
    if (dateStr === today) {
        let total = 0
        for (let i = 0; i < state.mealList.length; i++) {
            total += state.mealList[i].nutrition.perServing.calories
        }
        return Math.round(total)
    }
    let entry = state.dailyHistory[dateStr]
    if (!entry) return 0
    return typeof entry === "object" ? entry.calories : entry
}

export function getItemsCountForDate(date) {
    let dateStr = date.toDateString()
    let today = new Date().toDateString()
    if (dateStr === today) {
        return state.mealList.length
    }
    let entry = state.dailyHistory[dateStr]
    if (!entry || typeof entry !== "object") return 0
    return entry.items || 0
}