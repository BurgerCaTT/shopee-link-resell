// const API_BASE =
//   location.hostname === "localhost"
//     ? "http://localhost:5000/api"
//     : "https://shopeelinks-api.onrender.com/api";



// ===== FADE IN EFFECT =====
window.addEventListener("load", () => {
  document.querySelectorAll(".fade-in").forEach(el => {
    setTimeout(() => el.classList.add("show"), 200);
  });
});

// ===== LOAD CATEGORIES =====
// fetch(`${API_BASE}/categories`)
//   .then(res => res.json())
//   .then(data => {
//     const menu = document.getElementById("categoryMenu");
//     const list = document.getElementById("categoryList");

//     menu.innerHTML = "";
//     list.innerHTML = "";

//     data.forEach(c => {
//       // Dropdown menu
//       const li = document.createElement("li");
//       li.innerHTML = `<a class="dropdown-item" href="category.html?slug=${c.slug}">${c.name}</a>`;
//       menu.appendChild(li);

//       // List group
//       const a = document.createElement("a");
//       a.className = "list-group-item list-group-item-action";
//       a.href = `category.html?slug=${c.slug}`;
//       a.innerText = c.name;
//       list.appendChild(a);
//     });
//   })
//   .catch(() => {
//     document.getElementById("categoryList").innerHTML =
//       "<div class='text-danger'>Không tải được danh mục</div>";
//   });
