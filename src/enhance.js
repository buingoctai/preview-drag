import React, { useState, useEffect, useRef } from "react";

const enhance = (App) => ({
  dataList,
  className,
  subClassName,
  handleIndexUpdate,
}) => {
  const [data, setData] = useState(dataList);
  const srcIndex = useRef("");
  const isReverting = useRef(true);
  const enterIndex = useRef(""); // Fix fire dragenter many time
  const finishCheck = useRef(null); // Fix fire dragenter many time
  const orderList = useRef(Array.from(Array(dataList.length).keys()));

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

  const setOrderList = (val) => {
    orderList.current = val;
  };

  useEffect(() => {
    const handleDragStart = (event) => {
      event.stopImmediatePropagation();
      const {
        target: { id: srcIndex },
      } = event;

      setEnterIndex(srcIndex); // fix fire dragenter many time
      setFinishCheck(false); // fix fire dragenter many time
      setIsReverting(true);
      setSrcIndex(srcIndex);
      setOrderList(Array.from(Array(dataList.length).keys()));
      onAddTransition();
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.setData(
        "startIndex",
        orderList.current.indexOf(parseInt(srcIndex))
      );
      event.target.style.cursor = "move";

      console.log("handleDragStart", event.target);
      event.target.style.opacity = "0.1";
    };

    const handleDragEnd = (event) => {
      event.stopImmediatePropagation();

      const { target: element } = event;
      if (isReverting.current) {
        onRevertDataList();
      } else {
        let updatedData = [...data];
        let updatedIndex = [];

        for (let i = 0; i < orderList.current.length; i++) {
          if (updatedIndex.includes(orderList.current[i])) {
            continue;
          } else {
            updatedIndex.push(orderList.current.indexOf(orderList.current[i]));
          }
          updatedData = onRearrangeDataList({
            dataArr: [...updatedData],
            srcIndex: orderList.current[i],
            targetIndex: orderList.current.indexOf(orderList.current[i]),
          });
        }

        onRemoveTransition();
        onRevertDataList();
        setData(updatedData);
      }
      element.style.opacity = "1";
    };

    const handleDragOver = (event) => {
      if (event.preventDefault) {
        event.preventDefault();
      }
      return false;
    };

    const handleDragEnter = (event) => {
      const { currentTarget: element } = event;
      const { id: targetIndex } = element;

      // Fix fire dragenter many time
      if (!finishCheck.current) {
        if (targetIndex === enterIndex.current) {
          setFinishCheck(true);
        } else {
          return;
        }
      }
      if (targetIndex === srcIndex.current) return;

      // Add animation & update order list
      onAddAnimation(parseInt(srcIndex.current), parseInt(targetIndex));
      const arrangedOrderList = onRearrangeDataList({
        dataArr: [...orderList.current],
        srcIndex: orderList.current.indexOf(parseInt(srcIndex.current)),
        targetIndex: orderList.current.indexOf(parseInt(targetIndex)),
      });
      setOrderList(arrangedOrderList);
    };

    const handleDragLeave = ({ target: element }) => {
      element.style.opacity = "1";
    };

    const handleDrop = (event) => {
      event.stopImmediatePropagation();
      handleDragLeave(event);

      const oldIndex = event.dataTransfer.getData("startIndex");
      const {
        target: { id: newIndex },
      } = event;

      handleIndexUpdate(
        oldIndex,
        orderList.current.indexOf(parseInt(newIndex))
      );
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

    return () => {
      // Remove event listeners
      const imgEls = document.querySelectorAll(
        `.${className} .${subClassName}`
      );
      imgEls.forEach(function (e) {
        e.removeEventListener("dragstart", handleDragStart, false);
        e.removeEventListener("dragend", handleDragEnd, false);
        e.removeEventListener("dragenter", handleDragEnter, false);
        e.removeEventListener("dragleave", handleDragLeave, false);
        e.removeEventListener("dragover", handleDragOver, false);
        e.removeEventListener("drop", handleDrop, false);
      });
    };
  }, [data]);

  const onRearrangeDataList = ({ dataArr, srcIndex, targetIndex }) => {
    const srcItem = dataArr[srcIndex];
    dataArr.splice(srcIndex, 1);
    dataArr.splice(targetIndex, 0, srcItem);
    return [...dataArr];
  };

  const onAddAnimation = (start, end) => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);

    if (orderList.current.indexOf(start) < orderList.current.indexOf(end)) {
      // Move else points
      const addDistance =
        (orderList.current.indexOf(end) - orderList.current.indexOf(start)) *
        56;

      const strOldTranslate = elms[start].style.transform;
      const numOldTranslate = parseInt(
        strOldTranslate.slice(11, strOldTranslate.length - 3)
      );

      elms[start].style.transform = `translateY(${
        numOldTranslate + addDistance
      }px)`;

      // Move start point
      for (
        let i = orderList.current.indexOf(start) + 1;
        i <= orderList.current.indexOf(end);
        i++
      ) {
        const strTranslate = elms[orderList.current[i]].style.transform;
        const numTranslate = parseInt(
          strTranslate.slice(11, strTranslate.length - 3)
        );

        elms[orderList.current[i]].style.transform = `translateY(${
          numTranslate - 56
        }px)`;
      }
    } else {
      // Move start point
      const subDistance =
        (orderList.current.indexOf(start) - orderList.current.indexOf(end)) *
        -56;

      const strOldTranslate = elms[start].style.transform;
      const numOldTranslate = parseInt(
        strOldTranslate.slice(11, strOldTranslate.length - 3)
      );

      elms[start].style.transform = `translateY(${
        numOldTranslate + subDistance
      }px)`;

      // Move else points
      for (
        let i = orderList.current.indexOf(start) - 1;
        i >= orderList.current.indexOf(end);
        i--
      ) {
        const strOldTranslate = elms[orderList.current[i]].style.transform;
        const numOldTranslate = parseInt(
          strOldTranslate.slice(11, strOldTranslate.length - 3)
        );

        elms[orderList.current[i]].style.transform = `translateY(${
          numOldTranslate + 56
        }px)`;
      }
    }
  };

  const onRevertDataList = () => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    for (let i = 0; i < elms.length; i++) {
      elms[i].style.transform = "translateY(0px)";
    }
  };

  const onRemoveTransition = () => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    for (let i = 0; i < elms.length; i++) {
      elms[i].style.transition = "all 0s ease-out";
    }
  };

  const onAddTransition = () => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    for (let i = 0; i < elms.length; i++) {
      elms[i].style.transition = "all 0.4s ease-out";
    }
  };

  return <App data={data} />;
};

export default enhance;
