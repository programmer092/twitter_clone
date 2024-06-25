export const SetRandom = (array) => {
  let currIndex = array.length;
  let tempArray;

  while (currIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currIndex);

    currIndex--;
    tempArray = array[currIndex];
    array[currIndex] = array[randomIndex];
    array[randomIndex] = tempArray;
  }

  return array;
};
