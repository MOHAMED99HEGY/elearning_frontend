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
            // لو الـ ID بتاع الكارت مطابق للي مبعوث في الرابط
            if (card.id === selectedCourse) {
                card.style.display = 'block'; // إظهار الكارت
                isFound = true;
            } else {
                card.style.display = 'none'; // إخفاء أي كارت تاني
            }
        });

        // اختياري: لو الـ ID المبعوث مش موجود أصلاً في الصفحة
        if (!isFound) {
            console.warn("تنبيه: الكورس المطلوب غير موجود، سيتم عرض جميع النتائج.");
            showAllCards(resultCards);
        }
    }

    // دالة مساعدة لإظهار كل الكروت لو مفيش فلترة
    function showAllCards(cards) {
        cards.forEach(function(card) {
            card.style.display = 'block';
        });
    }
});

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
        if (statusCell && statusCell.innerText.indexOf('مكتمل') !== -1) {
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

    // --- 3. برمجة الأزرار (التحويل الذكي الشامل) ---
    rows.forEach(function(row) {
        var btn = row.querySelector('.btn');
        var courseNameElement = row.querySelector('.course-name');

        if (btn && courseNameElement) {
            btn.onclick = function() {
                var courseName = courseNameElement.innerText.trim();
                var id = "";

                // خريطة الربط الشاملة لكل الكورسات بناءً على الأسماء في جدولك
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

                // التحويل بناءً على نص الزرار
                if (btnText.indexOf("ابدأ الآن") !== -1) {
                    window.location.href = "courses.html?type=" + id;
                } 
                else if (btnText.indexOf("تابع التعلم") !== -1) {
                    window.location.href = "lessons.html?course=" + id;
                }
                else if (btnText.indexOf("النتيجة") !== -1) {
                    window.location.href = "results.html?course=" + id;
                }
            };
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. تنفيذ طلبات الربط (Navigation) ---
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const text = link.textContent.trim();
        
        if (text.includes('الرئيسية')) link.href = 'index.html';
        else if (text.includes('الدورات')) link.href = 'courses.html';
        else if (text.includes('تسجيل الدخول')) link.href = 'login.html';
        else if (text.includes('إنشاء حساب')) link.href = 'register.html';
        
        // تعديل "تواصل معنا"
        else if (text.includes('تواصل معنا')) {
            // لو عندك صفحة منفصلة فعل السطر ده:
            link.href = 'contact.html'; 
            
            // أما لو عايز ينزل لآخر الصفحة (Footer) فعل السطر ده بدل اللي فوق:
            // link.href = '#main-footer'; 
        }
    });

    // --- 2. أزرار الـ Hero ---
    const primaryBtn = document.querySelector('.hero .primary-btn'); // تصفح الكورسات
    const secondaryBtn = document.querySelector('.hero .secondary-btn'); // ابدأ الآن

    if (primaryBtn) {
        primaryBtn.onclick = (e) => {
            e.preventDefault();
            window.location.href = 'courses.html';
        };
    }
    if (secondaryBtn) {
        secondaryBtn.onclick = (e) => {
            e.preventDefault();
            window.location.href = 'register.html';
        };
    }

    // --- 3. الفلترة في صفحة الكورسات ---
    const urlParams = new URLSearchParams(window.location.search);
    const courseType = urlParams.get('type');
    const courseContainer = document.getElementById('courseContainer');

    if (courseType && courseContainer) {
        const allCourses = document.querySelectorAll('.course');
        allCourses.forEach(course => {
            if (course.id !== courseType) {
                course.style.display = 'none';
            } else {
                course.style.display = 'block';
            }
        });
        
        courseContainer.style.display = 'flex';
        courseContainer.style.justifyContent = 'center';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. فلترة الكورسات لصفحة courses.html
    const urlParams = new URLSearchParams(window.location.search);
    const courseType = urlParams.get('type');
    const courseContainer = document.getElementById('courseContainer');

    if (courseType && courseContainer) {
        const allCourses = document.querySelectorAll('.course');
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

    // 2. ربط أزرار الـ Hero في صفحة index.html
    const primaryBtn = document.querySelector('.hero .primary-btn');
    const secondaryBtn = document.querySelector('.hero .secondary-btn');

    if (primaryBtn) primaryBtn.addEventListener('click', () => window.location.href = 'courses.html');
    if (secondaryBtn) secondaryBtn.addEventListener('click', () => window.location.href = 'register.html');

    // 3. تأكيد إرسال رسالة تواصل معنا
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            alert('تم استلام رسالتك بنجاح! شكراً لتواصلك مع تنوير.');
            contactForm.reset(); 
        });
    }
});
// 1. وظيفة تشغيل الفيديو وفتح القفل
window.toggleVideo = function(titleElement) {
    const video = titleElement.nextElementSibling;
    const lessonCard = titleElement.closest('.lesson-card');
    if (!video || !lessonCard) return;

    // إظهار الفيديو
    if (video.style.display === "none" || video.style.display === "") {
        video.style.display = "block";
        
        // فتح الدرس التالي
        const allTitles = Array.from(lessonCard.querySelectorAll('.lesson-title'));
        const currentIndex = allTitles.indexOf(titleElement);
        
        if (currentIndex !== -1 && currentIndex + 1 < allTitles.length) {
            const nextTitle = allTitles[currentIndex + 1];
            nextTitle.style.opacity = "1";
            nextTitle.style.pointerEvents = "auto";
            
            const lockIcon = nextTitle.querySelector('.fa-lock');
            if (lockIcon) lockIcon.remove();
            
            // حفظ التقدم
            localStorage.setItem("progress_" + lessonCard.id, currentIndex + 1);
        }
    } else {
        video.style.display = "none";
    }
};

