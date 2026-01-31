export async function getData() {
  try {
    const res = await fetch("https://dummyjson.com/products");

    if (!res.ok) throw new Error("데이터 불러오기 실패");

    const data = await res.json();
    return data.products;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProductById(id) {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    if (!res.ok) throw new Error("제품 데이터 불러오기 실패");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
