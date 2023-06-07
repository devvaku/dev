/**
 * Main File for handling
 * Sop Index
 * @author Vaibhav Kumar
 * @version 0.0.1
 */


/**
 * @class XHR
 * Class to handel XHR Requests
 * @version 0.0.1
 */
class XHR {
  constructor() {
  }
  #xhr(method, url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.onload = (data) => {
        resolve(xhr.responseText)
      }
      xhr.open(method, url, true)
      xhr.send()
    })
  }

  async get(url) {
    return await this.#xhr('GET', url)
  }
}


(async () => {

  let current = null

  async function listIndex(indexData) {
    let indexEle = document.getElementById("index")
    // create root ul
    let root = document.createElement('ul')
    indexEle.appendChild(root)

    let defaultActive = "Ariba"
    
    for ( let levels of indexData ) {
      // levels
      for ( let index of levels ) {
        // console.log(index)
        let ele = document.createElement('li')
        ele.setAttribute("id", index.cId)
        // ele.setAttribute("tabindex", -1)
        if ( !window.location.hash && index.name == defaultActive ) {
          window.location.hash = index.cId
          // ele.classList.add("active")
          // window.frames["sop"].src = './'+index.file
          // current = index
        }
        ele.innerHTML = `<span class="c_indexName"><a href="#${index.cId}">${index.name}</a></span>`
        
        if ( index.parent ) {
          // children[1] because to get <ul>
          let pEle = document.getElementById(index.parent.cId).querySelector("ul")
          if ( pEle == null ) {
            document.getElementById(index.parent.cId).innerHTML += "<ul></ul>"
            pEle = document.getElementById(index.parent.cId).querySelector("ul")
          }
          pEle.parentElement.classList.add("haveChild")
          pEle.appendChild(ele)
        } else {
          root.appendChild(ele)
        }
        let afterEle = document.getElementById(index.cId)
        if ( window.location.hash == '#' + afterEle.id ) {
          // make it actove and all its class
          document.querySelector("li.active")?.classList.toggle("active")
          afterEle.classList.add("active")
          window.frames["sop"].src = './'+index.file
          let par = index.parent
          current = index
          while (par) {
            document.getElementById(par.cId).classList.add("active")
            par = par.parent
          }
        }
      }
    }
    return root
  }


  let clicks = {
    indexName: (ele) => {
      let liEle = ele.parentElement
      if ( !liEle.classList.contains("haveChild") ) {
        return
      }
      let ulEle = liEle.parentElement
      // remove any other active in ul > li
      if ( !liEle.classList.contains("active") ) {
        ulEle.querySelector("li.active")?.classList.toggle("active")
      }
      liEle.classList.toggle("active")
      console.log("TOggled..")
    },
    prev: (ele) => {
      if ( current.parent ) {
        window.location.hash = current.parent.cId
      } else {
        let curEle = document.getElementById(current.cId)
        if ( curEle.previousElementSibling ) {
          window.location.hash = curEle.previousElementSibling.id
        }

      }
    },
    next: (ele) => {
      let curEle = document.getElementById(current.cId)
      let ulEle = curEle.querySelector("ul > li")
      if ( ulEle ) {
        console.log(ulEle)
        window.location.hash = ulEle.id
        return
      }
      if ( curEle.nextElementSibling ) {
        console.log(curEle.nextElementSibling)
        window.location.hash = curEle.nextElementSibling.id
        return
      }
      // parse parent
      let par = curEle.parentElement.parentElement
      let maxItr = 5
      while(par) {
        if ( par.nextElementSibling ) {
          window.location.hash = par.nextElementSibling.id
          return
        }
        par = par.parentElement.parentElement
        maxItr -= 1
      }
      // if hear means this is last index
      // the go to first Index
      window.location.hash = document.querySelector("div#index > ul > li").id
    },
    openAttach: (ele) => {
      window.open(ele.href,'_blank')
    },
    downAttach: (ele) => {
      window.open(ele.href,'_blank')
    }
  }
  
  async function handleClicks() {
    window.addEventListener("click", eve => {
      let c = [...eve.target.classList].filter(el=>el.indexOf("c_") != -1)[0]?.slice(2)
      if ( c && clicks[c] ) {
        clicks[c](eve.target)
      }
    })
  }

  async function doThings() {
    document.getElementById("current").innerText = current.id
    
    // update attachements uris
    if ( current.attachs.length > 0 ) {
      document.getElementById("attachs").classList.add("attach")
    } else {
      document.getElementById("attachs").classList.remove("attach")
      return
    }
    let attachListEle = document.querySelector("#attachs>div.attach_list")
    for( let attach of current.attachs ) {
      let newAttachEle = document.createElement('div')
      newAttachEle.setAttribute('class','attach')
      let openEle = document.createElement('span')
      openEle.classList.add('openAttach')
      openEle.classList.add('c_openAttach')
      openEle.href = attach.uri
      openEle.innerText = attach.name

      let downEle = document.createElement('span')
      downEle.classList.add('downAttach')
      downEle.classList.add('c_downAttach')
      downEle.href = attach.downLink
      downEle.innerText = '\u21E9'
      
      newAttachEle.appendChild(openEle)
      newAttachEle.appendChild(downEle)
      attachListEle.appendChild(newAttachEle)
    }
  }

  // console.log(indexStr)
  let isop = new IndexSOP(indexStr)
  let iData = isop.parse()
  console.log(iData)
  listIndex(iData['index'])
  .then(handleClicks)
  .then(_ => {
    console.log("Current", current)
    doThings()
  })
  
  window.addEventListener("hashchange", _ => {
    window.location.reload()
  })
  
})()