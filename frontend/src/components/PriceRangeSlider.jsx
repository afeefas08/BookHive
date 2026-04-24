import React, { useEffect, useRef, useState } from "react";

const PriceRangeSlider = ({
  minLimit = 0,
  maxLimit = 1000,
  minValue,
  maxValue,
  onPriceChange,
}) => {
  const [min, setMin] = useState(minValue ?? minLimit);
  const [max, setMax] = useState(maxValue ?? maxLimit);

  const rangeRef = useRef(null);
  const gap = 50;

  // Sync with URL (important for clear all)
  useEffect(() => {
    setMin(minValue ?? minLimit);
    setMax(maxValue ?? maxLimit);
  }, [minValue, maxValue]);

  // Update progress bar
  useEffect(() => {
    const minPercent = ((min - minLimit) / (maxLimit - minLimit)) * 100;
    const maxPercent = ((max - minLimit) / (maxLimit - minLimit)) * 100;

    if (rangeRef.current) {
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [min, max]);

  const handleMin = (e) => {
    let value = Number(e.target.value);
    if (value > max - gap) value = max - gap;

    setMin(value);
    onPriceChange?.(value, max);
  };

  const handleMax = (e) => {
    let value = Number(e.target.value);
    if (value < min + gap) value = min + gap;

    setMax(value);
    onPriceChange?.(min, value);
  };

  return (
    <div className="w-full">

      {/* Track */}
      <div className="relative h-1 bg-gray-300 rounded-full overflow-hidden">
        <div
          ref={rangeRef}
          className="absolute h-full bg-black rounded-full"
        />
      </div>

      {/* Sliders */}
      <div className="relative mt-2 h-5">
        {/* MIN */}
        <input
  type="range"
  min={minLimit}
  max={maxLimit}
  value={min}
  onChange={handleMin}
  className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none z-30
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:pointer-events-auto
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:bg-white
    [&::-webkit-slider-thumb]:border-2
    [&::-webkit-slider-thumb]:border-black
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:cursor-pointer
    [&::-webkit-slider-thumb]:-mt-5"
/>

        {/* MAX */}
        <input
  type="range"
  min={minLimit}
  max={maxLimit}
  value={max}
  onChange={handleMax}
  className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none z-20
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:pointer-events-auto
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:bg-white
    [&::-webkit-slider-thumb]:border-2
    [&::-webkit-slider-thumb]:border-black
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:cursor-pointer
    [&::-webkit-slider-thumb]:-mt-5"
/>
      </div>

      {/* Bottom selected values */}
      <div className="flex justify-between text-sm mt-2 font-medium">
        <span>₹{min}</span>
        <span>₹{max}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;