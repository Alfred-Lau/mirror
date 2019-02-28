#!/usr/bin/env node

var program = require('commander');
var folders = require('../lib/util/folder')
const { Generator } = require('../lib/Generator')
var path = require('path')
const template = path.resolve(__dirname, '..', 'lib/template')
program
  .command('new <page>')
  .option("-n, --page", "input a name for your page")
  .action(function (dir, cmd) {
    const target = path.resolve(__dirname, '..', dir)
    const pageName = process.argv.pop() || 'demo'
    folders.deleteAll(target)
    folders.copyDir(template, pageName, `${process.cwd()}/src/routes`)

  })

program
  .command('add <module-name>')
  .action(async (dir, cmd) => {
    const instance = new Generator(dir)
    try {
      await instance.init()
    } catch (e) {
      
    }
  })

program.parse(process.argv)