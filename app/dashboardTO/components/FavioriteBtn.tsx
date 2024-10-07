import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";

const FavioriteBtn = () => {
  const [favorite, setFavorite] = useState(false);
  return (
    <button
      className="btn p-0"
      onClick={() => setFavorite(!favorite)}
      style={{
        outline: "none",
        boxShadow: "none",
      }}
    >
      {favorite ? (
        <GoHeartFill style={{ width: "21", height: "18", color: "#0153AF" }} />
      ) : (
        <GoHeart style={{ width: "21", height: "18" }} />
      )}
    </button>
  );
};

export default FavioriteBtn;
