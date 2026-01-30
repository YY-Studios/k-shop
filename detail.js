// ========================================
// 상품 상세 페이지 (detail.js)
// ========================================

// 현재 수량
let currentQuantity = 1;
let currentProduct = null;

// DOM 요소들
const mainImg = document.getElementById("main-img");
const categoryEl = document.querySelector(".d-cate");
const titleEl = document.querySelector(".d-title");
const priceEl = document.querySelector(".d-price");
const descEl = document.querySelector(".d-desc");
const stockEl = document.getElementById("stock-count");
const qtyInput = document.querySelector(".qty-input");
const minusBtn = document.querySelector(".qty-btn.minus");
const plusBtn = document.querySelector(".qty-btn.plus");
const cartBtn = document.querySelector(".btn-action.cart");
const buyBtn = document.querySelector(".btn-action.buy");

// ========================================
// URL에서 상품 ID 가져오기
// ========================================
function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// ========================================
// 상품 정보 렌더링
// ========================================
function renderProductDetail(product) {
  if (!product) {
    // 상품이 없으면 에러 표시
    document.querySelector(".detail-card").innerHTML = `
      <div style="text-align: center; padding: 60px; width: 100%;">
        <i class="fa-solid fa-exclamation-circle" style="font-size: 64px; color: #ddd; margin-bottom: 20px;"></i>
        <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">상품을 찾을 수 없습니다</h2>
        <p style="color: #888; margin-bottom: 30px;">요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
        <a href="list.html" style="display: inline-block; padding: 12px 30px; background: #0056b3; color: #fff; border-radius: 6px; font-weight: 700;">
          상품 목록으로 돌아가기
        </a>
      </div>
    `;
    return;
  }

  currentProduct = product;

  // 페이지 타이틀 업데이트
  document.title = `K-Shop - ${product.name}`;

  // 상품 정보 표시
  mainImg.src = product.image;
  mainImg.alt = product.name;
  categoryEl.textContent = product.category;
  titleEl.textContent = product.name;
  priceEl.textContent = formatPrice(product.price);
  descEl.textContent = product.description;
  stockEl.textContent = product.stock;

  // 재고에 따른 버튼 상태
  if (product.stock === 0) {
    cartBtn.disabled = true;
    buyBtn.disabled = true;
    cartBtn.textContent = "품절";
    buyBtn.textContent = "품절";
    cartBtn.style.background = "#ccc";
    buyBtn.style.background = "#ccc";
  }
}

// ========================================
// 수량 조절
// ========================================
function updateQuantity(delta) {
  if (!currentProduct) return;

  const newQty = currentQuantity + delta;

  // 범위 체크 (1 ~ 재고수량)
  if (newQty < 1 || newQty > currentProduct.stock) {
    if (newQty > currentProduct.stock) {
      showToast(`최대 ${currentProduct.stock}개까지 구매 가능합니다.`);
    }
    return;
  }

  currentQuantity = newQty;
  qtyInput.value = currentQuantity;
}

// 마이너스 버튼
minusBtn.addEventListener("click", () => {
  updateQuantity(-1);
});

// 플러스 버튼
plusBtn.addEventListener("click", () => {
  updateQuantity(1);
});

// ========================================
// 장바구니에 추가
// ========================================
cartBtn.addEventListener("click", () => {
  if (!currentProduct || currentProduct.stock === 0) return;

  addToCart(currentProduct.id, currentQuantity);
  showCartModal();
});

// ========================================
// 바로 구매
// ========================================
buyBtn.addEventListener("click", () => {
  if (!currentProduct || currentProduct.stock === 0) return;

  // 장바구니에 추가하고 장바구니 페이지로 이동
  addToCart(currentProduct.id, currentQuantity);
  window.location.href = "cart.html";
});

// ========================================
// 장바구니 추가 모달
// ========================================
function showCartModal() {
  // 모달이 이미 있으면 제거
  const existingModal = document.querySelector(".cart-modal-overlay");
  if (existingModal) existingModal.remove();

  const modalHTML = `
    <div class="cart-modal-overlay modal-overlay show">
      <div class="modal-box">
        <div class="modal-icon success">
          <i class="fa-solid fa-check"></i>
        </div>
        <h3 class="modal-title">장바구니에 담았습니다</h3>
        <p class="modal-msg">
          ${currentProduct.name}<br>
          수량: ${currentQuantity}개
        </p>
        <div class="modal-btns">
          <button class="btn-modal-cancel" id="btn-continue">쇼핑 계속하기</button>
          <button class="btn-modal-confirm" id="btn-go-cart">장바구니로 이동</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // 이벤트 등록
  document.getElementById("btn-continue").addEventListener("click", () => {
    document.querySelector(".cart-modal-overlay").remove();
  });

  document.getElementById("btn-go-cart").addEventListener("click", () => {
    window.location.href = "cart.html";
  });

  // 오버레이 클릭시 닫기
  document.querySelector(".cart-modal-overlay").addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-modal-overlay")) {
      e.target.remove();
    }
  });
}

// ========================================
// 토스트 메시지
// ========================================
function showToast(message) {
  const existingToast = document.querySelector(".toast-message");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerHTML = `<i class="fa-solid fa-info-circle"></i> ${message}`;
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
  const productId = getProductIdFromURL();
  const product = getProductById(productId);
  renderProductDetail(product);
});
