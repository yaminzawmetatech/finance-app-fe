
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");
const customer = process.argv[2];

if (!customer) {
  console.error("Please provide a customer name.");
  process.exit(1);
}

const configPath = path.join(
  projectRoot,
  "build-config",
  `${customer}.js`
);

try {
  // ==========================================
  // 1. Load customer configuration
  // ==========================================

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Customer configuration not found: ${customer}`
    );
  }

  const { default: config } = await import(
    pathToFileURL(configPath).href
  );

  if (!config || !Array.isArray(config.modules)) {
    throw new Error(
      "Invalid customer configuration: modules must be an array."
    );
  }

  // ==========================================
  // 2. Available modules and dependencies
  // ==========================================

  const availableModules = {
    core: {
      path: "src/features/core",
      dependencies: [],
    },

    "approval-workflow": {
      path: "src/features/capabilities/approval-workflow",
      dependencies: ["core"],
    },

    "credit-management": {
      path: "src/features/credit-management",
      dependencies: ["core", "approval-workflow"],
    },

    "loan-management": {
      path: "src/features/loan-management",
      dependencies: ["core", "approval-workflow"],
    },

    collection: {
      path: "src/features/collection",
      dependencies: ["core", "approval-workflow"],
    },

    finance: {
      path: "src/features/finance",
      dependencies: ["core", "approval-workflow"],
    },
  };

  // ==========================================
  // 3. Resolve selected modules and dependencies
  // ==========================================

  const selectedModules = new Set();

  function resolveModule(moduleId) {
    if (!availableModules[moduleId]) {
      throw new Error(`Unknown module: ${moduleId}`);
    }

    if (selectedModules.has(moduleId)) {
      return;
    }

    selectedModules.add(moduleId);

    for (const dependency of availableModules[moduleId].dependencies) {
      resolveModule(dependency);
    }
  }

  // Core is always required.
  resolveModule("core");

  for (const moduleId of config.modules) {
    resolveModule(moduleId);
  }

  // ==========================================
  // 4. Prepare output directory
  // ==========================================

  const outputDir = path.join(
    projectRoot,
    "dist-packages",
    customer
  );

  fs.rmSync(outputDir, {
    recursive: true,
    force: true,
  });

  fs.mkdirSync(outputDir, {
    recursive: true,
  });

  // ==========================================
  // 5. Copy shared application files
  // ==========================================

  const sharedFolders = [
    "src/app",
    "src/shared",
    "src/components",
    "src/config",
    "src/assets",
    "src/constants",
    "src/core",
    "src/hooks",
    "src/layouts",
    "src/styles",
    "src/App.css",
    "src/index.css",
    "src/main.jsx",
    "src/features/generated",
    "src/features/auth",
    "src/features/administration"
  ];

  for (const folder of sharedFolders) {
    const source = path.join(projectRoot, folder);

    if (fs.existsSync(source)) {
      const destination = path.join(outputDir, folder);

      fs.mkdirSync(path.dirname(destination), {
        recursive: true,
      });

      fs.cpSync(source, destination, {
        recursive: true,
      });
    }
  }

  // ==========================================
  // 6. Copy selected modules and dependencies
  // ==========================================

  for (const moduleId of selectedModules) {
    const source = path.join(
      projectRoot,
      availableModules[moduleId].path
    );

    if (!fs.existsSync(source)) {
      throw new Error(
        `Module folder does not exist: ${source}`
      );
    }

    const destination = path.join(
      outputDir,
      availableModules[moduleId].path
    );

    fs.mkdirSync(path.dirname(destination), {
      recursive: true,
    });

    fs.cpSync(source, destination, {
      recursive: true,
    });
  }

  // ==========================================
  // 7. Generate main application routes
  // ==========================================

  const routeDefinitions = {
    core: {
      path: "administration/*",
      importPath: "../core/coreRoutes",
      importName: "CoreRoutes",
      exportName: "default",
    },

    "credit-management": {
      path: "credit-management/*",
      importPath: "../credit-management",
      importName: "CreditManagementRoutes",
      exportName: "named",
    },

    "loan-management": {
      path: "loan-management",
      importPath: "../loan-management/pages/LoanDashboard",
      importName: "LoanDashboard",
      exportName: "default",
    },

    collection: {
      path: "collection",
      importPath: "../collection/pages/CollectionDashboard",
      importName: "CollectionDashboard",
      exportName: "default",
    },

    finance: {
      path: "finance",
      importPath: "../finance/pages/FinanceDashboard",
      importName: "FinanceDashboard",
      exportName: "default",
    },
  };

  const imports = [];
  const routes = [];

  for (const moduleId of selectedModules) {
    const definition = routeDefinitions[moduleId];

    if (!definition) continue;

    const importStatement =
      definition.exportName === "named"
        ? `import { ${definition.importName} } from "${definition.importPath}";`
        : `import ${definition.importName} from "${definition.importPath}";`;

    imports.push(importStatement);

    routes.push(`{
      path: "${definition.path}",
      Component: ${definition.importName},
    }`);
  }

  const generatedModuleRoutes = `
// Automatically generated for ${customer}.
// Do not edit manually.

${imports.join("\n")}

export const moduleRoutes = [
  ${routes.join(",\n")}
];
`;

  // ==========================================
  // 8. Generate internal feature routes
  // ==========================================

  const routeImports = [];
  const routeArrays = [];

  // Approval Workflow
  if (selectedModules.has("approval-workflow")) {
    routeImports.push(
      'import { approvalRoutes } from "../capabilities/approval-workflow/routes";'
    );

    routeArrays.push("...approvalRoutes");
  }

  // Credit Management
  if (selectedModules.has("credit-management")) {
    routeImports.push(
      'import CreditManagementRoutes from "../credit-management/routes/creditManagementRoutes";'
    );

    routeArrays.push("...CreditManagementRoutes");
  }

  const generatedRoutesContent = `
// Automatically generated for ${customer}.
// Do not edit manually.

${routeImports.join("\n")}

export const APP_ROUTES = [
  ${routeArrays.join(",\n")}
];
`;

  // ==========================================
  // 9. Write generated route files
  // ==========================================

  const generatedDir = path.join(
    outputDir,
    "src/features/generated"
  );

  fs.mkdirSync(generatedDir, {
    recursive: true,
  });

  // Main application routes
  fs.writeFileSync(
    path.join(generatedDir, "moduleRoutes.jsx"),
    generatedModuleRoutes,
    "utf8"
  );

  // Internal feature routes
  fs.writeFileSync(
    path.join(generatedDir, "routes.js"),
    generatedRoutesContent,
    "utf8"
  );

  // ==========================================
  // 10. Copy project configuration files
  // ==========================================

  const configFiles = [
    "package.json",
    "package-lock.json",
    "index.html",
    "vite.config.js",
  ];

  for (const file of configFiles) {
    const source = path.join(projectRoot, file);

    if (fs.existsSync(source)) {
      fs.copyFileSync(
        source,
        path.join(outputDir, file)
      );
    }
  }

  // ==========================================
  // 11. Success report
  // ==========================================

  console.log("\n================================");
  console.log(" CUSTOMER PACKAGE GENERATED");
  console.log("================================");

  console.log("\nCustomer:", config.name);
  console.log("Package ID:", customer);

  console.log("\nIncluded modules:");

  for (const moduleId of selectedModules) {
    console.log("  +", moduleId);
  }

  console.log("\nGenerated files:");
  console.log("  + src/features/generated/moduleRoutes.jsx");
  console.log("  + src/features/generated/routes.js");

  console.log("\nOutput:", outputDir);
  console.log("\n================================\n");

} catch (error) {
  console.error("\nPackaging failed:", error.message);
  process.exit(1);
}
