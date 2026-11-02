const MOCK_USERS = [
  {
    id: 1,
    name: "Company A Admin",
    email: "admin@companya.com",
    password: "123456",
    company: {
      id: 1,
      name: "Company A",
      code: "COMPANY_A",
    },
    modules: [
      "administration",
      "credit-management",
    ],
    permissions: ["*"],
  },
  {
    id: 2,
    name: "Company B Admin",
    email: "admin@companyb.com",
    password: "123456",
    company: {
      id: 2,
      name: "Company B",
      code: "COMPANY_B",
    },
    modules: [
      "administration",
      "credit-management",
      "loan-management",
    ],
    permissions: ["*"],
  },
  {
    id: 3,
    name: "Company C Admin",
    email: "admin@companyc.com",
    password: "123456",
    company: {
      id: 3,
      name: "Company C",
      code: "COMPANY_C",
    },
    modules: [
      "administration",
      "collection",
      "finance",
    ],
    permissions: ["*"],
  },
];

const STORAGE_KEY = "microfinance_mock_session";

export const mockAuthService = {
  login(email, password) {
    const user = MOCK_USERS.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // Do not store the mock password in the session.
    const { password: _, ...session } = user;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(session)
    );

    return session;
  },

  getSession() {
    const session = localStorage.getItem(STORAGE_KEY);

    return session ? JSON.parse(session) : null;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  },
};