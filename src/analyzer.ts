import fs from "fs"
import cheerio from "cheerio"
import { TypeAnalyzer } from "./crowller"

interface Course {
  title: string
  count: number
}

interface CourseResult {
  time: number
  data: Course[]
}

interface Content {
  [propName: number]: Course[]
}

export class Analyzer implements TypeAnalyzer {
  private static instance: Analyzer

  static getInstance() {
    if (!Analyzer.instance) {
      Analyzer.instance = new Analyzer()
    }
    return Analyzer.instance
  }

  private getCourseInfo(html: string) {
    const $ = cheerio.load(html)
    const courseItems = $(".course-item")
    let courseInfos: Course[] = []
    courseItems.map((_, element) => {
      const descs = $(element).find(".course-desc")
      const title = descs.eq(0).text()
      const count = parseInt(descs.eq(1).text().split(": ")[1], 10)
      courseInfos.push({ title, count })
    })
    return {
      time: new Date().getTime(),
      data: courseInfos,
    }
  }

  private generateJsonContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {}
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"))
    }
    fileContent[courseInfo.time] = courseInfo.data
    return fileContent
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html)
    const fileContent = this.generateJsonContent(courseInfo, filePath)
    return JSON.stringify(fileContent)
  }

  private constructor() {}
}
