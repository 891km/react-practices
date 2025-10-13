import { useState, useEffect, useRef, useMemo } from "react";
import "./Shop.style.css";
import ToggleRating from "./Components/ToggleRating.jsx";
import SelectCategory from "./Components/SelectCategory.jsx";
import DisplayList from "./Components/DisplayList.jsx";

function App() {
  return (
    <>
      <Shop />
    </>
  );
}

function Shop() {
  const [sourceProducts, setSourceProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [targetCat, setTargetCat] = useState("전체");
  const [isSorted, setIsSorted] = useState(false);

  // 첫 로드 async
  useEffect(() => {
    async function loadWholeDatas() {
      const res = await fetch("/datas.json");
      const data = await res.json();
      setSourceProducts(data.products);
      setCategories([...new Set(data.products.map((data) => data.category))]);
    }

    loadWholeDatas();
  }, []);

  return (
    <section className="product-container">
      <h2>상품 목록</h2>
      <div className="product-controls">
        <SelectCategory categories={categories} setTargetCat={setTargetCat} />
        <ToggleRating isSorted={isSorted} setIsSorted={setIsSorted} />
      </div>
      <DisplayList
        sourceProducts={sourceProducts}
        targetCat={targetCat}
        isSorted={isSorted}
      />
    </section>
  );
}

export default App;
