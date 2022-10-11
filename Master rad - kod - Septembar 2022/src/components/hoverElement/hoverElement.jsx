import { useState } from "react";

const HoverElement = ({ body, text, maxNoHover = 7 }) => {
  // maxNoHover =- 1 if message is always shown when hover
  const [isHovering, setIsHovering] = useState(false);
  const [count, setCount] = useState(0);

  const handleMouseOver = () => {
    setIsHovering(true);
    setCount((prevState) => prevState + 1);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
    <span>
      <span onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        {body}
      </span>
      <div
        style={{
          color:
            isHovering && (maxNoHover === -1 || count < maxNoHover)
              ? "black"
              : "white",
        }}
      >
        {text}
      </div>
    </span>
  );
};

export default HoverElement;
