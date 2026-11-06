
// import { configureStore } from "@reduxjs/toolkit";

// import auth from "../features/auth/slices/authSlice";
// import company from "../features/subscriptions/slices/companySlice";
// import users from "../features/core/users/store/usersSlice";

// export const store = configureStore({
//   reducer: {
//     auth,
//     company,
//     users,
//   },
// });


// app/store/store.js

import { configureStore } from "@reduxjs/toolkit";
import { APP_REDUCERS } from "../features/generated/reducers";

export const store = configureStore({
  reducer: APP_REDUCERS,
});