document.addEventListener('DOMContentLoaded', function () {

    // --- 1. Navigation ---
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            const text = link.textContent.trim();

            if (text.includes('الرئيسية')) link.href = 'index.html';
            else if (text.includes('الدورات')) link.href = 'courses.html';
            else if (text.includes('تسجيل الدخول')) link.href = 'login.html';
            else if (text.includes('إنشاء حساب')) link.href = 'register.html';
            else if (text.includes('تواصل معنا')) {
                link.href = 'contact.html';
                // أو بدلها:
                // link.href = '#main-footer';
            }
        });
    }

    // --- 2. Hero Buttons ---
    const primaryBtn = document.querySelector('.hero .primary-btn');
    const secondaryBtn = document.querySelector('.hero .secondary-btn');

    if (primaryBtn) {
        primaryBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'courses.html';
        });
    }

    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }

    // --- 3. Courses Filter ---
    const urlParams = new URLSearchParams(window.location.search);
    const courseType = urlParams.get('type');
    const courseContainer = document.getElementById('courseContainer');

    if (courseContainer) {
        const allCourses = document.querySelectorAll('.course');

        if (courseType) {
            allCourses.forEach(course => {
                if (course.id === courseType) {
                    course.style.display = 'block';
                } else {
                    course.style.display = 'none';
                }
            });

            courseContainer.style.display = 'flex';
            courseContainer.style.justifyContent = 'center';
        } else {
            // لو مفيش type في الرابط يظهر كل الكورسات عادي
            allCourses.forEach(course => {
                course.style.display = 'block';
            });
        }
    }

});
document.addEventListener('DOMContentLoaded', function () {

    const courseContainer = document.getElementById('courseContainer');

    if (courseContainer) {

        const urlParams = new URLSearchParams(window.location.search);
        const courseType = urlParams.get('type');
        const allCourses = document.querySelectorAll('.course');

        if (courseType) {
            allCourses.forEach(course => {
                if (course.id === courseType) {
                    course.style.display = 'block';
                } else {
                    course.style.display = 'none';
                }
            });

            courseContainer.style.display = 'flex';
            courseContainer.style.justifyContent = 'center';
        }

    }

});
// 1. تشغيل وإخفاء الفيديو فقط
window.toggleVideo = function(titleElement) {
    const video = titleElement.nextElementSibling;

    if (!video) return;

    if (video.style.display === "block") {
        video.style.display = "none";
    } else {
        video.style.display = "block";
    }
};


// 2. التحكم في عرض الكورس عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const selectedCourse = urlParams.get('course') || urlParams.get('type');
    const allCards = document.querySelectorAll('.lesson-card');

    // إظهار كل الدروس افتراضيًا
    allCards.forEach(card => card.style.display = 'block');

    // لو في كورس محدد في الرابط
    if (selectedCourse) {
        allCards.forEach(card => card.style.display = 'none');

        const targetCard = document.getElementById(selectedCourse);

        if (targetCard) {
            targetCard.style.display = 'block';
        } else {
            console.error("ID Not Found: " + selectedCourse);
        }
    }

});
const loginForm = document.getElementById('loginForm');
const userTypeSelect = document.getElementById('loginUserType');
const teacherCodeGroup = document.getElementById('teacherCodeGroup');
const teacherCodeInput = document.getElementById('teacherCode');

if (loginForm && userTypeSelect && teacherCodeGroup && teacherCodeInput) {

    // إظهار خانة الكود لو اختار مدرس
    userTypeSelect.addEventListener('change', function() {
        if (this.value === 'teacher') {
            teacherCodeGroup.style.display = 'block';
            teacherCodeInput.required = true;
        } else {
            teacherCodeGroup.style.display = 'none';
            teacherCodeInput.required = false;
        }
    });

    // التعامل مع الإرسال (Submit)
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const role = userTypeSelect.value;

        if (role === 'teacher') {
            const secretCode = "1234";

            if (teacherCodeInput.value === secretCode) {
                window.location.href = 'teacher_dashboard.html';
            } else {
                alert("كود المدرس غير صحيح!");
            }

        } else {
            window.location.href = 'student_dashboard.html';
        }
    });
}

