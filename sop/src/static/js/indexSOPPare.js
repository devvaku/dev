
/**
 * haha no comments | Evil :D
 */

class IndexSOP {
  constructor(indexStr) {
    this.iStr = indexStr
    this.sopDirIndex = 'sop folder'
    this.sopPath = window.location.href.split("/").slice(0,-1).join("/")
    console.log(this.sopPath)
  }
  #lp = {
    index: (data, prevData) => {
      let ll = data.split("\n").filter(el=>el.trim())
      let d = []

      for(let l of ll ) {
        let [level, data] = l.split(':').map(el=>el.trim())
        level = level.length - 1
        let [name, fr, attachs] = data.split('|')
        attachs = attachs?.split(',') || []
        let parent = d[level-1] && d[level-1].slice(-1)[0] // last node in previous level
        let id = (parent?.id || '') + '/' + name
        let path = `${prevData[this.sopDirIndex]}${id}`
        let absPath = `${this.sopPath}/${prevData[this.sopDirIndex]}${id}`
        let file = `${path}/${name}.htm`
        attachs = attachs.map(attach => {
          let atta = {name:"",uri:"",type:"", downLink:""}
          let [aName, aOpt]  = attach.split(";")
          if ( aOpt == 'new' ) { aOpt = 'nft' }
          else if ( aOpt == 'view' ) {  aOpt = 'ofv'}
          atta.name = aName
          
          // nft for for every file to mistakenly editing original
          aOpt = 'nft'
          let ext = aName.split(".").slice(-1)[0]
          switch(ext) {
            case "xls":
            case "xlsx":
            case "xlsm":
              aOpt = aOpt || 'ofv'
              atta.uri = `ms-excel:${aOpt}|u|${absPath}/Attachments/${aName}`
              atta.downLink = `${absPath}/Attachments/${aName}`
              break;
            case "doc":
            case "docx":
              aOpt = aOpt || 'ofv'
              atta.uri = `ms-word:${aOpt}|u|${absPath}/Attachments/${aName}`
              atta.downLink = `${absPath}/Attachments/${aName}`
              break;
          }
          return atta
          // return `${prevData[this.sopDirIndex]}${id}/${attach}`
        })
        // fire redirect
        if ( fr ) {
          file = `${prevData[this.sopDirIndex]}/${fr}/${fr.split("/").slice(-1)[0]}.htm`
          // attachs = attachs.map(attach => {
          //   return `${prevData[this.sopDirIndex]}/${fr}/${attach}`
          // })
        }
        let cId = ((parent?.cId || '') + '_' + name)
        if ( !d[level] ) d[level] = []
        d[level].push({id,name, file, parent, cId, fr, attachs})
      }
      
      return d
    }
  }
  parseLines(type, data, prevData) {
    if ( this.#lp[type] ) {
      return this.#lp[type](data, prevData)
    }
    return data
  }
  parse() {
    let lines = this.iStr.trim().split("\n\n").filter(el => el.trim()).map(el=>el.trim().split("="))
    let data = {}
    for ( let line of lines ) {
      let [i,v] = line.map(el=>el.trim())
      data[i] = this.parseLines(i,v, data)
    }
    return data
  }
}