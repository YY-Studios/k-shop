const renderCartList = () => {
  const cartContainer = document.querySelector(".cart-layout");
  const cartList = document.querySelector(".cart-list");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="empty-msg" style="padding: 50px 0; text-align: center;">장바구니가 비어 있습니다.</p>`;
    return;
  }

  cartList.innerHTML = cart
    .map(
      (item, index) => `
    <article class="cart-item">
            <div class="ci-img">
              <img
                src="${item.image}"
                alt="${item.title}"
              />
            </div>

            <div class="ci-info">
              <div class="ci-top">
                <div class="ci-txt">
                  <h3 class="ci-name">${item.title}</h3>
                  <p class="ci-cate">${item.category}</p>
                </div>
                <button class="btn-remove" onclick="removeToCart(${index})">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>

              <div class="ci-bottom">
                <div class="qty-control sm">
                  <button class="qty-btn minus">
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <input type="number" value="${
                    item.quantity
                  }" class="qty-input" readonly />
                  <button class="qty-btn plus">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
                <p class="ci-price">${item.price * item.quantity}$</p>
              </div>
            </div>
          </article>
  `
    )
    .join("");
  const totalPrice = cart.reduce(
    (acc, cur) => acc + cur.price * cur.quantity,
    0
  );
  console.log(totalPrice);
  fetchCartSummary(totalPrice);
};

// 주문 요약 업데이트
const fetchCartSummary = (totalPrice) => {
  const tPrice = Math.round(totalPrice);
  const subtotalEl = document.querySelector(".summary-row span:last-child");
  const totalPriceEl = document.querySelector(".total-price");
  subtotalEl.textContent = tPrice + "$";
  totalPriceEl.textContent = tPrice + "$";
};

// 장바구니 상품 삭제
const removeToCart = (index) => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCartList();
};

renderCartList();
