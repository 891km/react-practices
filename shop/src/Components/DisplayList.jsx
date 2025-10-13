import { useState, useEffect, useRef, useMemo } from "react";

export default function DisplayList({ sourceProducts, targetCat, isSorted }) {
  const filteredProducts = useMemo(() => {
    if (targetCat === "전체") {
      return sourceProducts;
    } else {
      return sourceProducts.filter((item) => item.category === targetCat);
    }
  }, [targetCat, sourceProducts]);

  const sortedFilteredProducts = useMemo(() => {
    if (isSorted) {
      return [...filteredProducts].sort((a, b) => b.rating - a.rating);
    } else {
      return filteredProducts;
    }
  }, [isSorted, filteredProducts]);

  return (
    <ul className="product-list">
      {sortedFilteredProducts.map((data) => (
        <li key={data.id} className="product-item">
          <div className="product-info">
            <h3>{data.name}</h3>
            <p>{data.category}</p>
          </div>
          <div className="product-figure">
            <p className="product-price">{data.price.toLocaleString()}원</p>
            <p className="product-rating">★ {data.rating}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
