// ========================================
// 장바구니 페이지 (cart.js)
// ========================================

const cartListEl = document.querySelector(".cart-list");
const summaryEl = document.querySelector(".cart-summary");
const orderBtn = document.querySelector(".btn-order");

// ========================================
// 장바구니 아이템 HTML 생성
// ========================================
function createCartItemHTML(cartItem) {
  const product = getProductById(cartItem.productId);
  if (!product) return "";

  const itemTotal = product.price * cartItem.quantity;

  return `
    <article class="cart-item" data-id="${product.id}">
      <div class="ci-img">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <div class="ci-info">
        <div class="ci-top">
          <div class="ci-txt">
            <h3 class="ci-name">${product.name}</h3>
            <p class="ci-cate">${product.category}</p>
          </div>
          <button class="btn-remove" data-id="${product.id}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>

        <div class="ci-bottom">
          <div class="qty-control sm">
            <button class="qty-btn minus" data-id="${product.id}">
              <i class="fa-solid fa-minus"></i>
            </button>
            <input type="number" value="${cartItem.quantity}" class="qty-input" readonly data-id="${product.id}">
            <button class="qty-btn plus" data-id="${product.id}" data-stock="${product.stock}">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
          <p class="ci-price">${formatPrice(itemTotal)}</p>
        </div>
      </div>
    </article>
  `;
}

// ========================================
// 빈 장바구니 HTML
// ========================================
function createEmptyCartHTML() {
  return `
    <div class="empty-cart" style="text-align: center; padding: 80px 20px; background: #fff; border: 1px solid #e9ecef; border-radius: 10px;">
      <i class="fa-solid fa-cart-shopping" style="font-size: 64px; color: #ddd; margin-bottom: 20px;"></i>
      <h3 style="font-size: 20px; color: #333; margin-bottom: 10px;">장바구니가 비어있습니다</h3>
      <p style="color: #888; margin-bottom: 30px;">원하는 상품을 장바구니에 담아보세요!</p>
      <a href="list.html" style="display: inline-block; padding: 14px 40px; background: #0056b3; color: #fff; border-radius: 6px; font-weight: 700;">
        쇼핑하러 가기
      </a>
    </div>
  `;
}

// ========================================
// 장바구니 렌더링
// ========================================
function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    // 빈 장바구니
    cartListEl.innerHTML = createEmptyCartHTML();
    summaryEl.style.display = "none";
    return;
  }

  // 장바구니 아이템들 렌더링
  summaryEl.style.display = "block";
  cartListEl.innerHTML = cart.map(createCartItemHTML).join("");

  // 요약 정보 업데이트
  updateSummary();

  // 이벤트 등록
  attachCartEvents();
}

// ========================================
// 주문 요약 업데이트
// ========================================
function updateSummary() {
  const cart = getCart();
  const totalPrice = getCartTotalPrice();
  const totalCount = getCartTotalCount();
  const shippingFee = totalPrice >= 50000 ? 0 : 3000; // 5만원 이상 무료배송
  const finalPrice = totalPrice + shippingFee;

  // 상품 금액
  const priceRows = document.querySelectorAll(".summary-row");
  priceRows[0].innerHTML = `
    <span>상품 금액 (${totalCount}개)</span>
    <span>${formatPrice(totalPrice)}</span>
  `;

  // 배송비
  priceRows[1].innerHTML = `
    <span>배송비</span>
    <span>${shippingFee === 0 ? "무료" : formatPrice(shippingFee)}</span>
  `;

  // 총 결제금액
  document.querySelector(".total-price").textContent = formatPrice(finalPrice);
}

// ========================================
// 장바구니 이벤트 등록
// ========================================
function attachCartEvents() {
  // 삭제 버튼
  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = parseInt(btn.dataset.id);
      showDeleteConfirmModal(productId);
    });
  });

  // 수량 감소
  document.querySelectorAll(".cart-item .qty-btn.minus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = parseInt(btn.dataset.id);
      const input = document.querySelector(
        `.cart-item .qty-input[data-id="${productId}"]`
      );
      const currentQty = parseInt(input.value);

      if (currentQty > 1) {
        updateCartQuantity(productId, currentQty - 1);
        renderCart();
      } else {
        showDeleteConfirmModal(productId);
      }
    });
  });

  // 수량 증가
  document.querySelectorAll(".cart-item .qty-btn.plus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = parseInt(btn.dataset.id);
      const stock = parseInt(btn.dataset.stock);
      const input = document.querySelector(
        `.cart-item .qty-input[data-id="${productId}"]`
      );
      const currentQty = parseInt(input.value);

      if (currentQty < stock) {
        updateCartQuantity(productId, currentQty + 1);
        renderCart();
      } else {
        showToast(`최대 ${stock}개까지 구매 가능합니다.`);
      }
    });
  });
}

// ========================================
// 삭제 확인 모달
// ========================================
function showDeleteConfirmModal(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const existingModal = document.querySelector(".delete-modal-overlay");
  if (existingModal) existingModal.remove();

  const modalHTML = `
    <div class="delete-modal-overlay modal-overlay show">
      <div class="modal-box">
        <div class="modal-icon warning">
          <i class="fa-solid fa-trash-can"></i>
        </div>
        <h3 class="modal-title">상품 삭제</h3>
        <p class="modal-msg">
          "${product.name}"을(를)<br>장바구니에서 삭제하시겠습니까?
        </p>
        <div class="modal-btns">
          <button class="btn-modal-cancel" id="btn-cancel-delete">취소</button>
          <button class="btn-modal-confirm" id="btn-confirm-delete" style="background: #ff4d4f;">삭제</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // 취소
  document.getElementById("btn-cancel-delete").addEventListener("click", () => {
    document.querySelector(".delete-modal-overlay").remove();
  });

  // 삭제 확인
  document.getElementById("btn-confirm-delete").addEventListener("click", () => {
    removeFromCart(productId);
    document.querySelector(".delete-modal-overlay").remove();
    renderCart();
    showToast("상품이 삭제되었습니다.");
  });

  // 오버레이 클릭시 닫기
  document.querySelector(".delete-modal-overlay").addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-modal-overlay")) {
      e.target.remove();
    }
  });
}

// ========================================
// 주문하기 버튼
// ========================================
orderBtn.addEventListener("click", () => {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("장바구니가 비어있습니다.");
    return;
  }

  // 주문 완료 모달 표시 (실제로는 결제 페이지로 이동)
  showOrderCompleteModal();
});

function showOrderCompleteModal() {
  const totalPrice = getCartTotalPrice();
  const shippingFee = totalPrice >= 50000 ? 0 : 3000;
  const finalPrice = totalPrice + shippingFee;

  const modalHTML = `
    <div class="order-modal-overlay modal-overlay show">
      <div class="modal-box">
        <div class="modal-icon success">
          <i class="fa-solid fa-check"></i>
        </div>
        <h3 class="modal-title">주문이 완료되었습니다!</h3>
        <p class="modal-msg">
          결제 금액: ${formatPrice(finalPrice)}<br>
          <small style="color: #888;">(데모 버전입니다)</small>
        </p>
        <div class="modal-btns">
          <button class="btn-modal-confirm" id="btn-order-confirm">확인</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  document.getElementById("btn-order-confirm").addEventListener("click", () => {
    // 장바구니 비우기
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    document.querySelector(".order-modal-overlay").remove();
    renderCart();
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
  renderCart();
});
