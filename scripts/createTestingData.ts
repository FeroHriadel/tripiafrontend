/**************************************************************************************************************
- run like this:
  $ npx ts-node ./scripts/createTestingData.ts
**************************************************************************************************************/



//@ts-ignore
const { createAdmin } = require('./createUserData');



async function createData() {
  await createAdmin();
}

createData();