// ========================================
// 상품 목록 페이지 (list.js)
// ========================================

// 현재 필터/정렬 상태
let currentCategory = "전체";
let currentSort = "name";
let currentSearch = "";

// DOM 요소들
const productListEl = document.querySelector(".product-list");
const categoryBtns = document.querySelectorAll(".cate-btn");
const sortSelect = document.querySelector(".sort-select");
const searchInput = document.querySelector(".search-input");

// ========================================
// 상품 카드 HTML 생성
// ========================================
function createProductCard(product) {
  return `
    <article class="product-card" data-id="${product.id}">
      <a href="detail.html?id=${product.id}" class="prd-link">
        <div class="img-box">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="info-box">
          <p class="category">${product.category}</p>
          <h3 class="name">${product.name}</h3>
          <div class="price-cart">
            <p class="price">${formatPrice(product.price)}</p>
            <button class="btn-add-cart" data-id="${product.id}">
              <i class="fa-solid fa-cart-plus"></i>
            </button>
          </div>
        </div>
      </a>
    </article>
  `;
}

// ========================================
// 상품 목록 렌더링
// ========================================
function renderProducts() {
  // 1. 카테고리 필터링
  let filtered = getProductsByCategory(currentCategory);

  // 2. 검색어 필터링
  if (currentSearch) {
    const searchLower = currentSearch.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
    );
  }

  // 3. 정렬
  filtered = sortProducts(filtered, currentSort);

  // 4. 렌더링
  if (filtered.length === 0) {
    productListEl.innerHTML = `
      <div class="empty-result" style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: #888;">
        <i class="fa-solid fa-box-open" style="font-size: 48px; margin-bottom: 20px; display: block;"></i>
        <p>검색 결과가 없습니다.</p>
      </div>
    `;
  } else {
    productListEl.innerHTML = filtered.map(createProductCard).join("");
  }

  // 5. 장바구니 버튼 이벤트 재등록
  attachCartButtonEvents();
}

// ========================================
// 정렬 함수
// ========================================
function sortProducts(productList, sortType) {
  const sorted = [...productList];

  switch (sortType) {
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
      break;
    case "price_asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sorted.sort((a, b) => b.id - a.id);
      break;
  }

  return sorted;
}

// ========================================
// 카테고리 버튼 이벤트
// ========================================
categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // 활성 상태 변경
    categoryBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // 카테고리 업데이트 및 렌더링
    currentCategory = btn.textContent;
    renderProducts();
  });
});

// ========================================
// 정렬 셀렉트 이벤트
// ========================================
sortSelect.addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderProducts();
});

// ========================================
// 검색 입력 이벤트 (debounce 적용)
// ========================================
let searchTimeout;
searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentSearch = e.target.value.trim();
    renderProducts();
  }, 300);
});

// ========================================
// 장바구니 버튼 이벤트
// ========================================
function attachCartButtonEvents() {
  const cartBtns = document.querySelectorAll(".btn-add-cart");

  cartBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); // 링크 이동 방지
      e.stopPropagation();

      const productId = parseInt(btn.dataset.id);
      addToCart(productId, 1);

      // 시각적 피드백
      showToast("장바구니에 추가되었습니다!");

      // 버튼 애니메이션
      btn.style.transform = "scale(1.2)";
      setTimeout(() => {
        btn.style.transform = "scale(1)";
      }, 200);
    });
  });
}

// ========================================
// 토스트 메시지
// ========================================
function showToast(message) {
  // 기존 토스트 제거
  const existingToast = document.querySelector(".toast-message");
  if (existingToast) existingToast.remove();

  // 새 토스트 생성
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: #fff;
    padding: 15px 30px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    z-index: 1000;
    animation: toastIn 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
  `;

  document.body.appendChild(toast);

  // 3초 후 제거
  setTimeout(() => {
    toast.style.animation = "toastOut 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// 토스트 애니메이션 스타일 추가
const toastStyle = document.createElement("style");
toastStyle.textContent = `
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes toastOut {
    from { opacity: 1; transform: translateX(-50%) translateY(0); }
    to { opacity: 0; transform: translateX(-50%) translateY(20px); }
  }
`;
document.head.appendChild(toastStyle);

// ========================================
// 초기화
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});
