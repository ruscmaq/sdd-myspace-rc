const fs = require('fs');
const assert = require('assert');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const content = fs.readFileSync(schemaPath, 'utf8');

assert(content.includes('model LeaveBalance'), 'Expected LeaveBalance model in Prisma schema');
assert(content.includes('model LeaveRequest'), 'Expected LeaveRequest model in Prisma schema');
assert(content.includes('model LeaveType') || content.includes('leaveType String'), 'Expected leave type reference in schema');
assert(content.includes('@@index([employeeId, createdAt])') || content.includes('@@index([employeeId, leaveTypeId])'), 'Expected index on employeeId for read performance');
assert(content.includes('entitlement') || content.includes('remaining'), 'Expected entitlement/remaining fields in LeaveBalance');
assert(content.includes('fromDate') && content.includes('toDate'), 'Expected fromDate and toDate fields in LeaveRequest');

console.log('Prisma schema definitions are present and match task 1.1 requirements.');
