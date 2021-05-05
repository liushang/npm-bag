export function activateFunction(funcObj) {
  for (let x in funcObj) {
    let funcs = stringToFunc(funcObj[x]);
    funcObj[x] = (e) => {
        let oo = funcs.bind(this)
        return oo(e);
    };
  }
}