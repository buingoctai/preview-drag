import React, { useState, useEffect, useRef } from "react";

const enhance = (App) => ({
  dataList,
  className,
  subClassName,
  handleIndexUpdate,
}) => {
  console.log("dataList=", dataList);
  const [data, setData] = useState(dataList);
  const srcIndex = useRef("");
  const isReverting = useRef(true);
  const enterIndex = useRef(""); // fix fire dragenter many time
  const finishCheck = useRef(null); // fix fire dragenter many time

  const setSrcIndex = (val) => {
    srcIndex.current = val;
  };

  const setIsReverting = (val) => {
    isReverting.current = val;
  };

  // fix fire dragenter many time
  const setEnterIndex = (val) => {
    enterIndex.current = val;
  };

  const setFinishCheck = (val) => {
    finishCheck.current = val;
  };

  useEffect(() => {
    console.log("useffect");

    const handleDragStart = (event) => {
      event.stopImmediatePropagation();
      const {
        target: { id: srcIndex },
      } = event;

      setEnterIndex(srcIndex); // fix fire dragenter many time
      setFinishCheck(false); // fix fire dragenter many time
      setIsReverting(true);
      setSrcIndex(srcIndex);
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.setData("startIndex", srcIndex);
      event.target.style.cursor = "move";
      // document.getElementsByClassName(className)[0].style.cursor = "move"; // fix pointer type
    };

    const handleDragEnd = (event) => {
      event.stopImmediatePropagation();
      const { target: element } = event;

      if (isReverting.current) {
        const arrangedDataList = onRearrangeDataList({
          // fix common logic
          dataArr: data,
          srcIndex: srcIndex.current,
          targetIndex: element.id,
        });
        // fix common logic
        setData(() => [...arrangedDataList]);
        // onAddAnimation(srcIndex.current, element.id); // add animation
      }
      // document.getElementsByClassName(className)[0].style.cursor = "defautl"; // fix pointer type
      element.style.opacity = "1";
    };

    const handleDragOver = (event) => {
      if (event.preventDefault) {
        event.preventDefault();
      }
      return false;
    };

    const handleDragEnter = (event) => {
      onClickItem();
      const { currentTarget: element } = event;
      const { id: targetIndex } = element;
      // fix fire dragenter many time
      if (!finishCheck.current) {
        if (targetIndex === enterIndex.current) {
          setFinishCheck(true);
        } else {
          return;
        }
      }

      console.log("handleDragEnter=", data);

      if (targetIndex === srcIndex.current) return;

      const arrangedDataList = onRearrangeDataList({
        // fix common logic
        dataArr: data,
        srcIndex: srcIndex.current,
        targetIndex,
      });

      // fix common logic
      setData(() => [...arrangedDataList]);
      //  onAddAnimation(srcIndex.current, targetIndex); // add animation
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
    const imgEls = document.querySelectorAll(`.${className} .${subClassName}`);
    imgEls.forEach(function (e) {
      e.addEventListener("dragstart", handleDragStart, false);
      e.addEventListener("dragend", handleDragEnd, false);
      e.addEventListener("dragenter", handleDragEnter, false);
      e.addEventListener("dragleave", handleDragLeave, false);
      e.addEventListener("dragover", handleDragOver, false);
      e.addEventListener("drop", handleDrop, false);
    });
  }, []);

  const onRearrangeDataList = ({ dataArr, srcIndex, targetIndex }) => {
    if (!srcIndex || !targetIndex) return [...dataArr];

    const srcItem = dataArr[srcIndex];
    dataArr.splice(srcIndex, 1);
    dataArr.splice(targetIndex, 0, srcItem);
    return [...dataArr];
  };

  const onAddAnimation = (start, end) => {
    console.log("onAddAnimation", start, end);

    if (start < end) {
      setTimeout(() => {
        for (let i = parseInt(start); i < parseInt(end); i++) {
          document.getElementById(i.toString()).style.transform =
            "translate3d(-10%, 0, 0)";
          // "translate3d(0, -10%, 0px)";
        }
      });

      setTimeout(() => {
        for (let i = parseInt(start); i < parseInt(end); i++) {
          document.getElementById(i.toString()).style.transform = "none";
        }
      }, 500);
    } else {
      setTimeout(() => {
        for (let i = parseInt(start); i > parseInt(end); i--) {
          document.getElementById(i.toString()).style.transform =
            "translate3d(10%, 0, 0)";
          // "translate3d(0, 10%, 0px)";
        }
      });

      setTimeout(() => {
        for (let i = parseInt(start); i > parseInt(end); i--) {
          document.getElementById(i.toString()).style.transform = "none";
        }
      }, 500);
    }
  };

  const onClickItem = () => {
    console.log("onClickItem", data);
  };

  return <App data={data} onClickItem={onClickItem} />;
};

export default enhance;
