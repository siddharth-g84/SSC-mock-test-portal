/* ============LOGIN FUNCTIONS============= */

function togglePassword() {
    let pass = document.getElementById("password");
    if (!pass) return;
    pass.type =
        pass.type === "password"
            ? "text"
            : "password";
}

function login() {

    let regNo =
        document.getElementById("regNo").value;
    let password =
        document.getElementById("password").value;

    if (
        regNo === "10475478961" &&
        password === "Siddharth@123"
    ) {

        localStorage.setItem(
            "candidateName",
            "Siddharth"
        );

        localStorage.setItem(
            "registrationNumber",
            regNo
        );

        window.location.href =
            "instructions.html";

    } else {

        document.getElementById(
            "error"
        ).innerHTML =
            "Invalid Registration Number or Password";
    }
}

/* ============INSTRUCTION PAGE============= */

function startExam() {
    let agree =
        document.getElementById("agree");
    if (!agree) return;
    if (!agree.checked) {
        alert(
            "Please accept the instructions first."
        );
        return;
    }
    localStorage.removeItem("answers");
    localStorage.removeItem("reviewed");
    window.location.href =
        "test.html";
}

/* ============TEST VARIABLES============= */

let currentQuestion = 0;

let answers =
    JSON.parse(
        localStorage.getItem("answers")
    ) || [];

let reviewed =
    JSON.parse(
        localStorage.getItem("reviewed")
    ) || [];

/* ============LOAD QUESTION============= */

function loadQuestion() {

    if (
        typeof questions === "undefined"
    ) return;

    let q =
        questions[currentQuestion];

    document.getElementById(
        "questionNo"
    ).innerText =
        currentQuestion + 1;

    document.getElementById(
        "questionText"
    ).innerText =
        q.question;

    document.getElementById(
        "subjectName"
    ).innerText =
        q.subject;

    document.getElementById(
        "option0"
    ).innerText =
        q.options[0];

    document.getElementById(
        "option1"
    ).innerText =
        q.options[1];

    document.getElementById(
        "option2"
    ).innerText =
        q.options[2];

    document.getElementById(
        "option3"
    ).innerText =
        q.options[3];

    let radios =
        document.getElementsByName(
            "option"
        );

    radios.forEach(
        radio =>
            (radio.checked = false)
    );

    if (
        answers[currentQuestion] !=
        null
    ) {

        radios[
            answers[currentQuestion]
        ].checked = true;
    }

    updateProgressBar();
}

/* =============SAVE ANSWER============ */

function saveCurrentAnswer() {

    let selected =
        document.querySelector(
            'input[name="option"]:checked'
        );

    if (selected) {

        answers[currentQuestion] =
            Number(selected.value);

        localStorage.setItem(
            "answers",
            JSON.stringify(answers)
        );
    }
}

/* ============SAVE AND NEXT============= */

function saveAndNext() {
    saveCurrentAnswer();
    if (
        currentQuestion <
        questions.length - 1
    ) {
        currentQuestion++;
        loadQuestion();
    }
    updatePalette();
}

/* ============PREVIOUS============= */

