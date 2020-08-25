import React, { useState, useEffect, useRef } from "react";

import EXAMPLE_IMAGES from "./data";

const EXAMPLE_DATA = EXAMPLE_IMAGES.slice(10).map((img, index) => ({
  thumb: img.url,
  title: `Title ${index}`,
  sub: `Sub ${index}`,
}));

const enhance = (App) => () => {
  const [images, setImages] = useState(EXAMPLE_IMAGES);
  const srcIndex = useRef("");
  const isReverting = useRef(true);

  const setSrcIndex = (val) => {
    srcIndex.current = val;
  };

  const setIsReverting = (val) => {
    isReverting.current = val;
  };

  useEffect(() => {
    let newImages = [...images];

    const handleDragStart = (event) => {
      const {
        target: { id: srcIndex },
      } = event;

      setIsReverting(true);
      setSrcIndex(srcIndex);
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.setData("startIndex", srcIndex);
    };

    const handleDragEnd = (event) => {
      event.stopImmediatePropagation();
      const { target: element } = event;

      if (isReverting.current) {
        const arrangedImages = onRearrangeDataList({
          dataArr: newImages,
          srcIndex: srcIndex.current,
          targetIndex: element.id,
        });
        setImages(arrangedImages);
      }
      element.style.opacity = "1";
    };

    const handleDragOver = (event) => {
      if (event.preventDefault) {
        event.preventDefault();
      }
      return false;
    };

    const handleDragEnter = ({ target: element }) => {
      const { id: targetIndex } = element;
      if (targetIndex === srcIndex.current) return;

      const arrangedImages = onRearrangeDataList({
        dataArr: newImages,
        srcIndex: srcIndex.current,
        targetIndex,
      });
      setImages(arrangedImages);
      setSrcIndex(targetIndex);
      element.style.opacity = "0.4";
    };

    const handleDragLeave = ({ target: element }) => {
      element.style.opacity = "1";
    };

    const handleDrop = (event) => {
      handleDragLeave(event);
      event.stopImmediatePropagation();

      const oldIndex = event.dataTransfer.getData("startIndex");
      const {
        target: { id: newIndex },
      } = event;

      handleIndexUpdate(oldIndex, newIndex);
      setIsReverting(false);
    };

    // Add event listeners
    const elements = document.querySelectorAll(".list__image__container > img");
    elements.forEach(function (e) {
      e.addEventListener("dragstart", handleDragStart, false);
      e.addEventListener("dragend", handleDragEnd, false);
      e.addEventListener("dragenter", handleDragEnter, false);
      e.addEventListener("dragleave", handleDragLeave, false);
      e.addEventListener("dragover", handleDragOver, false);
      e.addEventListener("drop", handleDrop, false);
    });
  }, [images]);

  const onRearrangeDataList = ({ dataArr, srcIndex, targetIndex }) => {
    const srcItem = dataArr[srcIndex];
    dataArr.splice(srcIndex, 1);
    dataArr.splice(targetIndex, 0, srcItem);

    return [...dataArr];
  };

  const handleIndexUpdate = (oldIndex, newIndex) => {
    console.log("handleIndexUpdate", oldIndex, newIndex);
  };

  return <App images={images} exampleData={EXAMPLE_DATA} />;
};

export default enhance;
