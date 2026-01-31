import { getData } from "./data.js";

const productContainer = document.querySelector(".product-list");
async function renderProdct() {
  const allProducts = await getData();
  let isMain =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/";
  let displayproducts = isMain ? allProducts.slice(0, 4) : allProducts;
  const productHtml = displayproducts
    .map(
      (prd) => `
     <article class="product-card">
            <a href="detail.html?id=${prd.id}" class="prd-link">
            <div class="img-box">
                <img
                src="${prd.images[0]}"
                alt="${prd.title}"
                />
            </div>
            <div class="info-box">
                <p class="category">${prd.category}</p>
                <h3 class="name">${prd.title}</h3>
                <div class="price-cart">
                <p class="price">${prd.price}달러</p>
                <button class="btn-add-cart">
                    <i class="fa-solid fa-cart-plus"></i>
                </button>
                </div>
            </div>
            </a>
        </article>
        `
    )
    .join("");
  if (productContainer) {
    productContainer.innerHTML = productHtml;
  }
}
renderProdct();
