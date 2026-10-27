
let currentDFA = null;

function buildDFA() {
    const question = document.getElementById("questionInput")
        .value.toLowerCase().trim();

    const message = document.getElementById("questionResult");
    const rule = document.getElementById("selectedRule");
    const table = document.getElementById("transitionTable");

    currentDFA = null;
    document.getElementById("result").textContent = "";

    if (!question) {
        message.textContent = "Please enter a DFA question first.";
        return;
    }

    // DFA 1: Strings ending in 0
    if (
        question.includes("ending in 0") ||
        question.includes("ends in 0") ||
        question.includes("end with 0")
    ) {
        currentDFA = {
            type: "ends0",
            description: "Accept binary strings ending in 0",
            rows: [
                ["→ *q0", "q0", "q1"],
                ["q1", "q0", "q1"]
            ]
        };
    }

    // DFA 2: Strings ending in 1
    else if (
        question.includes("ending in 1") ||
        question.includes("ends in 1") ||
        question.includes("end with 1")
    ) {
        currentDFA = {
            type: "ends1",
            description: "Accept binary strings ending in 1",
            rows: [
                ["→ q0", "q0", "q1"],
                ["*q1", "q0", "q1"]
            ]
        };
    }

    // DFA 3: Strings starting with 1
    else if (
        question.includes("starting with 1") ||
        question.includes("starts with 1") ||
        question.includes("beginning with 1")
    ) {
        currentDFA = {
            type: "starts1",
            description: "Accept binary strings starting with 1",
            rows: [
                ["→ q0", "qd", "q1"],
                ["*q1", "q0", "q1"],
                ["qd (dead)", "qd", "qd"]
            ]
        };
    }

    // DFA 4: Strings containing 101
    else if (
        question.includes("containing 101") ||
        question.includes("contains 101")
    ) {
        currentDFA = {
            type: "contains101",
            description: "Accept binary strings containing 101",
            rows: [
                ["→ q0", "q0", "q1"],
                ["q1", "q2", "q1"],
                ["q2", "q0", "q3"],
                ["*q3", "q3", "q3"]
            ]
        };
    }

    // DFA 5: Even number of 1s
    else if (
        question.includes("even number of 1") ||
        question.includes("even count of 1")
    ) {
        currentDFA = {
            type: "even1",
            description: "Accept binary strings with an even number of 1s",
            rows: [
                ["→ *q0", "q0", "q1"],
                ["q1", "q1", "q0"]
            ]
        };
    }

    if (!currentDFA) {
        message.textContent =
            "Sorry, this question pattern is not supported yet. Try one of the examples below.";
        rule.textContent = "No DFA generated.";
        table.innerHTML = "";
        return;
    }

    message.textContent = "DFA generated successfully!";
    message.style.color = "green";
    rule.textContent = currentDFA.description;

    let html = `
        <table>
            <thead>
                <tr>
                    <th>State</th>
                    <th>Input 0</th>
                    <th>Input 1</th>
                </tr>
            </thead>
            <tbody>
    `;

    currentDFA.rows.forEach(row => {
        html += `
            <tr>
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
            </tr>
        `;
    });

    html += "</tbody></table>";
    table.innerHTML = html;
}

function checkString() {
    const input = document.getElementById("binaryInput").value.trim();
    const result = document.getElementById("result");

    if (!currentDFA) {
        result.textContent = "Please generate a supported DFA question first.";
        result.style.color = "#d97706";
        return;
    }

    if (!input) {
        result.textContent = "Please enter a binary string.";
        result.style.color = "#d97706";
        return;
    }

    if (!/^[01]+$/.test(input)) {
        result.textContent = "Invalid input! Use only 0 and 1.";
        result.style.color = "#dc2626";
        return;
    }

    let accepted = false;

    switch (currentDFA.type) {
        case "ends0":
            accepted = input.endsWith("0");
            break;

        case "ends1":
            accepted = input.endsWith("1");
            break;

        case "starts1":
            accepted = input.startsWith("1");
            break;

        case "contains101":
            accepted = input.includes("101");
            break;

        case "even1":
            accepted = (input.split("1").length - 1) % 2 === 0;
            break;
    }

    if (accepted) {
        result.textContent = "Accepted! The string belongs to this DFA's language.";
        result.style.color = "#16a34a";
    } else {
        result.textContent = "Rejected! The string does not belong to this DFA's language.";
        result.style.color = "#dc2626";
    }
}
