import { getProductById } from "./data.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const detailCard = document.querySelector(".detail-card");

async function renderDetail() {
  if (!productId || !detailCard) return;
  const prd = await getProductById(productId);
  console.log("prd", prd);
  if (!prd) {
    detailCard.innerHTML = "<p>제품을 불러올 수 없습니다.</p>";
    return;
  }
  // 데이터 바인딩: prd 객체의 값을 HTML 구조에 주입
  detailCard.innerHTML = `
    <div class="detail-img">
      <img
        src="${prd.images[0]}" 
        alt="${prd.title}"
        id="main-img"
      />
    </div>

    <div class="detail-info">
      <p class="d-cate">${prd.category}</p>
      <h2 class="d-title">${prd.title}</h2>
      <p class="d-price">$${prd.price}</p>

      <p class="d-desc">${prd.description}</p>

      <p class="d-stock">재고: <span id="stock-count">${prd.stock}</span>개</p>

      <div class="quantity-wrap">
        <p class="label">수량</p>
        <div class="qty-control">
          <button class="qty-btn minus">
            <i class="fa-solid fa-minus"></i>
          </button>
          <input type="number" value="1" class="qty-input" readonly />
          <button class="qty-btn plus">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>

      <div class="detail-btns">
        <button class="btn-action cart" data-id="${prd.id}">
          <i class="fa-solid fa-cart-plus"></i> 장바구니에 추가
        </button>
        <button class="btn-action buy">바로 구매</button>
      </div>
    </div>
  `;

  quantityEvt(prd.stock);
  addToCart(prd);
}

const quantityEvt = (stock) => {
  const minusBtn = document.querySelector(".qty-btn.minus");
  const plusBtn = document.querySelector(".qty-btn.plus");
  const qtyInput = document.querySelector(".qty-input");

  minusBtn.addEventListener("click", () => {
    if (qtyInput.value > 1) {
      qtyInput.value--;
    }
  });
  plusBtn.addEventListener("click", () => {
    if (qtyInput.value < stock) {
      qtyInput.value++;
    }
  });
};

const addToCart = (prd) => {
  const cartBtn = document.querySelector(".btn-action.cart");
  const qtyInput = document.querySelector(".qty-input");
  const cartBadge = document.querySelector(".cart-badge");
  cartBtn.addEventListener("click", () => {
    console.log(prd);
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const quantity = qtyInput.value;
    const isDuplication = cart.findIndex((item) => item.id === prd.id);

    if (isDuplication === -1) {
      cart.push({
        id: prd.id,
        title: prd.title,
        price: prd.price,
        image: prd.images[0],
        quantity: quantity,
        category: prd.category,
      });
    }

    cartBadge.textContent = cart.length;
    localStorage.setItem("cart", JSON.stringify(cart));
  });
};

renderDetail();
