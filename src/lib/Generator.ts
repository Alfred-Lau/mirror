const path = require('path')
import { IndexView } from './IndexView'

const TARGET = path.join(process.cwd(), '/test', 'config.js')

class Generator {
  private moduleName: string;
  private content: object;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
    this.content = require(TARGET)

  }
  _getMetaData(filePath: string) {
    
  }
  async init() {
    const instance = new IndexView(this.moduleName, this.content);
    await instance.prepare()
  }
}

export {
  Generator
}
