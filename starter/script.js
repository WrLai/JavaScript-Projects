'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200.211, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2021-12-01T23:36:17.929Z',
    '2021-11-30T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500.231312, -30.212121],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//
//NOTE Create a formatted date
const formattedDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) {
    return 'Today';
  }
  if (daysPassed === 1) {
    return 'Yesterday';
  }

  if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  }

  return new Intl.DateTimeFormat(locale).format(date);
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
};

//
const formateCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// NOTE NOTE
const displayMovements = function (acc, sort = false) {
  // Clear the preset html values
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formattedDate(date, acc.locale);
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">

    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formateCur(
      mov,
      acc.locale,
      acc.currency
    )}</div>

  </div>`;
    // Accending
    containerMovements.insertAdjacentHTML('afterbegin', html);
    // Deccending
    // containerMovements.insertAdjacentHTML('beforebegin', html);
  });
};
// displayMovements(account2.movements);
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  // ('');
});

//NOTE display summary
const calcDisplaySummary = function (accounts) {
  const movements = accounts.movements;
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((accu, curr) => accu + curr, 0);
  labelSumIn.textContent = `${formateCur(
    incomes,
    accounts.locale,
    accounts.currency
  )}`;
  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${formateCur(
    Math.abs(out),
    accounts.locale,
    accounts.currency
  )}`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * accounts.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `${formateCur(
    interest,
    accounts.locale,
    accounts.currency
  )}`;
};
// calcDisplaySummary(account1);

//NOTE Create usernames
// Doing side effect here
const creatUsername = function (acc) {
  acc.forEach(function (e) {
    e.username = e.owner
      .toLowerCase()
      .split(' ')
      .map(letter => letter[0])
      .join('');
  });
};
creatUsername(accounts);

//NOTE Current balance
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(acc.balance)}`;
};
const startLogOutTimer = function () {
  //Set time to 5 minutes
  const tick = function () {
    labelTimer.textContent = `${String(Math.floor(time / 60)).padStart(
      2,
      0
    )}:${String(time % 60).padStart(2, 0)}`;
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };
  //Call the timer every second
  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
// NOTE Event handler
let currentAccount, timer;
//

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);
  //Display balance
  displayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Fake alwasy logged in NOTE NOTE
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//NOTENOTE login
// Experimenting with API

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  //optional chaining used here
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'numeric',
    };
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    //Create current date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day} / ${month} / ${year}, ${hour}:${minutes}`;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    timer > 0 ? clearInterval(timer) : timer;
    timer = startLogOutTimer();

    updateUI(currentAccount);
    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  } else {
    alert('Wrong username or password');
    containerApp.style.opacity = 0;
  }
});

//NOTE NOTE transfer

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    recieverAccount &&
    currentAccount.balance >= amount &&
    recieverAccount?.username !== currentAccount.username
  ) {
    console.log(
      `Transfer to ${recieverAccount.owner} from ${currentAccount.owner}`
    );
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);
    console.log('Transfer Valid');
    //Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movementsDates.push(new Date().toISOString());
    //Update
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    updateUI(currentAccount);
    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  } else {
    console.log(`Transfer Failed`);
  }
});

//NOTE Request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  setTimeout(() => {
    currentAccount.movements.some(mov => mov >= amount / 10) && amount > 0
      ? currentAccount.movements.push(amount) &&
        currentAccount.movementsDates.push(new Date().toISOString())
      : alert(
          `You need to have at least one deposit that is more than 10% of ${amount}`
        );
    updateUI(currentAccount);
    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }, 3000);
});

//NOTENOTE Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    accounts.splice(accounts.findIndex(i => i === currentAccount));
    containerApp.style.opacity = 0;
    console.log(`Account deleted`);
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//NOTE Coding challenge 4
//Exercise 1
const bankDepositSum = accounts
  .flatMap(mov => mov.movements)
  .filter(mov => mov >= 0)
  .reduce((acc, curr) => acc + curr, 0);
// console.log(bankDepositSum);
const bankDepositSum2 = accounts.reduce(
  (sum, cur) =>
    sum + cur.movements.reduce((sum, cur) => (cur > 0 ? sum + cur : sum), 0),
  0
);
// console.log(bankDepositSum2);
const bankWithDrawal = accounts.reduce(
  (mov, cur) =>
    mov + cur.movements.reduce((sum, cur) => (cur < 0 ? sum + cur : sum), 0),
  0
);
// console.log(bankWithDrawal);

//Exercise 2
const bankAtLeast1000 = accounts
  .flatMap(mov => mov.movements)
  //prefix increment!! ++sum
  .reduce((sum, cur) => (cur >= 1000 ? ++sum : sum), 0);
