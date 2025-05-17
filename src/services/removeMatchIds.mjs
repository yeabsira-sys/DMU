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
return 1
  // return [...filtered, ...newImage]
};
