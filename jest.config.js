const config = {
  transform: { "^.+\\.tsx$": "ts-jest", "^.+\\.ts$": "ts-jest" },
  testEnvironment: 'jsdom',
  roots: ['src'],
};
module.exports = config;