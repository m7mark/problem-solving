function calc(a, b, callback) {
  let sum = a + b;
  if (a < 2) {
    callback(new Error('Первый аргумент должен быть больше 1'))
  } else {
    callback(null, sum)
  }
}
function square(err, sum) {
  if (err) console.log(err)
  else console.log(sum ** 2)
}
calc(6, 2, square)

//Promisify
function promCalc(a, b) {
  return new Promise((res, rej) => {
    calc(a, b, (err, sum) => {
      if (err) rej(err)
      else res(sum)
    })
  })
}
promCalc(3, 1).then(res => square(null, res)).catch(square)

function promisify(f) {
  return function (...args) { // возвращает функцию-обёртку
    return new Promise((resolve, reject) => {
      function callback(err, result) { // наш специальный колбэк для f
        if (err) {
          return reject(err);
        } else {
          resolve(result);
        }
      }
      args.push(callback); // добавляем колбэк в конец аргументов f
      f.call(this, ...args); // вызываем оригинальную функцию
    })
  }
};

const newPromCalc = promisify(calc)
newPromCalc(1, 1).then(res => square(null, res)).catch(square);

(async () => {
  try {
    const result = await newPromCalc(3, 5)
    console.log(result);
  } catch (e) {
    console.log(e);
  }
})()