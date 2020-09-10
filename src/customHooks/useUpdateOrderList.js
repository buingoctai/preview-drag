import { useState, useEffect, useRef } from "react";

const useUpdateOrderList = ({
  className,
  subClassName,
  dataList,
  numItemRow = 1,
  movingUnit,
  handleIndexUpdate,
  handleAddingAnimation,
}) => {
  const [data, setData] = useState(dataList);
  const srcIndex = useRef("");
  const overIdx = useRef("");
  const isReverting = useRef(true);
  const orderList = useRef(Array.from(Array(dataList.length).keys()));
  const isDropOnContainer = useRef(false);

  const setSrcIndex = (val) => {
    srcIndex.current = val;
  };

  const setIsReverting = (val) => {
    isReverting.current = val;
  };

  const setOrderList = (val) => {
    orderList.current = val;
  };

  const setIsDropOnContainer = (val) => {
    isDropOnContainer.current = val;
  };

  const setOverIdx = (val) => {
    overIdx.current = val;
  };

  useEffect(() => {
    const handleDragStart = (event) => {
      event.stopImmediatePropagation();
      const {
        target: { id: srcIndex },
      } = event;

      setSrcIndex(srcIndex);
      setOverIdx(srcIndex);
      setIsReverting(true);
      setOrderList(Array.from(Array(dataList.length).keys()));
      setIsDropOnContainer(false);
      onAddingTransition();
      onAddingMarkedPoint(srcIndex);
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.setData(
        "startIndex",
        orderList.current.indexOf(parseInt(srcIndex))
      );
    };

    const handleDragEnd = (event) => {
      event.stopImmediatePropagation();
      setTimeout(
        () => {
          if (isReverting.current) {
            onRemovingTranslate();
          } else {
            let updatedData = [];

            for (let i = 0; i < orderList.current.length; i++) {
              const elementId = orderList.current[i];
              const item = data[elementId];
              updatedData.push(item);
            }

            onRemovingTransition();
            onRemovingTranslate();
            setData(updatedData);
          }
        },
        isDropOnContainer ? 400 : 0
      );
    };

    const handleDrop = (event) => {
      event.stopImmediatePropagation();

      const {
        target: { id },
      } = event;
      onRemovingMarkedPoint(srcIndex.current);

      const oldIndex = event.dataTransfer.getData("startIndex");
      const newIndex = orderList.current.indexOf(parseInt(id));

      handleIndexUpdate(oldIndex, newIndex);
      setIsReverting(false);
    };

    const handleDropContainer = (event) => {
      event.stopImmediatePropagation();
      const fullHeightItemRow =
        Math.floor(data.length / numItemRow) * movingUnit.height;
      const oldIndex = event.dataTransfer.getData("startIndex");

      setIsReverting(false);
      onRemovingMarkedPoint(srcIndex.current);
      if (event.offsetY > fullHeightItemRow) {
        const lastElm = document.querySelector(
          `.${className} .${subClassName}:last-child`
        );
        const event = new Event("dragover");

        lastElm.dispatchEvent(event);
        setIsDropOnContainer(true);
        handleIndexUpdate(oldIndex, data.length - 1);
        return;
      }
      handleIndexUpdate(
        oldIndex,
        orderList.current.indexOf(parseInt(oldIndex))
      );
    };

    const handleDragOver = (event) => {
      const { currentTarget: element } = event;
      const { id: targetIndex } = element;

      if (targetIndex === overIdx.current) return;

      setOverIdx(targetIndex);

      onHandleAnimation({
        start: parseInt(srcIndex.current),
        end: parseInt(targetIndex),
      });
      const arrangedOrderList = onRearrangeDataList({
        dataArr: [...orderList.current],
        srcIndex: orderList.current.indexOf(parseInt(srcIndex.current)),
        targetIndex: orderList.current.indexOf(parseInt(targetIndex)),
      });
      setOrderList(arrangedOrderList);
    };

    // Add event listeners
    const container = document.querySelector(`.${className}`);
    container.addEventListener("drop", handleDropContainer, false);

    const items = document.querySelectorAll(`.${className} .${subClassName}`);
    items.forEach((e) => {
      e.addEventListener("dragstart", handleDragStart, false);
      e.addEventListener("dragend", handleDragEnd, false);
      e.addEventListener("dragover", handleDragOver, false);
      e.addEventListener("drop", handleDrop, false);
    });

    return () => {
      // Remove event listeners
      const container = document.querySelector(`.${className}`);
      container.removeEventListener("drop", handleDropContainer, false);

      const items = document.querySelectorAll(`.${className} .${subClassName}`);
      items.forEach((e) => {
        e.removeEventListener("dragstart", handleDragStart, false);
        e.removeEventListener("dragend", handleDragEnd, false);
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

  const onHandleAnimation = ({ start, end }) => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    const startIndex = orderList.current.indexOf(start);
    const endIndex = orderList.current.indexOf(end);

    handleAddingAnimation({ startIndex, endIndex, elms });
  };

  const onRemovingTranslate = () => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    for (let i = 0; i < elms.length; i++) {
      elms[i].style.transform = "translate3d(0px,0px,0px)";
    }
  };

  const onRemovingTransition = () => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    for (let i = 0; i < elms.length; i++) {
      elms[i].style.transition = "all 0s ease-out";
    }
  };

  const onAddingTransition = () => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    for (let i = 0; i < elms.length; i++) {
      elms[i].style.transition = "all 0.4s ease-out";
    }
  };

  const onAddingMarkedPoint = (index) => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    elms[index].style.opacity = "0.4";
  };

  const onRemovingMarkedPoint = (index) => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    elms[index].style.opacity = "1";
  };

  return { data, orderList };
};

export default useUpdateOrderList;
