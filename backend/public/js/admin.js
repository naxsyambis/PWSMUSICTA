let token = '';

async function adminLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  token = data.token;

  loadUsers();
}

async function loadUsers() {
  const res = await fetch('/admin/users', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  const users = await res.json();
  const ul = document.getElementById('users');
  ul.innerHTML = '';

  users.forEach(u => {
    const li = document.createElement('li');
    li.textContent = `${u.username} - ${u.email}`;
    ul.appendChild(li);
  });
}
