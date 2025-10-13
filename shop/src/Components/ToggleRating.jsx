import { useState, useEffect, useRef, useMemo } from "react";

export default function ToggleRating({ isSorted, setIsSorted }) {
  return (
    <label className="rating-toggle">
      <input
        type="checkbox"
        value="rating-sort"
        checked={isSorted}
        onChange={(e) => setIsSorted(e.target.checked)}
      />
      평점순 정렬
    </label>
  );
}
