const path = require('path')
const { Base } = require('./Base');

const INDEX_VIEW_FILE_PATH = process.cwd()
const INDEX_VIEW_FILE_NAME = 'index.js'

class IndexView extends Base {
  private moduleName: string;
  private sourceStr: string;
  private content: string;
  
  constructor(moduleName: string, content: string) {
    super();
    this.moduleName = moduleName;
    this.sourceStr = '';
    this.content = content;
    this.breadcrumb = this.resolveBreadcrumb();
  }
  resolveBreadcrumb() {
    
  }
  _renderImportDeclaration() {
    this.sourceStr = `
      import React, {Component} from 'react';
    `
  }
  _renderConstantVariable() {
    const other = `const columns = [{title:'姓名'},{title:'年龄'}]
    `
    this.sourceStr = this.append(this.sourceStr, other)
  }
  _renderClass() {
    
  }

  _write(str: string, file: string) {
    this.writeToFile(str, file)
  }
  async prepare() {
    const file = path.join(INDEX_VIEW_FILE_PATH, '/', INDEX_VIEW_FILE_NAME)
    await this._renderImportDeclaration()
    await this._renderConstantVariable()
    await this._write(this.sourceStr, file)

  }
}

export {
  IndexView
};