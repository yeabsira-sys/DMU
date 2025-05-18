export const removeMatchIds = async (idsToRemove, oldImage, newImage) => {
  let image = [];
//   for (let i = 0; i < idsToremove.length; i++ ) {
//       for(let j = 0; j < oldImage.length; j++) {
//           if(idsToremove[i] !== oldImage[j].id){
//               image.push(oldImage[j])
//           }

//       }
//   }
console.log(idsToRemove, ': :', oldImage," : :", newImage)
  const filtered = oldImage.filter(img => !idsToRemove.includes(img.id));
  console.log(filtered, 'filtered')
  console.log(oldImage, 'old')
  console.log(newImage, 'new')
  return [...filtered, ...newImage]
};
