const repo = 'Yazan2500/archigraphtest'; // ضع هنا اسم المستودع الخاص بك
const token = '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'; // ضع هنا رمز GitHub الخاص بك

let dropdowns = [];

// جلب القوائم من GitHub
async function fetchDropdowns() {
    const response = await fetch(`https://raw.githubusercontent.com/${repo}/main/dropdowns.json`);
    const data = await response.json();
    dropdowns = data;
    renderDropdowns();
}

// عرض القوائم في الصفحة الرئيسية
function renderDropdowns() {
    const container = document.getElementById('dropdown-container');
    container.innerHTML = '';
    dropdowns.forEach(menu => {
        const div = document.createElement('div');
        div.className = 'dropdown-menu';
        div.innerHTML = `<i class="${menu.icon}"></i><br>${menu.name}`;
        container.appendChild(div);
    });
}

document.getElementById('admin-button').addEventListener('click', () => {
    window.location.href = 'admin.html';
});

fetchDropdowns();