// 1. دالة إظهار/إخفاء خانات المدرس فور اختيار النوع
function toggleTeacherFields() {
    const userType = document.getElementById('userType');
    const teacherSection = document.getElementById('teacherFields');

    if (userType && teacherSection) {
        if (userType.value === 'teacher') {
            teacherSection.style.display = 'block';
        } else {
            teacherSection.style.display = 'none';
        }
    }
}
// 2. دالة معالجة إنشاء الحساب
function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('username')?.value;
    const email = document.getElementById('email')?.value;
    const userType = document.getElementById('userType')?.value;
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    const teacherCode = document.getElementById('teacherCode')?.value;

    if (!username | !email | !userType | !password | !confirmPassword) return false;

    // التأكد من تطابق كلمة المرور
    if (password !== confirmPassword) {
        alert("كلمات المرور غير متطابقة!");
        return false;
    }

    // التحقق من رمز المدرس
    if (userType === 'teacher') {
        const secretKey = "1234";
        if (teacherCode !== secretKey) {
            alert("عذراً، يجب إدخال رمز المدرس الصحيح للتسجيل.");
            return false;
        }
    }

    localStorage.setItem('userName', username);
    localStorage.setItem('userRole', userType);

    if (userType === 'student') {
        window.location.href = 'student_dashboard.html';
    } else {
        window.location.href = 'teacher_dashboard.html';
    }

    return false;
}

// --- دوال النوافذ ---
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "block";
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

// --- حفظ التعديلات في الملف الشخصي ---
function saveProfileChanges() {

    const newNameInput = document.getElementById('newNameInput');
    const newBioInput = document.getElementById('newBioInput');
    const nameDisplay = document.getElementById('teacherNameDisplay');
    const bioDisplay = document.getElementById('teacherBioDisplay');

    if (!newNameInput | !newBioInput | !nameDisplay || !bioDisplay) return;

    const newName = newNameInput.value;
    const newBio = newBioInput.value;

    if (newName.trim() !== "") {
        nameDisplay.innerText = "أهلاً مستر " + newName + " 👨‍🏫";
    }

    if (newBio.trim() !== "") {
        bioDisplay.innerText = newBio;
    }

    closeModal('editProfileModal');

    newNameInput.value = "";
    newBioInput.value = "";
}

// --- فتح أي نافذة ---
function action(type) {
    if (type === 'video') openModal('lectureModal');
    else if (type === 'exam') openModal('examModal');
    else if (type === 'msg') openModal('messagesModal');
}

// --- إغلاق النوافذ عند الضغط خارجها ---
window.onclick = function(event) {
    const modals = ['editProfileModal', 'examModal', 'lectureModal', 'messagesModal'];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (modal && event.target === modal) {
            modal.style.display = "none";
        }
    });
}

