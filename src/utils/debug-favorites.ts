// Utilidad para debuggear favoritos en la consola del navegador

// export const debugFavorites = () => {
//   const favorites = localStorage.getItem("favorites");

//   if (!favorites) {
//     console.log("No hay favoritos guardados");
//     return;
//   }

//   const parsed = JSON.parse(favorites);
//   console.log("Favoritos en localStorage:", parsed);

//   parsed.forEach((hero: any, index: number) => {
//     console.log(`Héroe ${index + 1}:`, {
//       id: hero.id,
//       name: hero.name,
//       image: hero.image,
//       imageStartsWithHttp: hero.image.startsWith("http"),
//     });
//   });
// };

// export const clearFavorites = () => {
//   localStorage.removeItem("favorites");
//   console.log("Favoritos eliminados. Recarga la página.");
// };

// // Exponer en window para uso en consola
// if (typeof window !== "undefined") {
//   (window as any).debugFavorites = debugFavorites;
//   (window as any).clearFavorites = clearFavorites;
// }
