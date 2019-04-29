const { EOL } = require('os');
const test = require('ava');
const { format, truncateLines, parseGitUrl } = require('../lib/util');

test('format', t => {
  t.is(format('release v${version}', { version: '1.0.0' }), 'release v1.0.0');
  t.is(format('release v${version} (${name})', { version: '1.0.0', name: 'foo' }), 'release v1.0.0 (foo)');
  t.is(format('release v${version} (${name})', { version: '1.0.0', name: 'foo' }), 'release v1.0.0 (foo)');
});

test('format (back-compat)', t => {
  t.is(
    format('git log --pretty=format:"* %s (%h)" ${latestTag}...HEAD', { version: '1.0.0', latestTag: '2.0.0' }),
    'git log --pretty=format:"* %s (%h)" 2.0.0...HEAD'
  );
  t.is(format('v%s', { version: '1.0.0' }), 'v1.0.0');
  t.is(format('v%s ${version} %s', { version: '1.0.0' }), 'v1.0.0 1.0.0 1.0.0');
  t.is(
    format('git log --pretty=format:"* %s (%h)" [REV_RANGE]', { latestTag: '2.0.0' }),
    'git log --pretty=format:"* %s (%h)" 2.0.0...HEAD'
  );
});

test('truncateLines', t => {
  const input = `1${EOL}2${EOL}3${EOL}4${EOL}5${EOL}6`;
  t.is(truncateLines(input), input);
  t.is(truncateLines(input, 3), `1${EOL}2${EOL}3${EOL}...and 3 more`);
  t.is(truncateLines(input, 1, '...'), `1...`);
});

test('parseGitUrl', t => {
  t.deepEqual(parseGitUrl('https://github.com/webpro/release-it.git'), {
    host: 'github.com',
    owner: 'webpro',
    project: 'release-it',
    protocol: 'https',
    remote: 'https://github.com/webpro/release-it.git',
    repository: 'webpro/release-it'
  });

  t.deepEqual(parseGitUrl('git@gitlab.com:org/sub-group/repo-in-sub-group.git'), {
    host: 'gitlab.com',
    owner: 'org/sub-group',
    project: 'repo-in-sub-group',
    protocol: 'ssh',
    remote: 'git@gitlab.com:org/sub-group/repo-in-sub-group.git',
    repository: 'org/sub-group/repo-in-sub-group'
  });

  t.deepEqual(parseGitUrl('/Users/john/doe/owner/project'), {
    host: '',
    owner: 'owner',
    project: 'project',
    protocol: 'file',
    remote: '/Users/john/doe/owner/project',
    repository: 'owner/project'
  });
});