// .filter(mov => mov >= 1000).length;
// console.log(bankAtLeast1000);
const bankAtLeast10002 = accounts.reduce(
  (sum, cur) =>
    sum + cur.movements.reduce((sum, cur) => (cur >= 1000 ? ++sum : sum), 0),
  0
);
// console.log(bankAtLeast10002);

//Exercise 3 contains the sum of deposit and withdrawals
const { deposits, withdrawals } = accounts
  .flatMap(mov => mov.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
// console.log(deposits, withdrawals);

const { deposits2, withdrawals2 } = accounts.reduce(
  (all, cur) => {
    if (
      cur.movements.reduce((sum, cura) => (cura > 0 ? sum + cura : sum), 0) > 0
    ) {
      all.deposits2 += cur.movements.reduce(
        (sum, cur) => (cur > 0 ? sum + cur : sum),
        0
      );
    }
    if (
      cur.movements.reduce((sum, cura) => (cura < 0 ? sum + cura : sum), 0) < 0
    ) {
      all.withdrawals2 += cur.movements.reduce(
        (sum, cur) => (cur < 0 ? sum + cur : sum),
        0
      );
    }
    0;
    return all;
  },
  { deposits2: 0, withdrawals2: 0 }
);

//NOTE Timeout exercise
// const ingredients = ['olives', 'spinach'];
// const timer = setTimeout(
//   (ing1, ing2) => console.log(`Times Up! ${ing1} and ${ing2}`),
//   1000,
//   ...ingredients
// );
// console.log('Waiting');
// if (ingredients.includes('spinach')) clearTimeout(timer);
//setTimeout
// setInterval(() => {
//   console.log(
//     Intl.DateTimeFormat(navigator.locale, { timeStyle: 'medium' }).format(
//       new Date()
//     )
//   ),
//     setTimeout(() => console.clear(), 1800);
// }, 1000);
// console.log(deposits2, withdrawals2);
//Exercise 4
// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word =>
//       exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
//     )
//     .join(' ');
//   return capitalize(titleCase);
// };
//NOTE Internationalizing Numbers (Intl)
// const num = 3884764.23;
// const options = {
//   style: 'currency',
//   //style: 'unit',
//   //style: 'percent',
//   unit: 'mile-per-hour',
//   currency: 'EUR',
//   useGrouping: false,
// };
// console.log('US:        ', new Intl.NumberFormat('en-US', options).format(num));

//NOTE Creating Dates
// const now = new Date();
// console.log(now);

// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(2037, 11, 41, 15, 23, 5));
// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// NOTE NOTE //Working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
// const day1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
// console.log(day1);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(future.getTime()));
// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future);

//NOTE Ways to work around with numbers
// console.log(`${Number('23')} is equal to ${+'23'}`);

// console.log(`Parsing the Integer (30px) out: ${Number.parseInt('30px', 10)}`);
// console.log(`Second Example (e23) ${Number.parseInt('e23', 10)}`);

// console.log(`Parsing Float number (2.5rem): ${Number.parseFloat('2.5rem')}`);
// console.log(`Parsing Int number (2.5rem): ${Number.parseInt('2.5rem')}`);

// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20X'));
// console.log(Number.isNaN(23 / 0));
// // NOTE NOTEBest way to check if a value is a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20x'));
// console.log(Number.isFinite(23 / 0));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23.1));

// console.log(Math.sqrt(25));
// console.log('or');
// console.log(25 ** (1 / 2));

// console.log(Math.max(1, 2, 3, 4, 5, 6, 7));

// console.log(Math.PI);

// console.log(Math.trunc(Math.random() * 6) + 1);

// // Create a number between min and max
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(-100, 7));

//NOTE Rounding Integers
// console.log(Math.trunc(23.3));
// console.log(Math.round(23.3));
// console.log(Math.ceil(22.1));
// console.log(Math.floor(23.9));

// //NOTE NOTERound up to certain decimal places
// console.log(+(2.7523123).toFixed(3));

// const isEven = n =>
//   n % 2 === 0 ? console.log(`It's even!`) : console.log(`Its Odd!`);

// isEven(1241251234124);
//NOTE Application
// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

//Numeric Separaters
// const diameter = 282_399_182_897;

// const price = 345_99;
// console.log(price);

// const transferFee1 = 15_00;
// const transferfee2 = 1_500;

// console.log(Number('230_000'));

//NOTE BigInt -> Numbers can be stored with as large as possible

// console.log(262345623451234513456134134513451n); // or BigInt(1231234125123)

// const huge = 1231512312312431412312n;
// const hum = 23;
// console.log(huge * BigInt(hum));

//Exceptions
// console.log(20n > 15); //True
// console.log(20n === 20); //false
// console.log(typeof 20n); //bigint
// console.log(20n == '20'); //true

// console.log(
//   `once the number is working with a string, it will cut the "n" part off: huge = ${huge}`
// );
// console.log(11n / 3n); works too, but rounds up to the nearest bigInt, result = 3n
