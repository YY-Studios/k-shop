// ========================================
// 상품 데이터
// ========================================
const products = [
  {
    id: 1,
    name: "가죽 벨트",
    category: "액세서리",
    price: 45000,
    image: "https://via.placeholder.com/400x400/333/fff?text=Belt",
    description: "고급 천연 가죽으로 제작된 정장 벨트입니다. 어떤 스타일에도 잘 어울리는 클래식한 디자인입니다.",
    stock: 35,
  },
  {
    id: 2,
    name: "러닝 스니커즈",
    category: "신발",
    price: 79000,
    image: "https://via.placeholder.com/400x400/333/fff?text=Shoes",
    description: "가볍고 편안한 러닝화입니다. 쿠션감이 뛰어나 장시간 착용해도 피로감이 적습니다.",
    stock: 20,
  },
  {
    id: 3,
    name: "무선 마우스",
    category: "전자제품",
    price: 35000,
    image: "https://via.placeholder.com/400x400/333/fff?text=Mouse",
    description: "인체공학적 설계의 무선 마우스입니다. 정밀한 트래킹과 긴 배터리 수명을 자랑합니다.",
    stock: 50,
  },
  {
    id: 4,
    name: "무선 블루투스 이어폰",
    category: "전자제품",
    price: 89000,
    image: "https://via.placeholder.com/400x400/333/fff?text=Earphone",
    description: "노이즈 캔슬링 기능이 탑재된 무선 이어폰입니다. 깨끗한 음질과 편안한 착용감을 제공합니다.",
    stock: 15,
  },
  {
    id: 5,
    name: "스마트 워치",
    category: "액세서리",
    price: 149000,
    image: "https://via.placeholder.com/400x400/333/fff?text=SmartWatch",
    description: "건강 모니터링과 스마트 알림 기능을 갖춘 스마트 워치입니다. 세련된 디자인으로 일상에서도 착용하기 좋습니다.",
    stock: 10,
  },
  {
    id: 6,
    name: "캐주얼 슬리퍼",
    category: "신발",
    price: 39000,
    image: "https://via.placeholder.com/400x400/333/fff?text=Slipper",
    description: "실내외 겸용 캐주얼 슬리퍼입니다. 푹신한 쿠션과 미끄럼 방지 기능이 있습니다.",
    stock: 40,
  },
  {
    id: 7,
    name: "프리미엄 코튼 티셔츠",
    category: "의류",
    price: 29000,
    image: "https://via.placeholder.com/400x400/ddd/333?text=T-Shirt",
    description: "100% 순면 소재의 프리미엄 티셔츠입니다. 부드러운 촉감과 뛰어난 통기성을 자랑합니다.",
    stock: 100,
  },
  {
    id: 8,
    name: "데님 청바지",
    category: "의류",
    price: 59000,
    image: "https://via.placeholder.com/400x400/ddd/333?text=Jeans",
    description: "클래식한 스트레이트 핏 데님 청바지입니다. 편안한 착용감과 내구성이 뛰어납니다.",
    stock: 25,
  },
];

// ========================================
// 유틸리티 함수
// ========================================

// 가격 포맷팅 (45000 -> "45,000원")
function formatPrice(price) {
  return price.toLocaleString("ko-KR") + "원";
}

// 상품 ID로 상품 찾기
function getProductById(id) {
  return products.find((product) => product.id === parseInt(id));
}

// 카테고리별 상품 필터링
function getProductsByCategory(category) {
  if (category === "전체") return products;
  return products.filter((product) => product.category === category);
}

// ========================================
// 장바구니 관련 함수 (localStorage 사용)
// ========================================

const CART_KEY = "kshop_cart";

// 장바구니 가져오기
function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

// 장바구니 저장하기
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// 장바구니에 상품 추가
function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    // 이미 있으면 수량만 증가
    existingItem.quantity += quantity;
  } else {
    // 새로 추가
    cart.push({ productId, quantity });
  }

  saveCart(cart);
  updateCartBadge();
  return cart;
}

// 장바구니에서 상품 제거
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.productId !== productId);
  saveCart(cart);
  updateCartBadge();
  return cart;
}

// 장바구니 상품 수량 변경
function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((item) => item.productId === productId);

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
    saveCart(cart);
    updateCartBadge();
  }

  return cart;
}

// 장바구니 총 수량 계산
function getCartTotalCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// 장바구니 총 금액 계산
function getCartTotalPrice() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

// 헤더 장바구니 배지 업데이트
function updateCartBadge() {
  const totalCount = getCartTotalCount();
  const badges = document.querySelectorAll(".cart-badge");
  const cartButtons = document.querySelectorAll("#btn-cart");

  // 기존 배지 제거
  badges.forEach((badge) => badge.remove());

  // 장바구니에 상품이 있으면 배지 추가
  if (totalCount > 0) {
    cartButtons.forEach((btn) => {
      btn.style.position = "relative";
      const badge = document.createElement("span");
      badge.className = "cart-badge";
      badge.textContent = totalCount > 99 ? "99+" : totalCount;
      btn.appendChild(badge);
    });
  }
}

// 페이지 로드 시 배지 업데이트
document.addEventListener("DOMContentLoaded", updateCartBadge);