function previousQuestion() {
    saveCurrentAnswer();
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

/* =============MARK FOR REVIEW============ */

function markForReview() {
    reviewed[currentQuestion] = true;
    localStorage.setItem(
        "reviewed",
        JSON.stringify(reviewed)
    );

    updatePalette();
    alert(
        "Question marked for review."
    );
}

/* ============QUESTION PALETTE============= */

function createPalette() {

    let palette =
        document.getElementById(
            "palette"
        );

    if (!palette) return;

    palette.innerHTML = "";

    for (
        let i = 0;
        i < questions.length;
        i++
    ) {

        let btn =
            document.createElement(
                "button"
            );

        btn.innerText = i + 1;
        btn.classList.add(
            "not-visited"
        );

        btn.onclick = function () {
            saveCurrentAnswer();
            currentQuestion = i;
            loadQuestion();
            updatePalette();
        };

        palette.appendChild(btn);
    }

    updatePalette();
}

/* ============UPDATE PALETTE============= */

function updatePalette() {

    let paletteButtons =
        document.querySelectorAll(
            "#palette button"
        );

    paletteButtons.forEach(
        (btn, index) => {
            btn.className = "";

            if (
                reviewed[index]
            ) {

                btn.classList.add(
                    "review"
                );
            }

            else if (
                answers[index] != null
            ) {

                btn.classList.add(
                    "answered"
                );
            }

            else {

                btn.classList.add(
                    "notanswered"
                );
            }
        }
    );
}

/* ============PROGRESS BAR============= */

function updateProgressBar() {
    let progress =
        document.getElementById(
            "progressBar"
        );

    if (!progress) return;

    let percentage =
        ((currentQuestion + 1) /
            questions.length) *
        100;

    progress.style.width =
        percentage + "%";
}

/* ============TIMER============= */

function startTimer() {
    let timerElement =
        document.getElementById(
            "timer"
        );
    if (!timerElement) return;
    let totalTime =
        30 * 60;
    let timer =
        setInterval(() => {
            let minutes =
                Math.floor(
                    totalTime / 60
                );
            let seconds =
                totalTime % 60;
            timerElement.innerText =
                `${minutes}:${seconds
                    .toString()
                    .padStart(2, "0")}`;
            if (
                totalTime === 300
            ) {
                alert(
                    "Only 5 Minutes Left!"
                );
            }
            if (
                totalTime <= 0
            ) {
                clearInterval(
                    timer
                );
                alert(
                    "Time Over! Test Submitted."
                );
                submitTest();
            }
            totalTime--;
        }, 1000);
}

/* ============SUBMIT TEST============= */

function submitTest() {
    saveCurrentAnswer();
    let confirmSubmit =
        confirm(
            "Are you sure you want to submit the test?"
        );
    if (!confirmSubmit)
        return;
    calculateResult();
    window.location.href =
        "result.html";
}

/* ============RESULT CALCULATION============= */

function calculateResult() {
    let correct = 0;
    let wrong = 0;
    let attempted = 0;
    let subjectStats = {
        Reasoning: { correct: 0, wrong: 0, marks: 0 },
        Mathematics: { correct: 0, wrong: 0, marks: 0 },
        GK: { correct: 0, wrong: 0, marks: 0 },
        Hindi: { correct: 0, wrong: 0, marks: 0 }
    };
    for (let i = 0; i < questions.length; i++) {
        if (answers[i] != null) {
            attempted++;
            let subject = questions[i].subject;

            if (answers[i] === questions[i].answer) {
                correct++;
                subjectStats[subject].correct++;
                subjectStats[subject].marks += 2;

            } else {
                wrong++;
                subjectStats[subject].wrong++;
                subjectStats[subject].marks -= 0.25;
            }
        }
    }
    let unattempted = questions.length - attempted;
    let marks = (correct * 2) - (wrong * 0.25);
    let percentage =
        ((marks / 160) * 100).toFixed(2);
    let result = {
        attempted,
        unattempted,
        correct,
        wrong,
        marks: marks.toFixed(2),
        percentage,
        subjectStats
    };
    localStorage.setItem(
        "result",
        JSON.stringify(result)
    );
}

/* =============RESULT PAGE DATA============ */

function loadResult() {
    let result =
        JSON.parse(
            localStorage.getItem(
                "result"
            )
        );
    if (!result) return;
    document.getElementById(
        "attempted"
    ).innerText =
        result.attempted;
    document.getElementById(
        "unattempted"
    ).innerText =
        result.unattempted;
    document.getElementById(
        "correct"
    ).innerText =
        result.correct;
    document.getElementById(
        "wrong"
    ).innerText =
        result.wrong;
    document.getElementById(
        "marks"
    ).innerText =
        result.marks;
    document.getElementById(
        "percentage"
    ).innerText =
        result.percentage + "%";
    let status =
        document.getElementById(
            "statusText"
        );
    let p =
        Number(
            result.percentage
        );
    if (p >= 90)
        status.innerText =
            "EXCELLENT";
    else if (p >= 75)
        status.innerText =
            "VERY GOOD";
    else if (p >= 60)
        status.innerText =
            "GOOD";
    else if (p >= 40)
        status.innerText =
            "AVERAGE";
    else
        status.innerText =
            "NEEDS IMPROVEMENT";

    document.getElementById("reasoningCorrect").innerText =
        result.subjectStats.Reasoning.correct;

    document.getElementById("reasoningWrong").innerText =
        result.subjectStats.Reasoning.wrong;

    document.getElementById("reasoningMarks").innerText =
        result.subjectStats.Reasoning.marks.toFixed(2);

    document.getElementById("mathsCorrect").innerText =
        result.subjectStats.Mathematics.correct;

    document.getElementById("mathsWrong").innerText =
        result.subjectStats.Mathematics.wrong;

    document.getElementById("mathsMarks").innerText =
        result.subjectStats.Mathematics.marks.toFixed(2);

    document.getElementById("gkCorrect").innerText =
        result.subjectStats.GK.correct;

    document.getElementById("gkWrong").innerText =
        result.subjectStats.GK.wrong;

    document.getElementById("gkMarks").innerText =
        result.subjectStats.GK.marks.toFixed(2);

    document.getElementById("hindiCorrect").innerText =
        result.subjectStats.Hindi.correct;

    document.getElementById("hindiWrong").innerText =
        result.subjectStats.Hindi.wrong;

    document.getElementById("hindiMarks").innerText =
        result.subjectStats.Hindi.marks.toFixed(2);
}

/* ===========PAGE AUTO DETECTION============ */

window.onload = function () {
    if (
        document.getElementById(
            "questionText"
        )
    ) {
        createPalette();
        loadQuestion();
        startTimer();
    }

    if (
        document.getElementById(
            "attempted"
        )
    ) {
        loadResult();
    }
};

function generateCaptcha() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";

    for (let i = 0; i < 5; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    document.getElementById("captchaText").innerText = captcha;
}
generateCaptcha();