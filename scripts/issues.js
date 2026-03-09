const api = "https://phi-lab-server.vercel.app/api/v1/lab/issues"

const container = document.getElementById("issuesContainer")
const spinner = document.getElementById("spinner")
const issueCount = document.getElementById("issueCount")

let allIssues = []

/* ---------------- LOAD ALL ISSUES ---------------- */

async function loadIssues() {

    spinner.classList.remove("hidden")

    const res = await fetch(api)
    const data = await res.json()

    allIssues = data.data || []

    displayIssues(allIssues)

    spinner.classList.add("hidden")

}

/* ---------------- DISPLAY CARDS ---------------- */

function displayIssues(issues) {

    container.innerHTML = ""

    issueCount.innerText = issues.length

    issues.forEach(issue => {

        const card = document.createElement("div")

        card.className =
            "bg-white rounded-xl shadow border-t-4 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer overflow-hidden"

        /* -------- STATUS BORDER -------- */

        if (issue.status === "open") {
            card.classList.add("border-green-500")
        }
        else {
            card.classList.add("border-purple-500")
        }

        /* -------- PRIORITY BADGE -------- */

        let priorityBadge = ""

        if (issue.priority === "high") {
            priorityBadge =
                `<span class="bg-red-100 text-red-500 px-4 py-1 rounded-full text-xs font-semibold uppercase">
                HIGH
                 </span>`
        }
        else if (issue.priority === "medium") {
            priorityBadge =
                `<span class="bg-yellow-100 text-yellow-600 px-4 py-1 rounded-full text-xs font-semibold uppercase">
                MEDIUM
                </span>`
        }
        else {
            priorityBadge =
                `<span class="bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-xs font-semibold uppercase">
                LOW
                 </span>`
        }

        /* -------- LABEL BADGES -------- */

        let badges = ""

        const labels = issue.labels || []

        labels.forEach(label => {

            const l = label.toLowerCase()

            if (l === "bug") {
                badges += `
            <span class="border border-red-300 bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs uppercase">
            <i class="fa-solid fa-bug"></i> BUG
            </span>`
            }

            if (l === "help wanted") {
                badges += `
            <span class="border border-yellow-600 bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs uppercase">
            <i class="fa-solid fa-life-ring"></i> HELP WANTED
            </span>`
            }

            if (l === "enhancement") {
                badges += `
            <span class="border border-green-400 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs uppercase">
            <i class="fa-solid fa-arrow-up-right-dots"></i> ENHANCEMENT
            </span>`
            }

        })

        /* -------- CARD HTML -------- */

        card.innerHTML = `

        <div class="p-5">

        <div class="flex justify-between items-start mb-4">

        ${issue.status === "open" ? `
        <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
        <img src="./assets/Open-Status.png" alt="" />
        </div>
        ` : `
        <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
        <img src="./assets/Closed-Status.png" alt="" />
        </div>
        `}


        ${priorityBadge}

        </div>

        <h3 class="font-semibold text-lg mb-2">
        ${issue.title}
        </h3>

        <p class="text-sm text-gray-500 mb-4 line-clamp-2">
        ${issue.description}
        </p>

        <div class="flex flex-wrap gap-2">

        ${badges}

        </div>  

        </div>

        <div class="border-t px-5 py-4 text-sm text-gray-500">

        <p>#${issue.id} by ${issue.author}</p>

        <p>${new Date(issue.createdAt).toLocaleDateString()}</p>

        </div>

        `

        card.addEventListener("click", () => openModal(issue.id))

        container.appendChild(card)

    })

}

/* ---------------- OPEN MODAL ---------------- */

async function openModal(id) {

    const res = await fetch(
        `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
    )

    const data = await res.json()

    const issue = data.data

    /* ---------- TITLE + DESCRIPTION ---------- */

    document.getElementById("modalTitle").innerText = issue.title
    document.getElementById("modalDesc").innerText = issue.description

    /* ---------- AUTHOR + DATE ---------- */

    document.getElementById("modalAuthor").innerText = issue.author
    document.getElementById("modalAuthorTop").innerText = issue.author
    document.getElementById("modalDate").innerText =
        new Date(issue.createdAt).toLocaleDateString()

    /* ---------- STATUS BADGE ---------- */

    const status = document.getElementById("modalStatus")

    status.innerText = issue.status.toUpperCase()

    if (issue.status === "open") {
        status.className =
            "px-3 py-1 rounded-full text-white text-xs font-semibold bg-green-500"
    }
    else {
        status.className =
            "px-3 py-1 rounded-full text-white text-xs font-semibold bg-purple-500"
    }

    /* ---------- PRIORITY BADGE ---------- */

    const priority = document.getElementById("modalPriority")

    priority.innerText = issue.priority.toUpperCase()

    if (issue.priority === "high") {
        priority.className =
            "px-3 py-1 rounded-full text-white text-xs bg-red-500"
    }

    if (issue.priority === "medium") {
        priority.className =
            "px-3 py-1 rounded-full text-white text-xs bg-yellow-500"
    }

    if (issue.priority === "low") {
        priority.className =
            "px-3 py-1 rounded-full text-white text-xs bg-gray-500"
    }

    /* ---------- LABEL BADGES ---------- */

    const labelsContainer = document.getElementById("modalLabels")
    labelsContainer.innerHTML = ""

    const labels = issue.labels || []

    labels.forEach(label => {

        const l = label.toLowerCase()

        if (l === "bug") {
            labelsContainer.innerHTML += `
        <span class="flex items-center gap-1 border border-red-300 text-red-500 bg-red-100 px-3 py-1 rounded-full text-xs uppercase">
        <i class="fa-solid fa-bug"></i> BUG
        </span>`
        }

        if (l === "help wanted") {
            labelsContainer.innerHTML += `
        <span class="flex items-center gap-1 border border-yellow-400 text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-xs uppercase">
        <i class="fa-solid fa-life-ring"></i> HELP WANTED
        </span>`
        }

        if (l === "enhancement") {
            labelsContainer.innerHTML += `
        <span class="flex items-center gap-1 border bg-green-100 border-green-400 text-green-600 px-3 py-1 rounded-full text-xs uppercase">
        <i class="fa-solid fa-arrow-up-right-dots"></i> ENHANCEMENT
        </span>`
        }

    })

    /* ---------- OPEN MODAL call ---------- */

    issueModal.showModal()

}

/* ---------------- OPEN FILTER ---------------- */

function loadOpen() {

    const openIssues = allIssues.filter(
        issue => issue.status === "open"
    )

    displayIssues(openIssues)

}

/* ---------------- CLOSED FILTER ---------------- */

function loadClosed() {

    const closedIssues = allIssues.filter(
        issue => issue.status === "closed"
    )

    displayIssues(closedIssues)

}

/* ---------------- SEARCH ---------------- */

async function searchIssue() {

    spinner.classList.remove("hidden")

    const text = document.getElementById("searchInput").value

    const res = await fetch(
        `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
    )

    const data = await res.json()

    displayIssues(data.data || [])

    spinner.classList.add("hidden")

}

/* ---------------- START ---------------- */

loadIssues()



