import fs from 'fs'
import md5 from 'md5'
import _ from 'lodash'
import mkdirp from 'mkdirp'

const mkLayout = (categorys)=> {
    for (let categoryKey in categorys) {
        // pc tb 等等模块名
        let menus = ''
        let renderFactory = ''
        let render = ''

        let categoryInfo = categorys[categoryKey]
        let componentsInfo = categorys[categoryKey].components || []
        Object.keys(componentsInfo).map((item)=> {
            let nameMd5 = md5(item)

            // 为了语法,定义处必须换行
            menus += `\nconst menu${nameMd5} = [`

            renderFactory += `
            let Menu${nameMd5} = menuFactory(menu${nameMd5})
            `

            render += `
            <div className="title">${item}</div>
            {Menu${nameMd5}}
            `

            for (let component of categorys[categoryKey]['components'][item]) {
                menus += `
                {
                    title: '${component.name} ${_.capitalize(_.camelCase(component.path))}',
                    path: '/${categoryKey}/${component.path}',
                    icon: '${component.icon}'
                },
                `
            }

            menus += `]`
        })

        let text = `
        import React from 'react'
        import menuFactory from '../menu-factory'

        ${menus}

        export default class Layout extends React.Component {
            constructor(props) {
                super(props)
                this.state = {}
            }

            render() {
                ${renderFactory}

                return (
                    <div className="_namespace">
                        ${render}
                    </div>
                )
            }
        }
        `

        mkdirp(`src/layout/left-menu-${categoryKey}`, (err)=> {
            if (err) {
                return console.log(`mkdir src/layout/left-menu-${categoryKey} fail`, error)
            }

            fs.writeFile(`src/layout/left-menu-${categoryKey}/index.js`, text, (err)=> {
                if (!err)return
                console.log(`mk src/layout/left-menu-${categoryKey}/index.js fail: ${err}`)
            })
        })
    }
}

export default mkLayout