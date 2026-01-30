// ========================================
// 로그인 페이지 (login.js)
// ========================================

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("user-email");
const pwInput = document.getElementById("user-pw");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = pwInput.value;

  // 간단한 유효성 검사
  if (!email || !password) {
    showToast("이메일과 비밀번호를 입력해주세요.");
    return;
  }

  // 데모: 로그인 성공 처리
  showToast("로그인 기능은 데모 버전입니다.");
  
  // 실제 구현시 여기서 서버 API 호출
  // fetch('/api/login', { ... })
});

// 토스트 메시지
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

// 토스트 애니메이션
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
