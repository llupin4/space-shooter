const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const testFiles = fs.readdirSync(__dirname)
  .filter(file => file.startsWith('test-') && file.endsWith('.cjs'))
  .map(file => ({
    name: file.replace('test-', '').replace('.cjs', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    file: file,
    description: `Test: ${file}`
  }));

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`
}

function printHeader() {
  console.log('\n' + colorize('═'.repeat(60), 'cyan'));
  console.log(colorize('║', 'cyan') + colorize(' SPACE SHOOTER GAME - COMPLETE TEST SUITE', 'bold') + colorize(' ║', 'cyan'));
  console.log(colorize('═'.repeat(60), 'cyan') + '\n');
}

function printTestInfo(test) {
  console.log(colorize('┌─ ' + test.name, 'blue'));
  console.log(colorize('│  ', 'yellow') + test.description);
  console.log(colorize('└─', 'blue') + '\n');
}

function printResult(test, success) {
  console.log(colorize('\n' + '─'.repeat(60), 'cyan'));
  if (success) {
    console.log(colorize(`✓ ${test.name} PASSED`, 'green'));
  } else {
    console.log(colorize(`✗ ${test.name} FAILED`, 'red'));
  }
  console.log(colorize('─'.repeat(60), 'cyan') + '\n');
}

function printSummary(results) {
  console.log('\n' + colorize('╔' + '═'.repeat(58) + '╗', 'bold'));
  console.log(colorize('║', 'bold') + colorize(' TEST SUMMARY', 'bold').padEnd(56) + colorize(' ║', 'bold'));
  console.log(colorize('╠' + '═'.repeat(58) + '╣', 'bold'));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  results.forEach(result => {
    const status = result.success ? 
      colorize('✓ PASSED', 'green') : 
      colorize('✗ FAILED', 'red');
    console.log(colorize('║', 'bold') + ` ${result.name.padEnd(44)} ${status.padEnd(12)} ${colorize('║', 'bold')}`);
  });
  
  console.log(colorize('╠' + '═'.repeat(58) + '╣', 'bold'));
  console.log(colorize('║', 'bold') + ` ${colorize('TOTAL:', 'cyan')}${` ${testFiles.length} tests`.padEnd(44)} ${colorize(`${passed} passed`, 'green').padEnd(12)} ${colorize('║', 'bold')}`);
  console.log(colorize('║', 'bold') + ` ${colorize('PASSED:', 'green')}${` ${passed} tests`.padEnd(44)} ${colorize(`${failed} failed`, failed > 0 ? 'red' : 'green').padEnd(12)} ${colorize('║', 'bold')}`);
  console.log(colorize('╚' + '═'.repeat(58) + '╝', 'bold') + '\n');
  
  return passed === testFiles.length;
}

async function runTest(test) {
  return new Promise((resolve) => {
    printTestInfo(test);
    
    const child = spawn('node', [path.join(__dirname, test.file)], {
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      resolve({
        name: test.name,
        success: code === 0
      });
    });
  });
}

async function runAllTests() {
  printHeader();
  
  console.log(colorize(`Found ${testFiles.length} test files`, 'cyan') + '\n');
  console.log(colorize('Starting test execution...', 'yellow') + '\n');
  
  const results = [];
  
  for (const test of testFiles) {
    try {
      const result = await runTest(test);
      results.push(result);
      printResult(test, result.success);
    } catch (error) {
      console.log(colorize(`✗ ${test.name} ERROR: ${error.message}`, 'red'));
      results.push({
        name: test.name,
        success: false
      });
    }
  }
  
  const allPassed = printSummary(results);
  
  console.log(colorize(allPassed ? 
    '✓ ALL TESTS PASSED!' : 
    '✗ SOME TESTS FAILED', 
    allPassed ? 'green' : 'red'
  ).padEnd(60) + '\n');
  
  process.exit(allPassed ? 0 : 1);
}

runAllTests().catch(error => {
  console.error(colorize('FATAL ERROR:', 'red'), error.message);
  process.exit(1);
});
