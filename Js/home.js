// ======================
// CONFIG
// ======================
const API_BASE = "https://shopee-link-resell-be.onrender.com"; 

// ======================
// LOAD CATEGORIES (MENU)
// ======================
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();

    const menu = document.getElementById("categoryMenu");
    menu.innerHTML = "";

    data.forEach(c => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a class="dropdown-item" href="#" data-slug="${c.slug}">
          ${c.name}
        </a>`;
      menu.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading categories:", err);
  }
}
loadCategories();

// ===========================================
// HIỂN THỊ SẢN PHẨM
const linkList = document.getElementById("linkList");
let allLinks = []; // lưu toàn bộ link để sort/filter

function formatPrice(price) {
  return "₫" + price.toLocaleString("vi-VN");
}

function renderLinks(links) {
  linkList.innerHTML = "";

  links.forEach(item => {
    let badgeHTML = "";

    if (item.badge === "favorite") {
      badgeHTML = `<span class="link-badge badge-favorite">Yêu thích</span>`;
    } 
    else if (item.badge === "mall") {
      badgeHTML = `<span class="link-badge badge-mall">Mall</span>`;
    }

    linkList.innerHTML += `
      <div class="col-lg-4 col-md-6 col-sm-12">
        <a href="${item.shopeeUrl}" target="_blank" class="link-card">

          <div class="link-image">
            <img src="${item.imageUrl}" alt="${item.title}">
            ${badgeHTML}
          </div>

          <div class="link-body">
            <div class="link-title">${item.title}</div>
            

            <div class="link-meta">
              <span class="link-price">${formatPrice(item.price)}</span>
              <span class="link-sold">Đã bán ${Math.floor(item.sold / 1000)}k+</span>
            </div>
          </div>

        </a>
      </div>
    `;
  });
}


// ===========================================
// FETCH DỮ LIỆU TỪ API
async function loadLinks() {
  try {
    const response = await fetch(`${API_BASE}/api/links`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    allLinks = data; // lưu toàn bộ link
    renderLinks(allLinks);
  } catch (error) {
    console.error("Error fetching links:", error);
    linkList.innerHTML = `<p>Không thể tải dữ liệu sản phẩm.</p>`;
  }
}

// ===========================================
// SORT / FILTER BUTTONS
const filterButtons = document.querySelectorAll(".filter-btn");
let priceAsc = true;

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const type = btn.dataset.sort;

    if (type === "price") {
      priceAsc = !priceAsc;
      btn.querySelector(".price-icon").innerText = priceAsc ? "↑" : "↓";
      sortLinks("price");
    } else if (type === "sold") {
      sortLinks("sold");
    }
  });
});

function sortLinks(type) {
  let sorted = [...allLinks];

  if (type === "price") {
    sorted.sort((a, b) => priceAsc ? a.price - b.price : b.price - a.price);
  } else if (type === "sold") {
    sorted.sort((a, b) => b.sold - a.sold);
  }

  renderLinks(sorted);
}

// ===========================================
// Gọi loadLinks khi trang load xong
document.addEventListener("DOMContentLoaded", loadLinks);




// =============================================
// off canvas
async function loadCategories() {
  const categoryMenu = document.getElementById("categoryMenu");
  try {
    const response = await fetch(`${API_BASE}/api/categories`); // Đảm bảo đúng endpoint của bạn
    const categories = await response.json();

    categoryMenu.innerHTML = ""; // Xóa chữ "Đang tải..."

    categories.forEach(cat => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = cat.name;
      
      // Thêm sự kiện lọc nếu bạn muốn
      li.onclick = () => {
        console.log("Lọc theo danh mục:", cat.id);
        // Sau khi bấm xong có thể tự đóng menu:
        const instance = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasCategory'));
        instance.hide();
        
        // Gọi hàm lọc sản phẩm của bạn ở đây...
        filterByCategory(cat.id); 
      };

      categoryMenu.appendChild(li);
    });
  } catch (error) {
    console.error("Lỗi tải danh mục:", error);
    categoryMenu.innerHTML = `<li class="list-group-item text-danger">Lỗi tải dữ liệu</li>`;
  }
}

// Gọi hàm này khi trang web tải xong
document.addEventListener("DOMContentLoaded", loadCategories);