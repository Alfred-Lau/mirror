const path = require('path')
const { Base } = require('./Base');

const INDEX_VIEW_FILE_PATH = process.cwd()
const INDEX_VIEW_FILE_NAME = 'index.js'

class IndexView extends Base {
  private moduleName: string;
  private sourceStr: string;
  private content: any;
  
  constructor(moduleName: string, content: object) {
    super();
    this.moduleName = moduleName;
    this.sourceStr = '';
    this.content = content;
    this.breadcrumb = this.resolveBreadcrumb();
  }
  resolveBreadcrumb() {
    
  }
  resolveColumns(columns) {
    if (!Array.isArray(columns)) {
      return;
    }
    if (!columns.length) {
      return;
    }
    const fn = item => ({
      title: item.title,
      dataIndex: item.key,
      key: item.key,
    })

    return columns.map(fn)
  }

  resolveCustomItem(customItem) {
    if (!Array.isArray(customItem)) {
      return;
    }
    if (!customItem.length) {
      return;
    }
    const fn = item => ({
        label: item.label,
        id: item.id,
        render: item.render,
    })
    return customItem.map(fn)
  }

  _renderImportDeclaration() {
    this.sourceStr = `
      import React, {Component} from 'react';
      import {ZcyList,Input,ZcyBreadcrumb} from 'doraemon';
    `
  }
  _renderConstantVariable() {
    const columnsRaw = this.content.index.columns
    const customItemRaw = this.content.index.custom
    console.log(this.resolveCustomItem(customItemRaw))
    const other = `
    const columns = ${JSON.stringify(this.resolveColumns(columnsRaw))};
    const customItem = ${JSON.stringify(this.resolveCustomItem(customItemRaw))};
    `
    this.sourceStr = this.append(this.sourceStr, other)
  }
  _renderClass() {
    const title = this.moduleName.toUpperCase()
    const classContent = `
      export default class ${title} extends Component {
        render(){
          return (
            <div>
              <ZcyBreadcrumb
                routes={breadcrumb}
              />
              <ZcyList
                customItem={customItem}
                tabs={tabs}
                tabKey="type"
                table={{
                  columns:columns,
                  dataSource: [],
                }}
              />
            </div>
          )
        }
      }
    `
    this.sourceStr = this.append(this.sourceStr, classContent)
  }

  _write(str: string, file: string) {
    this.writeToFile(str, file)
  }
  async prepare() {
    const file = path.join(INDEX_VIEW_FILE_PATH, '/', INDEX_VIEW_FILE_NAME)
    try {
      await this._renderImportDeclaration()
      await this._renderConstantVariable()
      await this._renderClass()
      await this._write(this.sourceStr, file)
    } catch (error) {
      console.error(error);
    }

  }
}

export {
  IndexView
};