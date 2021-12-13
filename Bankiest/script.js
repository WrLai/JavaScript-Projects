'use strict';

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
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    
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

//NOTE transfer

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

//NOTE Close account
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

