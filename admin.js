const repo = 'Yazan2500/archigraphtest'; // ضع هنا اسم المستودع الخاص بك
const token = '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'; // ضع هنا رمز GitHub الخاص بك

let dropdowns = [];

// جلب القوائم من GitHub
async function fetchDropdowns() {
    const response = await fetch(`https://raw.githubusercontent.com/${repo}/main/dropdowns.json`);
    const data = await response.json();
    dropdowns = data;
    renderAdminPanel();
}

// عرض القوائم في صفحة الإدارة
function renderAdminPanel() {
    const container = document.getElementById('current-menus');
    container.innerHTML = '';
    dropdowns.forEach((menu, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <span>${menu.name} (${menu.icon})</span>
            <button onclick="deleteMenu(${index})">حذف</button>
        `;
        container.appendChild(div);
    });
}

// حذف قائمة
function deleteMenu(index) {
    dropdowns.splice(index, 1);
    saveDropdowns();
}

// حفظ القوائم في GitHub
async function saveDropdowns() {
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/dropdowns.json`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update dropdowns',
            content: btoa(JSON.stringify(dropdowns, null, 2)),
            sha: await getFileSha() // الحصول على الـ SHA الحالي للملف
        })
    });

    if (response.ok) {
        alert('تم حفظ القوائم بنجاح!');
        fetchDropdowns();
    } else {
        alert('حدث خطأ أثناء حفظ القوائم.');
    }
}

// الحصول على SHA للملف الحالي
async function getFileSha() {
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/dropdowns.json`, {
        headers: {
            'Authorization': `token ${token}`
        }
    });
    const data = await response.json();
    return data.sha;
}

document.getElementById('login-button').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin123') {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
});

document.getElementById('add-menu-button').addEventListener('click', () => {
    const name = document.getElementById('new-menu-name').value;
    const icon = document.getElementById('new-menu-icon').value;

    if (name && icon) {
        dropdowns.push({ name, icon });
        saveDropdowns();
    } else {
        alert('الرجاء إدخال اسم ورمز القائمة');
    }
});

fetchDropdowns();
