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
// ĐỊA CHỈ SERVER SINGAPORE (Link Swagger của bạn)


async function loadCategoriesSidebar() {
    const container = document.getElementById("categoryListBody");
    if (!container) return;

    try {
        // Gọi API lấy danh mục
        const response = await fetch(`${API_BASE}/api/categories`);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const categories = await response.json();
        container.innerHTML = ""; // Xóa chữ "Đang tải..."

        // --- 1. CHÈN "TẤT CẢ SẢN PHẨM" VÀO ĐẦU DANH SÁCH ---
        const allItem = document.createElement("li");
        allItem.className = "list-group-item list-group-item-action fw-bold text-primary";
        allItem.innerHTML = '<i class="bi bi-grid-fill me-2"></i> Tất cả sản phẩm';
        allItem.onclick = () => {
            filterByCategory(null); // Hàm lọc hiện tất cả link
            closeSidebar();
        };
        container.appendChild(allItem);

        // --- 2. ĐỔ DANH MỤC TỪ API VÀO BẢNG TRƯỢT ---
        categories.forEach(cat => {
            const li = document.createElement("li");
            li.className = "list-group-item list-group-item-action";
            li.innerHTML = `<i class="bi bi-chevron-right me-2"></i> ${cat.name}`;
            
            li.onclick = () => {
                console.log("Đã chọn danh mục:", cat.name);
                filterByCategory(cat.id); // Gọi hàm lọc theo ID
                closeSidebar();
            };
            container.appendChild(li);
        });

    } catch (error) {
        console.error("Error loading categories:", error);
        container.innerHTML = `<li class="list-group-item text-danger text-center py-3">Không thể tải dữ liệu</li>`;
    }
}

// Hàm đóng bảng sau khi click chọn
function closeSidebar() {
    const offcanvasEl = document.getElementById('sidebarCategories');
    const instance = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (instance) instance.hide();
}

// Gọi hàm khi trang web sẵn sàng
document.addEventListener("DOMContentLoaded", loadCategoriesSidebar);