// --- إدارة الكورس ---
function manageCourse(courseName) {

    const courseMap = {
        'مقدمة في HTML': 'web-design',
        'أساسيات CSS': 'web-design',
        'تصميم مواقع الويب': 'web-design',
        'أساسيات JavaScript': 'web-design',
        'التسويق الالكتروني': 'marketing',
        'تحليل البيانات': 'data-analysis',
        'التصميم ثلاثي الابعاد': '3d',
        'ICDL': 'icdl',
        'مقدمة في قواعد البيانات': 'programming'
    };

    const courseId = courseMap[courseName] || "";

    window.location.href = courseId
        ? "lessons.html?id=" + courseId
        : "lessons.html";
}
document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. عرض اسم الطالب ---
    var nameDisplay = document.getElementById('studentNameDisplay');
    if (nameDisplay) {
        var storedName = localStorage.getItem('userName');
        nameDisplay.innerText = "مرحبًا يا " + (storedName || "بطل") + " 👋";
    }

    // --- 2. حساب التقدم الدراسي تلقائياً ---
    var rows = document.querySelectorAll('tbody tr');
    var completedCount = 0;

    rows.forEach(function(row) {
        var statusCell = row.querySelector('.status');
        if (statusCell && statusCell.innerText.includes('مكتمل')) {
            completedCount++;
        }
    });

    if (rows.length > 0) {
        var percent = Math.round((completedCount / rows.length) * 100);

        var bar = document.getElementById('progressBar');
        var text = document.getElementById('progressText');

        if (bar) bar.style.width = percent + "%";
        if (text) text.innerText = percent + "% مكتمل ✅";
    }

    // --- 3. برمجة الأزرار ---
    rows.forEach(function(row) {
        var btn = row.querySelector('.btn');
        var courseNameElement = row.querySelector('.course-name');

        if (!btn || !courseNameElement) return;

        btn.addEventListener('click', function() {

            var courseName = courseNameElement.innerText.trim();
            var id = "";

            if (courseName.includes("برمجة")) id = "programming";
            else if (courseName.includes("ويب")) id = "web-design";
            else if (courseName.includes("موبايل")) id = "mobile-apps";
            else if (courseName.includes("جرافيك")) id = "graphic";
            else if (courseName.includes("محاسبة")) id = "accounting";
            else if (courseName.includes("تسويق")) id = "marketing";
            else if (courseName.includes("بيانات")) id = "data-analysis";
            else if (courseName.includes("ثلاثي")) id = "3d";
            else if (courseName.includes("ICDL")) id = "icdl";
            else id = "general";

            var btnText = btn.innerText.trim();

            if (btnText.includes("ابدأ الآن")) {
                window.location.href = "courses.html?type=" + id;
            } 
            else if (btnText.includes("تابع التعلم")) {
                window.location.href = "lessons.html?course=" + id;
            }
            else if (btnText.includes("النتيجة")) {
                window.location.href = "results.html?course=" + id;
            }
        });
    });

});
document.addEventListener('DOMContentLoaded', function() {

    // 1. قراءة الـ ID المبعوث من الرابط (URL Query Parameter)
    var urlParams = new URLSearchParams(window.location.search);
    var selectedCourse = urlParams.get('course'); // بياخد القيمة اللي بعد كلمة course=

    // 2. الوصول لكل كروت النتائج في الصفحة
    var resultCards = document.querySelectorAll('.result-card');

    // 3. تنفيذ الفلترة (Filtering)
    if (selectedCourse) {
        var isFound = false;

        resultCards.forEach(function(card) {
            if (card.id === selectedCourse) {
                card.style.display = 'block'; // إظهار الكارت
                isFound = true;
            } else {
                card.style.display = 'none'; // إخفاء أي كارت تاني
            }
        });

        // لو الـ ID المبعوث مش موجود أصلاً في الصفحة
        if (!isFound) {
            console.warn("تنبيه: الكورس المطلوب غير موجود، سيتم عرض جميع النتائج.");
            showAllCards(resultCards);
        }
    } else {
        // لو مفيش فلترة، عرض كل الكروت
        showAllCards(resultCards);
    }

    // دالة مساعدة لإظهار كل الكروت لو مفيش فلترة
    function showAllCards(cards) {
        cards.forEach(function(card) {
            card.style.display = 'block';
        });
    }

});
document.addEventListener("DOMContentLoaded", function () {
    const startButtons = document.querySelectorAll(".start-exam-btn");
    const examSection = document.getElementById("exam-section");
    const examTitle = document.getElementById("exam-title");
    const examContainer = document.querySelector(".exam-container");
    const backBtn = document.getElementById("back-btn");
    const submitBtn = document.getElementById("submit-exam-btn");
    const viewResultBtn = document.getElementById("view-result-btn");

    let currentExamId = null;

    const correctAnswers = {
        "exam-programming": { q1:"int", q2:"cin", q3:"cout", q4:"float", q5:"return", q6:"true", q7:"false", q8:"false", q9:"true", q10:"true" },
        "exam-web": { q1:"a", q2:"b", q3:"a", q4:"a", q5:"a", q6:"true", q7:"true", q8:"false", q9:"true", q10:"true" },
        "exam-mobile": { q1:"a", q2:"b", q3:"a", q4:"a", q5:"a", q6:"true", q7:"false", q8:"true", q9:"true", q10:"true" },
        "exam-graphic": { q1:"a", q2:"a", q3:"a", q4:"a", q5:"a", q6:"true", q7:"false", q8:"true", q9:"true", q10:"true" },
        "exam-finance": { q1:"a", q2:"b", q3:"b", q4:"a", q5:"a", q6:"true", q7:"true", q8:"false", q9:"true", q10:"false" },
        "exam-digital-marketing": { q1:"a", q2:"a", q3:"a", q4:"a", q5:"a", q6:"true", q7:"false", q8:"false", q9:"true", q10:"true" },
        "exam-data-analysis": { q1:"a", q2:"a", q3:"a", q4:"a", q5:"a", q6:"true", q7:"true", q8:"false", q9:"false", q10:"true" },
        "exam-3d": { q1:"a", q2:"a", q3:"a", q4:"a", q5:"a", q6:"true", q7:"false", q8:"true", q9:"false", q10:"false" },
        "exam-icdl": { q1:"a", q2:"a", q3:"a", q4:"a", q5:"a", q6:"true", q7:"false", q8:"true", q9:"false", q10:"true" }
    };

    function calculateGrade(percent) {
        if (percent >= 85) return "ممتاز ⭐️";
        if (percent >= 75) return "جيد جداً 👍";
        if (percent >= 65) return "جيد";
        if (percent >= 50) return "مقبول";
        return "راسب";
    }

    function correctExam(examId) {
        const examBox = document.getElementById(examId);
        const answers = correctAnswers[examId];
        let score = 0;
        let total = Object.keys(answers).length;

        for (let q in answers) {
            // التصحيح هنا: استخدام الكوتيشن الصحيح والنقطتين للـ :checked
            const selected = examBox.querySelector('input[name="' + q + '"]:checked');
            console.log("السؤال: " + q + " | إجابة المستخدم: " + (selected ? selected.value : 'لم يختار') + " | الإجابة الصحيحة في الكود: " + answers[q]);
            if (selected && selected.value === answers[q]) {
                score++;
            }
        }

        const percent = Math.round((score / total) * 100);
        const grade = calculateGrade(percent);

        localStorage.setItem("user_score", percent + "%");
        localStorage.setItem("user_grade", grade);
    }

    // إخفاء كل الصناديق في البداية (تعمل فقط لو العناصر موجودة في الصفحة)
    const allExams = document.querySelectorAll(".exam-box");
    if(allExams) allExams.forEach(exam => { exam.style.display = "none"; });

    startButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const course = this.dataset.course;
            examTitle.textContent = "امتحان مادة: " + course;
            examContainer.style.display = "none";
            examSection.style.display = "block";

            allExams.forEach(exam => { exam.style.display = "none"; });

            const examIdMap = {
                "أساسيات البرمجة": "exam-programming",
                "تصميم مواقع الويب": "exam-web",
                "تطوير تطبيقات الموبايل": "exam-mobile",
                "تصميم الجرافيك": "exam-graphic",
                "المحاسبة المالية": "exam-finance",
                "التسويق الالكتروني": "exam-digital-marketing",
                "تحليل البيانات": "exam-data-analysis",
                "التصميم ثلاثي الابعاد": "exam-3d",
                "ICDL": "exam-icdl"
            };
            currentExamId = examIdMap[course];
            const targetExam = document.getElementById(currentExamId);
            if (targetExam) {
                targetExam.style.display = "block";
                examSection.scrollIntoView({ behavior: "smooth" });
            } else {
                alert("الامتحان غير متاح حالياً");
            }
        });
    });

    if (submitBtn) {
        submitBtn.addEventListener("click", function () {
            if (!currentExamId) return;
            correctExam(currentExamId);
            const currentCourse = examTitle.textContent.replace("امتحان مادة: ", "").trim();
            localStorage.setItem("user_course", currentCourse);

            alert("تم تسليم الامتحان بنجاح!");
            examSection.style.display = "none";
            if (viewResultBtn) viewResultBtn.style.display = "inline-block";
        });
    }

    if (viewResultBtn) {
        viewResultBtn.addEventListener("click", function () {
            window.location.href = "results.html";
        });
    }

    // منطق صفحة النتائج (يعمل عند تحميل صفحة results.html)
    if (window.location.pathname.includes("results.html")) {
        const lastExam = localStorage.getItem("user_course");
        const score = localStorage.getItem("user_score");
        const grade = localStorage.getItem("user_grade");
        const allCards = document.querySelectorAll(".result-card");

        if (lastExam && allCards.length > 0) {
            allCards.forEach(card => card.style.display = "none");

            const nameToIdMap = {
                "أساسيات البرمجة": "programming",
                "تصميم مواقع الويب": "web-design",
                "تطوير تطبيقات الموبايل": "mobile-apps",
                "تصميم الجرافيك": "graphic-design",
                "المحاسبة المالية": "accounting",
                "التسويق الالكتروني": "marketing",
                "تحليل البيانات": "data-analysis",
                "التصميم ثلاثي الابعاد": "3d",
                "ICDL": "icdl"
            };

            const targetId = nameToIdMap[lastExam];
            const targetCard = document.getElementById(targetId);

            if (targetCard) {
                targetCard.style.display = "block";
                targetCard.querySelector(".score").textContent = "الدرجة: " + score;
                targetCard.querySelector(".grade").textContent = "التقدير: " + grade;
            }
        }
    }
});
// الانتظار حتى يتم تحميل الصفحة بالكامل
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); // منع إعادة تحميل الصفحة

        // أخذ القيم من الحقول
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // التحقق من أن الحقول ليست فارغة
        if (name === ""  | email === "" |  message === "") {
            alert("من فضلك املأ جميع الحقول.");
            return;
        }

        // التحقق من صحة البريد الإلكتروني بشكل بسيط
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("من فضلك أدخل بريد إلكتروني صالح.");
            return;
        }

        // لو كل حاجة تمام
        // هنا ممكن تضيف كود لإرسال البيانات للسيرفر (AJAX أو API)
        // حالياً هنكتفي برسالة نجاح
        alert("تم إرسال رسالتك بنجاح. سنرد عليك قريبًا!");

        // إعادة تعيين النموذج بعد الإرسال
        contactForm.reset();
    });
});