// ========================================
// 메인 페이지 (main.js)
// ========================================

// 모달 요소
const modalOverlay = document.getElementById("modal-container");
const btnModalClose = document.getElementById("btn-modal-close");
const btnModalAction = document.getElementById("btn-modal-action");

// ========================================
// 모달 열기/닫기
// ========================================
function openModal() {
  modalOverlay.classList.add("show");
}

function closeModal() {
  modalOverlay.classList.remove("show");
}

// 모달 버튼 이벤트
btnModalClose.addEventListener("click", closeModal);
btnModalAction.addEventListener("click", () => {
  window.location.href = "login.html";
});

// 오버레이 클릭시 닫기
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// ESC 키로 모달 닫기
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("show")) {
    closeModal();
  }
});

// ========================================
// 장바구니 버튼 이벤트
// ========================================
function attachCartButtonEvents() {
  const cartBtns = document.querySelectorAll(".btn-add-cart");

  cartBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      // 상품 카드에서 ID 추출 (링크의 href에서)
      const card = btn.closest(".product-card");
      const link = card.querySelector(".prd-link");
      const href = link.getAttribute("href");
      const productId = parseInt(new URLSearchParams(href.split("?")[1]).get("id"));

      if (productId) {
        addToCart(productId, 1);
        showToast("장바구니에 추가되었습니다!");

        // 버튼 애니메이션
        btn.style.transform = "scale(1.2)";
        setTimeout(() => {
          btn.style.transform = "scale(1)";
        }, 200);
      }
    });
  });
}

// ========================================
// 헤더 장바구니 아이콘 클릭
// ========================================
const headerCartBtn = document.getElementById("btn-cart");
headerCartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "cart.html";
});

// ========================================
// 토스트 메시지
// ========================================
function showToast(message) {
  const existingToast = document.querySelector(".toast-message");
  if (existingToast) existingToast.remove();

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
  attachCartButtonEvents();
});
