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
  return val; // can return anything from the promise call back.. will be available to the next then()
}).then ((val) => {
  console.log(val);
})
