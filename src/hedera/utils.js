const removeFirstDoubleCeroAndDots = (itemToBeReplace) => {
  if (!itemToBeReplace) return null;
  return +itemToBeReplace.toString().replace("0.0.", "");
};

export { removeFirstDoubleCeroAndDots };
