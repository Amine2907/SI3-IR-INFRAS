// jest.config.js
module.exports = {
    transform: {
        '^.+\\.js$': 'babel-jest', // Use Babel to transform your JS files
    },
    testEnvironment: 'node', // Set the test environment to Node
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'], // Allow these extensions
};