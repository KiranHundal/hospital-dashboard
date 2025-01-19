module.exports = {
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!lucide-react)"],
  testEnvironment: "jsdom",
};