// 2. السيطرة على الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCourse = urlParams.get('course') || urlParams.get('type');
    const allCards = document.querySelectorAll('.lesson-card');

    // إخفاء كل شيء في البداية
    allCards.forEach(card => card.style.display = 'none');

    if (selectedCourse) {
        const targetCard = document.getElementById(selectedCourse);
        if (targetCard) {
            targetCard.style.display = 'block';
            
            // استرجاع التقدم والأقفال
            const savedProgress = parseInt(localStorage.getItem("progress_" + selectedCourse)) || 0;
            const titles = targetCard.querySelectorAll('.lesson-title');
            
            titles.forEach((title, index) => {
                if (index <= savedProgress) {
                    title.style.opacity = "1";
                    title.style.pointerEvents = "auto";
                    const lock = title.querySelector('.fa-lock');
                    if (lock) lock.remove();
                } else {
                    title.style.opacity = "0.5";
                    title.style.pointerEvents = "none";
                    if (!title.querySelector('.fa-lock')) {
                        title.innerHTML += ' <i class="fas fa-lock"></i>';
                    }
                }
            });
        } else {
            // لو الـ ID مش موجود، هيطبع لك في الـ Console عشان تعرف الغلط فين
            console.error("ID Not Found: " + selectedCourse);
        }
    }
});
const loginForm = document.getElementById('loginForm');
const userTypeSelect = document.getElementById('loginUserType');
const teacherCodeGroup = document.getElementById('teacherCodeGroup');
const teacherCodeInput = document.getElementById('teacherCode');

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
    const email = document.getElementById('loginEmail').value;

    if (role === 'teacher') {
        const secretCode = "1234"; // الكود السري الخاص بك
        if (teacherCodeInput.value === secretCode) {
            // تم حذف رسالة التنبيه والتحويل مباشرة
            window.location.href = 'teacher_dashboard.html';
        } else {
            alert("كود المدرس غير صحيح!"); // سيبنا دي عشان يعرف لو غلط في الكود
        }
    } else {
        // لو طالب يدخل علطول بدون أي رسائل
        window.location.href = 'student_dashboard.html';
    }
});
// 1. دالة إظهار/إخفاء خانات المدرس فور اختيار النوع
function toggleTeacherFields() {
    const userType = document.getElementById('userType').value;
    const teacherSection = document.getElementById('teacherFields');
    
    if (userType === 'teacher') {
        teacherSection.style.display = 'block';
    } else {
        teacherSection.style.display = 'none';
    }
}

// 2. دالة معالجة إنشاء الحساب
function handleRegister(event) {
    event.preventDefault(); // منع تحديث الصفحة

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const userType = document.getElementById('userType').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const teacherCode = document.getElementById('teacherCode').value;

    // التأكد من تطابق كلمة المرور
    if (password !== confirmPassword) {
        alert("كلمات المرور غير متطابقة!");
        return false;
    }

    // التحقق من رمز المدرس إذا كان النوع مدرس
    if (userType === 'teacher') {
        const secretKey = "1234"; // الكود السري الخاص بك
        if (teacherCode !== secretKey) {
            alert("عذراً، يجب إدخال رمز المدرس الصحيح للتسجيل.");
            return false;
        }
    }

    // حفظ البيانات في المتصفح (مهمة لعرض الاسم في الداشبورد لاحقاً)
    localStorage.setItem('userName', username);
    localStorage.setItem('userRole', userType);

    // التحويل التلقائي حسب النوع بدون رسائل تنبيه مزعجة
    if (userType === 'student') {
        window.location.href = 'student_dashboard.html';
    } else {
        window.location.href = 'teacher_dashboard.html';
    }

    return false;
}
// --- دوال النوافذ (Modal) ---
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
    const newName = document.getElementById('newNameInput').value;
    const newBio = document.getElementById('newBioInput').value;

    const nameDisplay = document.getElementById('teacherNameDisplay');
    const bioDisplay = document.getElementById('teacherBioDisplay');

    if (newName.trim() !== "") nameDisplay.innerText = "أهلاً مستر " + newName + " 👨‍🏫";
    if (newBio.trim() !== "") bioDisplay.innerText = newBio;

    closeModal('editProfileModal');

    // تنظيف الخانات
    document.getElementById('newNameInput').value = "";
    document.getElementById('newBioInput').value = "";
}

// --- فتح أي نافذة حسب النوع ---
function action(type) {
    if (type === 'video') openModal('lectureModal');
    else if (type === 'exam') openModal('examModal');
    else if (type === 'msg') openModal('messagesModal');
}

// --- إغلاق النوافذ عند الضغط خارج الصندوق ---
window.onclick = function(event) {
    const modals = ['editProfileModal', 'examModal', 'lectureModal', 'messagesModal'];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (modal && event.target == modal) modal.style.display = "none";
    });
}

// --- إدارة الكورس (التحويل لصفحة الدروس) ---
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
    window.location.href = courseId ? "lessons.html?id=" + courseId : "lessons.html";
}
