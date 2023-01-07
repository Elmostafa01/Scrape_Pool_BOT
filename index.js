const puppeteer = require('puppeteer');
const twilio = require('twilio');

const accountSid = 'XXXXXXXXXXXXXXXXXXXXXXX'; // <== Your twilio Account SID
const authToken = 'XXXXXXXXXXXXXXXXXXXXXXXX';   // <== Your twilio Auth Token
const client = new twilio(accountSid, authToken);

async function checkPool () {
  const browser = await puppeteer.launch({ headless: false});
  const page = await browser.newPage()
  const navigationPromise = page.waitForNavigation()

  await page.goto('https://candidature.1337.ma')

  await page.setViewport({ width: 1920, height: 929 })

  await page.waitForSelector('#user_email')
  await page.click('#user_email');
  await page.type('#user_email', 'Exampletest@email.com'); // <== 'Enter your email'

  await page.waitForSelector('#user_password')
  await page.click('#user_password')
  await page.type('#user_password','Passwordtest') // <== 'Enter your passWord'

  await page.waitForSelector('#subs-signin > #new_user > .form-inputs > .form-actions > .btn')
  await page.click('#subs-signin > #new_user > .form-inputs > .form-actions > .btn')

  await navigationPromise

  let tableExists = false;
  try {
    await page.waitForSelector('table');
    tableExists = true;
  } catch (error) {
    tableExists = false;
  }

  if (tableExists) {
    client.messages
      .create({
        body: 'GO!GO! POOL IS HERE!',
        from: '+16802062096', // <== Your twilio Phone Number
        to: '+212628295748'  // <== Your phone Number
      })
      .then(message => console.log(message.sid))
      .done();
  } else {
    client.messages
      .create({
        body: 'NO POOL',
        from: '+16802062096', // <== Your twilio Phone Number
        to: '+212628295748' // <== Your phone Number
      })
      .then(message => console.log(message.sid))
      .done();
  }

  setTimeout(() => {
    browser.close();
  }, 5000);
}

  
  checkPool()
    .then(() => {
      console.log('you have been logged in successfully')
    })
    .catch((error) => {
      console.log(error)
    });
  