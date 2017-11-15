module.exports = function (shipit) {
    require('shipit-deploy')(shipit);

    shipit.initConfig({
        default: {
            workspace: '/tmp/niemeyer',
            repositoryUrl: 'git@github.com:hackaetano/niemeyer.git',
            ignores: ['.git', 'node_modules'],
            keepReleases: 4,
            servers: 'ubuntu@hackaetano.com'
        },
        production: {
            deployTo: '/home/ubuntu/niemeyer/production',
            environment: 'production',
            branch: 'master',
            port: '8080'
        }
    });

    shipit.blTask('npm',['deploy'], function() {
        return shipit.remote('cd '+shipit.releasePath+' && npm install');
    });

    shipit.blTask('restart',['npm'], function() {
        shipit.remote('pm2 delete niemeyer || true'
            + ' && cd ' + shipit.currentPath
            + ' && export PORT=' + shipit.config.port
            + ' && export NODE_ENV=production'
            + ' && pm2 start bin/www -f --name=niemeyer');
    });

    shipit.start('deploy', 'npm', 'restart');
};
