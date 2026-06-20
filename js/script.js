const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTknLuAQMRny3tAEIeX1dUmO2emLnWHAnealMqFoBgrvrHA2SW5tBq7H7VZchv2CLZ4ynZdkM7Z1GmC/pub?gid=0&single=true&output=csv";

async function loadOverallTable() {

    const tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = `
<tr>
    <td colspan="5" class="loading-cell">
        Loading standings
    </td>
</tr>
`;


    try {

        const response = await fetch(CSV_URL);
        const csvText = await response.text();

        const rows = csvText.trim().split("\n");

        const data = rows.slice(1).map(row => {

            const cols = row.split(",");

            return {
                club: cols[0],
                w1: Number(cols[1]),
                w2: Number(cols[2]),
                total: Number(cols[3])
            };

        });

        data.sort((a, b) => b.total - a.total);

        const maxScore = Math.max(...data.map(club => club.total));

        // document.getElementById("leaderClub").textContent =
        //     data[0].club;

        // document.getElementById("totalClubs").textContent =
        //     data.length;

        const leaderClub = document.getElementById("leaderClub");
        const totalClubs = document.getElementById("totalClubs");

        if (leaderClub) {
            leaderClub.textContent = data[0].club;
        }

        if (totalClubs) {
            totalClubs.textContent = data.length;
        }

        const tableBody = document.getElementById("tableBody");


        tableBody.innerHTML = "";

        data.forEach((club, index) => {

            let rank;

            if (index === 0) rank = "🥇";
            else if (index === 1) rank = "🥈";
            else if (index === 2) rank = "🥉";
            else rank = index + 1;

            tableBody.innerHTML += `
            <tr>
                <td>${rank}</td>
                <td>${club.club}</td>
                <td>${club.w1}</td>
                
                
                <td>
        <div class="score-wrapper">

            <div class="progress-bar">
                <div
                    class="progress-fill"
                    style="width:${Math.round((club.total / maxScore) * 100)}%">
                </div>
            </div>

            <span class="score-text">
                ${club.total}
            </span>

        </div>
    </td>
            </tr>
        `;

        });

    } catch (error) {

        console.error("Error loading Google Sheet:", error);

    }

}

document.addEventListener("DOMContentLoaded", () => {

    loadOverallTable();
    const overallBtn = document.getElementById("overallBtn");
const week1Btn = document.getElementById("week1Btn");

const leaderboard = document.querySelector(".leaderboard-section");
const week1Content = document.getElementById("week1Content");

week1Btn.addEventListener("click", () => {

    leaderboard.style.display = "none";
    week1Content.style.display = "block";

    overallBtn.classList.remove("active");
    week1Btn.classList.add("active");

});

overallBtn.addEventListener("click", () => {

    leaderboard.style.display = "block";
    week1Content.style.display = "none";

    week1Btn.classList.remove("active");
    overallBtn.classList.add("active");

});

    const footer = document.querySelector(".footer");

    // if (footer) {

    //     const today = new Date();

    //     footer.innerHTML += `
    //     <p>Updated: ${today.toLocaleDateString("en-IN")}</p>
    // `;
    // }


});
