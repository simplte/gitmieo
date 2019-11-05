import program from 'commander';
import pkg from '../package.json';
import execa from 'execa'; //调用外部命令
import inquirer from 'inquirer'; //提供人机交互
import ora from 'ora'; // 等待交互
import Listr from 'listr'; // 等待交互
import chalk from 'chalk'; // 颜色console
import boxen from 'boxen' // 提示外框

export function cli(args) {

    program.version(pkg.version, '-V --version').usage('<command> [options]');

    program.command('start <food>')
        .option('-f, --fruit <name>', 'Fruit to be added')
        .option('-w, --water <name>', 'water to be added')
        .description('开始做饭')
        .action(function (food, option) {
            console.log(`run start command`);
            console.log(`argument:${food}`);
            console.log(`option:fruit= ${option.fruit}`)
            console.log(`option:water= ${option.water}`)
        })

    program.command('npmV')
        .description('npm 版本')
        .action(async function () {
            const {
                stdout
            } = await execa('npm -v');
            console.log('Npm 版本：', stdout);
        })

    program.command('ask').description('问你一些问题')
        .action(async function (option) {
            const answers = await inquirer.prompt([{
                    type: 'input',
                    name: 'name',
                    message: '你叫黑子吗',
                },
                {
                    type: 'confirm',
                    name: 'son',
                    message: '你是卜前程的儿子吗'
                },
                {
                    type: 'checkbox',
                    name: 'likedo',
                    choices: ['打fj', '打sq', 'lg'],
                    message: '你最喜欢干什么啊'
                },
                {
                    type: 'list',
                    name: 'girlcount',
                    choices: ['1', '2', '3'],
                    message: '你有几个女朋友啊'
                }
            ])
            console.log(answers)
        })

    program.command('wait')
        .description('wait 5 seconds')
        .action(async function (option) {
            const spinner = ora('waiting 5 seconds').start();
            let count = 5;

            await new Promise(resolve => {
                let interval = setInterval(() => {
                    if (count <= 0) {
                        clearInterval(interval);
                        spinner.stop();
                        resolve();
                    } else {
                        count--;
                        spinner.text = `waiting ${count} seconds`;
                    }
                }, 1000)
            });
        });

    program.command('steps')
        .description('some steps')
        .action(async function (option) {
            const tasks = new Listr([{
                    title: 'run step 1',
                    task: () =>
                        new Promise(resolve => {
                            setTimeout(() => resolve('1 done'), 1000);
                        })
                },
                {
                    title: 'run step 2',
                    task: () =>
                        new Promise((resolve) => {
                            setTimeout(() => resolve('2 done'), 1000)
                        })
                },
                {
                    title: 'Run step 3',
                    task: () =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => reject(new Error('Oh, my god')), 1000);
                        })
                }
            ])

            await tasks.run().catch(err => {
                console.log(chalk.yellow(err));
            });
        })
    console.log(boxen(chalk.red('I like cooking'), {
        padding: 1
    }));
    program.parse(args);
}