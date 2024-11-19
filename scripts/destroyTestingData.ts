/**************************************************************************************************************
- run like this:
  $ npx ts-node ./scripts/destroyTestingData.ts
**************************************************************************************************************/



//@ts-ignore
const { deleteAdmin } = require('./createUserData');



async function destroyData() {
  await deleteAdmin();
}

destroyData();