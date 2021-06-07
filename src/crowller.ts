import fs from "fs"
import path from "path"
import superagent from "superagent"
import { Analyzer } from "./analyzer"

export interface TypeAnalyzer {
  analyze: (html: string, filePath: string) => string
}

class Crowller {
  private filePath = path.resolve(__dirname, "../data/course.json")

  private async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }

  private async initSpiderProcess() {
    const html = await this.getRawHtml()
    const fileContent = this.analyzer.analyze(html, this.filePath)
    this.writeFile(fileContent)
  }

  constructor(private url: string, private analyzer: TypeAnalyzer) {
    this.initSpiderProcess()
  }
}

const secret = "XXX"
const url = `http://www.XXX.com/typescript/demo.html?secret=${secret}`

const analyzer = Analyzer.getInstance()
new Crowller(url, analyzer)
console.log("1object")
