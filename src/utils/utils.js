export const getCurrentTranslate = (element) => {
  const values = element.style.transform.split(/\w+\(|\);?/);
  const transform = values[1].split(/,\s?/g).map((numStr) => parseInt(numStr));

  return {
    x: transform[0],
    y: transform[1],
    z: transform[2],
  };
};
