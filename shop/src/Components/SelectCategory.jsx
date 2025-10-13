import { useState, useEffect, useRef, useMemo } from "react";

export default function SelectCategory({ categories, setTargetCat }) {
  function handleSelect(e) {
    console.log(e.target.value);
    setTargetCat(e.target.value);
  }

  return (
    <select className="product-select" onChange={(e) => handleSelect(e)}>
      <option value="전체">전체 카테고리</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
