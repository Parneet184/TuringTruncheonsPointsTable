const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTknLuAQMRny3tAEIeX1dUmO2emLnWHAnealMqFoBgrvrHA2SW5tBq7H7VZchv2CLZ4ynZdkM7Z1GmC/pub?gid=0&single=true&output=csv";

const WEEK1_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTknLuAQMRny3tAEIeX1dUmO2emLnWHAnealMqFoBgrvrHA2SW5tBq7H7VZchv2CLZ4ynZdkM7Z1GmC/pub?gid=1221063557&single=true&output=csv";


/* =========================
   HELPERS
========================= */

function getRank(index) {

    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";

    return index + 1;

}

function toggleWeek1(index) {

    const row =
        document.getElementById(`week1-${index}`);

    row.style.display =
        row.style.display === "table-row"
            ? "none"
            : "table-row";

}


/* =========================
   OVERALL TABLE
========================= */

async function loadOverallTable() {

    const tableBody =
        document.getElementById("tableBody");

    tableBody.innerHTML = `
        <tr>
            <td colspan="4" class="loading-cell">
                Loading standings
            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(CSV_URL);

        const csvText =
            await response.text();

        const rows =
            csvText.trim().split("\n");

        const data =
            rows.slice(1).map(row => {

                const cols =
                    row.split(",");

                return {

                    club: cols[0],
                    w1: Number(cols[1]),
                    w2: Number(cols[2]),
                    total: Number(cols[3])

                };

            });

        data.sort(
            (a, b) =>
                b.total - a.total
        );

        const maxScore =
            Math.max(
                ...data.map(
                    club => club.total
                )
            );

        const leagueLeader =
            document.getElementById(
                "leagueLeader"
            );

        if (leagueLeader) {

            leagueLeader.textContent =
                data[0].club;

        }

        tableBody.innerHTML = "";

        data.forEach((club, index) => {

            const rank =
                getRank(index);

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
                                    style="width:${
                                        Math.round(
                                            (club.total / maxScore) * 100
                                        )
                                    }%">
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

        console.error(
            "Overall standings failed to load:",
            error
        );

    }

}


/* =========================
   WEEK 1 TABLE
========================= */

async function loadWeek1Table() {

    const tableBody =
        document.getElementById(
            "week1TableBody"
        );

    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="loading-cell">
                Loading Week 1
            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(WEEK1_URL);

        const csvText =
            await response.text();

        const rows =
            csvText.trim().split("\n");

        const data =
            rows.slice(1).map(row => {

                const cols =
                    row.split(",");

                const consistency =
                    Number(cols[1]);

                const execution =
                    Number(cols[2]);

                const teamwork =
                    Number(cols[3]);

                const innovation =
                    Number(cols[4]);

                const participation =
                    Number(cols[5]);

                const linkedin =
                    Number(cols[6]);

                const bonus =
                    Number(cols[7]);

                const baseScore =

                    consistency +
                    execution +
                    teamwork +
                    innovation +
                    participation +
                    linkedin;

                const total =
                    baseScore + bonus;

                return {

                    club: cols[0],

                    consistency,
                    execution,
                    teamwork,
                    innovation,
                    participation,
                    linkedin,

                    bonus,

                    baseScore,

                    total

                };

            });

        data.sort(
            (a, b) =>
                b.total - a.total
        );

        /* Dashboard Winners */

        const innovationChampion =
            document.getElementById(
                "innovationChampion"
            );

        const participationChampion =
            document.getElementById(
                "participationChampion"
            );

        const innovationWinner =
            [...data].sort(
                (a, b) =>
                    b.innovation -
                    a.innovation
            )[0];

        const participationWinner =
            [...data].sort(
                (a, b) =>
                    b.participation -
                    a.participation
            )[0];

        if (innovationChampion) {

            innovationChampion.textContent =
                innovationWinner.club;

        }

        if (participationChampion) {

            participationChampion.textContent =
                participationWinner.club;

        }

        tableBody.innerHTML = "";

        data.forEach((club, index) => {

            const rank =
                getRank(index);

            tableBody.innerHTML += `

                <tr
                    class="club-row"
                    onclick="toggleWeek1('${index}')">

                    <td>${rank}</td>

                    <td>${club.club}</td>

                    <td>${club.baseScore}</td>

                    <td>+${club.bonus}</td>

                    <td>${club.total}</td>

                </tr>

                <tr
                    id="week1-${index}"
                    class="details-row">

                    <td colspan="5">

                        <table class="criteria-table">

                            <tr>
                                <td>Consistency</td>
                                <td>${club.consistency}/20</td>
                            </tr>

                            <tr>
                                <td>Activity Execution</td>
                                <td>${club.execution}/25</td>
                            </tr>

                            <tr>
                                <td>Teamwork</td>
                                <td>${club.teamwork}/15</td>
                            </tr>

                            <tr>
                                <td>Innovation</td>
                                <td>${club.innovation}/15</td>
                            </tr>

                            <tr>
                                <td>Participation</td>
                                <td>${club.participation}/15</td>
                            </tr>

                            <tr>
                                <td>LinkedIn Visibility</td>
                                <td>${club.linkedin}/10</td>
                            </tr>

                            <tr>
                                <td>Bonus</td>
                                <td>+${club.bonus}</td>
                            </tr>

                            <tr class="total-score">
                                <td>Total</td>
                                <td>${club.total}</td>
                            </tr>

                        </table>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(
            "Week 1 data failed to load:",
            error
        );

    }

}


/* =========================
   PAGE INIT
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadOverallTable();
        loadWeek1Table();

        const overallBtn =
            document.getElementById(
                "overallBtn"
            );

        const week1Btn =
            document.getElementById(
                "week1Btn"
            );

        const leaderboard =
            document.querySelector(
                ".leaderboard-section"
            );

        const week1Content =
            document.getElementById(
                "week1Content"
            );

        leaderboard.style.display =
            "block";

        week1Content.style.display =
            "none";

        week1Btn.addEventListener(
            "click",
            () => {

                leaderboard.style.display =
                    "none";

                week1Content.style.display =
                    "block";

                overallBtn.classList.remove(
                    "active"
                );

                week1Btn.classList.add(
                    "active"
                );

            }
        );

        overallBtn.addEventListener(
            "click",
            () => {

                leaderboard.style.display =
                    "block";

                week1Content.style.display =
                    "none";

                week1Btn.classList.remove(
                    "active"
                );

                overallBtn.classList.add(
                    "active"
                );

            }
        );

    }
);