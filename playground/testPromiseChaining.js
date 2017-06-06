// var doWork = () => {
//   return new Promise((resolve, reject) => {
//     resolve(10);
//   });
// };
//
// doWork().then((initialValue) => {
//   return initialValue + 1;
// }).then((val) => {
//   return val + 2;
// }).then((val) => {
//   console.log(val); // Will print 13
// });




var incr = (val) => {
  return new Promise((resolve, reject) => {
    resolve(val+1);
  });
};
var incr_2 = (val) => {
  return new Promise((resolve, reject) => {
    resolve(val+2);
  });
};

incr(10).then ( (val) => {
  console.log(val);
  return incr_2(val);
}).then ( (val) => {
  console.log(val);
  return val;
}).then ((val) => {
  console.log(val);
})
