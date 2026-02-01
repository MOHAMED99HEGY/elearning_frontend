// script.js

// ------------------- صفحة إنشاء الحساب -------------------
const registerForm = document.getElementById('registerForm');
const userTypeSelect = document.getElementById('userType');
const teacherFields = document.querySelector('.teacher-fields');

if (registerForm) {
    // إظهار حقول المدرس عند اختيار "مدرس"
    userTypeSelect.addEventListener('change', function() {
        if (this.value === 'teacher') {
            teacherFields.style.display = 'block';
        } else {
            teacherFields.style.display = 'none';
        }
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const userType = userTypeSelect.value;
        const qualification = document.getElementById('qualification') ? document.getElementById('qualification').value.trim() : '';
        const teacherCode = document.getElementById('teacherCode') ? document.getElementById('teacherCode').value.trim() : '';

        // تحقق من كلمة المرور
        if (password !== confirmPassword) {
            alert('كلمة المرور وتأكيدها غير متطابقين');
            return;
        }

        // تحقق من رمز المدرس إذا كان النوع مدرس
        if (userType === 'teacher' && teacherCode !== '1234') {
            alert('رمز المدرس غير صحيح');
            return;
        }

        // حفظ البيانات في localStorage
        const user = { username, email, password, userType, qualification };
        localStorage.setItem(email, JSON.stringify(user));

        alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        window.location.href = 'login.html';
    });
}

// ------------------- صفحة تسجيل الدخول -------------------
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const userType = document.getElementById('loginUserType').value;

        const storedUser = localStorage.getItem(email);

        if (!storedUser) {
            alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            return;
        }

        const user = JSON.parse(storedUser);

        if (user.password !== password || user.userType !== userType) {
            alert('البريد الإلكتروني أو كلمة المرور أو النوع غير صحيح');
            return;
        }

           alert("ناجح الدخول تسجيل مرحبا ${user.username}!!");
        // توجيه حسب النوع
        if (userType === 'student') {
            window.location.href = 'student-dashboard.html';
        } else if (userType === 'teacher') {
            window.location.href = 'teacher-dashboard.html';
        }
    });
}